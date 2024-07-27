"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Adjust the import path as necessary

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account");
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
