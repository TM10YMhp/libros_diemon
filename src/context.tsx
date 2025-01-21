import { createContext, use, useCallback, useEffect, useState } from "react";
import { addPoints, getUser, redeem } from "./api";
import { Book, User } from "./types";

// https://kentcdodds.com/blog/how-to-optimize-your-context-value

const UserStateContext = createContext<User | undefined | null>(null);
const UserUpdaterContext = createContext<
  React.Dispatch<React.SetStateAction<User | undefined>>
>(() => null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser().then((x) => setUser(x));
  }, []);

  return (
    <UserStateContext value={user}>
      <UserUpdaterContext value={setUser}>{children}</UserUpdaterContext>
    </UserStateContext>
  );
}

export function useUserState() {
  const user = use(UserStateContext);
  if (user === null) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return { user };
}

export function useUserUpdater() {
  const setUser = use(UserUpdaterContext);

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
