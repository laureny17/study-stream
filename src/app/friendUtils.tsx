// src/utils/friendUtils.ts

import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import the Firestore instance
import { getAuth } from "firebase/auth";

// Function to send a friend request
export const sendFriendRequest = async (recipientEmail: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No authenticated user found.");
  }

  const senderRef = doc(db, "users", currentUser.email!);
  const recipientRef = doc(db, "users", recipientEmail);

  // Update sender's sentRequests and recipient's receivedRequests
  await updateDoc(senderRef, {
    sentRequests: arrayUnion({
      name: currentUser.displayName,
      email: recipientEmail,
    }),
  });
  await updateDoc(recipientRef, {
    receivedRequests: arrayUnion({
      name: currentUser.displayName,
      email: currentUser.email,
    }),
  });
};

// Function to accept a friend request
export const acceptFriendRequest = async (senderEmail: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No authenticated user found.");
  }

  const senderRef = doc(db, "users", senderEmail);
  const recipientRef = doc(db, "users", currentUser.email!);

  // Update both sender's and recipient's friends lists and remove requests
  await updateDoc(senderRef, {
    friends: arrayUnion({
      name: currentUser.displayName,
      email: currentUser.email,
    }),
    receivedRequests: arrayRemove({
      name: currentUser.displayName,
      email: currentUser.email,
    }),
  });
  await updateDoc(recipientRef, {
    friends: arrayUnion({
      name: currentUser.displayName,
      email: currentUser.email,
    }),
    sentRequests: arrayRemove({ name: senderEmail, email: senderEmail }),
  });
};
