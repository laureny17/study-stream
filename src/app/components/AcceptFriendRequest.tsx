"use client";

import { useState, useEffect } from "react";
import { auth } from "@/firebaseConfig"; // Adjust path if necessary
import { acceptFriendRequest } from "@/firestoreUtils"; // Adjust path if necessary

const AcceptFriendRequest = ({ senderEmail }: { senderEmail: string }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async () => {
    if (!user) {
      alert("You must be logged in to accept friend requests");
      return;
    }

    const receiverEmail = user.email!;
    try {
      await acceptFriendRequest(senderEmail, receiverEmail);
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Error accepting friend request");
    }
  };

  return <button onClick={handleAcceptRequest}>Accept Friend Request</button>;
};

export default AcceptFriendRequest;
