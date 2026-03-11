import { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateUserId } from "./userId.ts";

const UserIdContext = createContext<string | null>(null);

export function UserIdProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    getOrCreateUserId().then(setUserId);
  }, []);

  if (!userId) return null;
  return (
    <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
  );
}

export const useUserId = () => {
  const userId = useContext(UserIdContext);
  if (!userId)
    throw new Error("useUserId must be used within a UserIdProvider");
  return userId;
};
