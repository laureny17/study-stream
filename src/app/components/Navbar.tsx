"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig"; // Your Firebase configuration
import { onAuthStateChanged, signOut, User } from "firebase/auth"; // Import User type
import Link from "next/link";
import styles from "./Navbar.module.css"; // Import the CSS module

const Navbar = () => {
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
    <header className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.navbarBrand}>
          Study Stream
        </Link>
        <Link href="/profile" className={styles.navbarLink}>
          Profile
        </Link>
        <Link href="/friends" className={styles.navbarLink}>
          Friends
        </Link>
      </div>
      <nav className={styles.navbarRight}>
        {user ? (
          <>
            <button onClick={handleSignOut} className={styles.button}>
              Sign Out
            </button>
            <span>Welcome, {user.displayName}</span>
          </>
        ) : (
          <Link href="/login" className={styles.button}>
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
