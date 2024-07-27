import { db } from "./firebaseConfig"; // Adjust the import based on your file structure
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";

// Send a friend request
export async function sendFriendRequest(
  senderEmail: string,
  receiverEmail: string
) {
  const friendRequestRef = doc(
    db,
    "friendRequests",
    `${senderEmail}_${receiverEmail}`
  );
  await setDoc(friendRequestRef, {
    senderEmail,
    receiverEmail,
    status: "pending",
    timestamp: new Date().toISOString(),
  });

  // Update the sender's sent requests
  const senderDocRef = doc(db, "users", senderEmail);
  await updateDoc(senderDocRef, {
    sentRequests: arrayUnion({ email: receiverEmail, name: "" }), // Fetch name if necessary
  });

  // Update the receiver's received requests
  const receiverDocRef = doc(db, "users", receiverEmail);
  await updateDoc(receiverDocRef, {
    receivedRequests: arrayUnion({ email: senderEmail, name: "" }), // Fetch name if necessary
  });
}

// Accept a friend request
export async function acceptFriendRequest(
  senderEmail: string,
  receiverEmail: string
) {
  const friendRequestRef = doc(
    db,
    "friendRequests",
    `${senderEmail}_${receiverEmail}`
  );
  await updateDoc(friendRequestRef, {
    status: "accepted",
  });

  // Update sender's friends
  const senderDocRef = doc(db, "users", senderEmail);
  await updateDoc(senderDocRef, {
    friends: arrayUnion({ email: receiverEmail, name: "", profilePic: "" }), // Fetch name and profilePic if necessary
  });

  // Update receiver's friends
  const receiverDocRef = doc(db, "users", receiverEmail);
  await updateDoc(receiverDocRef, {
    friends: arrayUnion({ email: senderEmail, name: "", profilePic: "" }), // Fetch name and profilePic if necessary
  });

  // Remove from sent and received requests
  await updateDoc(senderDocRef, {
    sentRequests: arrayRemove({ email: receiverEmail, name: "" }),
  });
  await updateDoc(receiverDocRef, {
    receivedRequests: arrayRemove({ email: senderEmail, name: "" }),
  });

  // Delete the friend request document
  await deleteDoc(friendRequestRef);
}
