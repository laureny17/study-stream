// firestoreUtils.ts
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "./firestoreClient";

// Add a friend request
export const addFriendRequest = async (fromEmail: string, toEmail: string) => {
  try {
    const requestRef = doc(collection(db, "friendRequests"));
    await setDoc(requestRef, {
      from: fromEmail,
      to: toEmail,
      status: "pending",
      timestamp: new Date(),
    });

    // Update sender's and receiver's requests
    await updateDoc(doc(db, "users", fromEmail), {
      sentRequests: [
        ...((await getDoc(doc(db, "users", fromEmail))).data()?.sentRequests ||
          []),
        requestRef.id,
      ],
    });
    await updateDoc(doc(db, "users", toEmail), {
      receivedRequests: [
        ...((await getDoc(doc(db, "users", toEmail))).data()
          ?.receivedRequests || []),
        requestRef.id,
      ],
    });
  } catch (error) {
    console.error("Error adding friend request", error);
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, "friendRequests", requestId);
    const requestSnapshot = await getDoc(requestRef);

    if (requestSnapshot.exists()) {
      const { from, to } = requestSnapshot.data() as any;

      // Update request status
      await updateDoc(requestRef, { status: "accepted" });

      // Update friends in both user documents
      await updateDoc(doc(db, "users", from), {
        friends: [
          ...((await getDoc(doc(db, "users", from))).data()?.friends || []),
          to,
        ],
      });
      await updateDoc(doc(db, "users", to), {
        friends: [
          ...((await getDoc(doc(db, "users", to))).data()?.friends || []),
          from,
        ],
      });

      // Optionally, remove the request from sent and received requests lists
    } else {
      console.log("Request not found");
    }
  } catch (error) {
    console.error("Error accepting friend request", error);
  }
};
