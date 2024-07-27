"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Adjust the import path as necessary

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <p>Please sign in</p>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Profile;
