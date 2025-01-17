import { createContext, useContext, useEffect, useState } from "react";
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

  async function handleRedeem(book: Book) {
    return redeem(book).then(() => {
      setUser((user) => {
        if (!user) return user;
        return { ...user, points: user.points - book.pages };
      });
    });
  }

  async function handleAddPoints(amount: number) {
    return addPoints(amount).then(() => {
      setUser((user) => {
        if (!user) return user;
        return { ...user, points: user.points + amount };
      });
    });
  }

  return {
    addPoints: handleAddPoints,
    redeem: handleRedeem,
  };
}
