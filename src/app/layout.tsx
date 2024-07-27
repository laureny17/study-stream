"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig"; // Your Firebase configuration
import { onAuthStateChanged, signOut, User } from "firebase/auth"; // Import User type
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Use the User type from Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to the login page upon successful sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="navbar-left">
            <Link href="/" className="navbar-brand">
              Study Stream
            </Link>
            <Link href="/profile" className="navbar-link">
              Profile
            </Link>
            <Link href="/friends" className="navbar-link">
              Friends
            </Link>
          </div>
          <nav className="navbar-right">
            {user ? (
              <>
                <button onClick={handleSignOut}>Sign Out</button>
                <span>Welcome, {user.displayName}</span>
              </>
            ) : (
              <Link href="/login">Login with Google</Link>
            )}
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
