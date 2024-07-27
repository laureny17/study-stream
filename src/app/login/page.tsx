// src/app/login/page.tsx

"use client";

import { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Import the Firestore instance

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userRef = doc(db, "users", user.email!);

      // Check if user already exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          friends: [],
          sentRequests: [],
          receivedRequests: [],
        });
      }

      // Redirect or handle post-login logic
      // For example, redirect to a home page or show a success message
    } catch (err) {
      setError("Failed to sign in with Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? "Signing In..." : "Sign In with Google"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
