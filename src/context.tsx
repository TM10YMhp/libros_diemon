import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { addPoints, getUser, redeem } from "./api";
import { Book, User } from "./types";

// https://kentcdodds.com/blog/how-to-optimize-your-context-value

const UserStateContext = createContext<User | null>(null);
const UserUpdaterContext = createContext<
  React.Dispatch<React.SetStateAction<User | null>>
>(() => null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <UserStateContext.Provider value={user}>
      <UserUpdaterContext.Provider value={setUser}>
        {children}
      </UserUpdaterContext.Provider>
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const user = useContext(UserStateContext);
  if (user === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return { user };
}

export function useUserUpdater() {
  const setUser = useContext(UserUpdaterContext);

  if (setUser === undefined) {
    throw new Error("useUserUpdater must be used within a UserProvider");
  }

  const handleRedeem = useCallback((book: Book) => {
    redeem(book).then(() => {
      setUser((user) => user && { ...user, points: user.points - book.pages });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPoints = useCallback((amount: number) => {
    addPoints(amount).then(() => {
      setUser((user) => user && { ...user, points: user.points + amount });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    addPoints: handleAddPoints,
    redeem: handleRedeem,
  };
}
