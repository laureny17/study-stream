"use client";

import { useState } from "react";
import { db } from "@/firebase"; // Ensure correct path
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const AddFriend = () => {
  const [email, setEmail] = useState("");
  const { user } = useAuth(); // Assuming you have this hook to get the current user
  const userEmail = user?.email || ""; // Adjust based on actual user object

  const handleAddFriend = async () => {
    try {
      // Check if a request already exists
      const q = query(
        collection(db, "friends"),
        where("email", "==", email),
        where("senderEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Friend request already sent.");
        return;
      }

      // Add the new request
      const docRef = await addDoc(collection(db, "friends"), {
        email: email,
        senderEmail: userEmail, // Sender's email
        senderName: user?.firstName || "Unknown", // Sender's name
        timestamp: new Date(),
        status: "pending", // Add a status field to indicate pending request
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter friend's email"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  );
};

export default AddFriend;
