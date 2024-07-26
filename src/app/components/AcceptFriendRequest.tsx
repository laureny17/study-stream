"use client";

import { useState } from "react";
import { db } from "@/firebase"; // Ensure correct path
import {
  doc,
  collection,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const AcceptFriendRequest = ({ requestId }: { requestId: string }) => {
  const { user } = useAuth(); // Ensure user info is provided by this hook

  const handleAccept = async () => {
    if (!user?.email) {
      console.error("User email is not available");
      return;
    }

    try {
      // Get the request document
      const requestDocRef = doc(db, "friendRequests", requestId);
      const requestDoc = await getDoc(requestDocRef);
      const requestData = requestDoc.data();

      if (!requestData) {
        console.error("Request not found");
        return;
      }

      // Add to friends collection
      const userFriendsRef = collection(db, "users", user.email, "friends");
      const friendRef = doc(userFriendsRef, requestData.senderEmail);
      await updateDoc(friendRef, { added: true });

      const friendUserRef = collection(
        db,
        "users",
        requestData.senderEmail,
        "friends"
      );
      const requestUserRef = doc(friendUserRef, user.email);
      await updateDoc(requestUserRef, { added: true });

      // Remove the request
      await deleteDoc(requestDocRef);

      console.log("Friend request accepted");
    } catch (error) {
      console.error("Error accepting friend request: ", error);
    }
  };

  return <button onClick={handleAccept}>Accept</button>;
};

export default AcceptFriendRequest;
