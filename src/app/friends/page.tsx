// src/app/friends/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Import the Firestore instance

interface FriendRequest {
  name: string;
  email: string;
}

const FriendsPage = () => {
  const [friends, setFriends] = useState<Array<FriendRequest>>([]);
  const [receivedRequests, setReceivedRequests] = useState<
    Array<FriendRequest>
  >([]);
  const [sentRequests, setSentRequests] = useState<Array<FriendRequest>>([]);
  const [newRequestEmail, setNewRequestEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, "users", user.email!);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFriends(userData.friends || []);
            setReceivedRequests(userData.receivedRequests || []);
            setSentRequests(userData.sentRequests || []);
          }
        }
      } catch (err) {
        setError("Failed to load user data.");
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleAcceptRequest = async (requestEmail: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const senderRef = doc(db, "users", requestEmail); // Reference to the sender's document
    const recipientRef = doc(db, "users", user.email!); // Reference to the recipient's document

    try {
      // Get recipient data
      const recipientDoc = await getDoc(recipientRef);
      const recipientData = recipientDoc.data();

      // Get sender data
      const senderDoc = await getDoc(senderRef);
      const senderData = senderDoc.data();

      if (recipientData && senderData) {
        // 1. Update recipient's document
        // - Add the sender to the recipient's friends list
        // - Remove the sender from the recipient's receivedRequests list
        await updateDoc(recipientRef, {
          friends: arrayUnion({
            name: senderData.name,
            email: senderData.email,
          }),
          receivedRequests: arrayRemove({
            name: senderData.name,
            email: senderData.email,
          }),
        });

        // 2. Update sender's document
        // - Add the recipient to the sender's friends list
        // - Remove the recipient from the sender's sentRequests list
        await updateDoc(senderRef, {
          friends: arrayUnion({
            name: recipientData.name,
            email: recipientData.email,
          }),
          sentRequests: arrayRemove({
            name: recipientData.name,
            email: recipientData.email,
          }),
        });

        // 3. Update local state for recipient
        // - Remove the accepted request from the receivedRequests list in the UI
        setReceivedRequests((prev) =>
          prev.filter((request) => request.email !== requestEmail)
        );

        // 4. Update local state for sender
        // - Remove the accepted request from the sentRequests list in the UI
        setSentRequests((prev) =>
          prev.filter((request) => request.email !== requestEmail)
        );

        // 5. Add the sender to the recipient’s friends list in local state
        setFriends((prev) => [
          ...prev,
          { name: senderData.name, email: senderData.email },
        ]);
      }
    } catch (err) {
      console.error("Failed to accept friend request.", err);
    }
  };

  const handleSendRequest = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !newRequestEmail) return;

    const senderRef = doc(db, "users", user.email!);
    const recipientRef = doc(db, "users", newRequestEmail);

    try {
      // Check if recipient exists
      const recipientDoc = await getDoc(recipientRef);
      if (!recipientDoc.exists()) {
        setError("Recipient does not exist.");
        return;
      }

      const recipientData = recipientDoc.data();
      const recipientName = recipientData.name || "Unknown";

      // Update the sender's sent requests and recipient's received requests
      await updateDoc(senderRef, {
        sentRequests: arrayUnion({
          name: recipientName,
          email: newRequestEmail,
        }),
      });
      await updateDoc(recipientRef, {
        receivedRequests: arrayUnion({
          name: user.displayName!,
          email: user.email!,
        }),
      });

      // Update local state
      setSentRequests((prev) => [
        ...prev,
        { name: recipientName, email: newRequestEmail },
      ]);
      setNewRequestEmail("");
    } catch (err) {
      setError("Failed to send friend request.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Friends</h1>
      <h2>Send Friend Request</h2>
      <input
        type="email"
        value={newRequestEmail}
        onChange={(e) => setNewRequestEmail(e.target.value)}
        placeholder="Enter friend's email"
      />
      <button onClick={handleSendRequest}>Send Request</button>

      <h2>Received Friend Requests</h2>
      <ul>
        {receivedRequests.map((request) => (
          <li key={request.email}>
            {request.name} ({request.email})
            <button onClick={() => handleAcceptRequest(request.email)}>
              Accept
            </button>
          </li>
        ))}
      </ul>

      <h2>Sent Friend Requests</h2>
      <ul>
        {sentRequests.map((request) => (
          <li key={request.email}>
            {request.name} ({request.email})
          </li>
        ))}
      </ul>

      <h2>Your Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.email}>
            {friend.name} ({friend.email})
          </li>
        ))}
      </ul>

      {error && <p>{error}</p>}
    </div>
  );
};

export default FriendsPage;
