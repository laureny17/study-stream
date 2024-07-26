import { useEffect, useState } from "react";
import { ClerkLoaded, useUser } from "@clerk/nextjs";

interface User {
  email: string | null;
  firstName: string | null;
}

export const useAuth = () => {
  const { user } = useUser();

  const [authUser, setAuthUser] = useState<User>({
    email: null,
    firstName: null,
  });

  useEffect(() => {
    if (user) {
      setAuthUser({
        email: user.emailAddresses[0]?.emailAddress || null,
        firstName: user.firstName || null,
      });
    }
  }, [user]);

  return {
    user: authUser,
  };
};
