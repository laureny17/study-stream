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

  // Function to fetch and set user data
  const fetchUserData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.email!);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData); // Debugging line

          setFriends(userData.friends || []);
          setReceivedRequests(userData.receivedRequests || []);
          setSentRequests(userData.sentRequests || []);
        } else {
          console.warn("No user document found");
        }
      } catch (err) {
        setError("Failed to load user data.");
        console.error(err);
      }
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
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

        // Re-fetch user data to reflect the latest changes
        fetchUserData();
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

      // Get sender data
      const senderDoc = await getDoc(senderRef);
      const senderData = senderDoc.data();

      if (!senderData) {
        setError("Error fetching sender data.");
        return;
      }

      // Check if recipient is already a friend
      if (
        recipientData.friends.some(
          (friend: FriendRequest) => friend.email === user.email
        )
      ) {
        setError("Recipient is already a friend.");
        return;
      }

      // Check if a friend request has already been sent
      if (
        senderData.sentRequests.some(
          (request: FriendRequest) => request.email === newRequestEmail
        )
      ) {
        setError("Friend request already sent.");
        return;
      }

      // Check if the recipient has already received a friend request
      if (
        recipientData.receivedRequests.some(
          (request: FriendRequest) => request.email === user.email
        )
      ) {
        setError("Friend request already received.");
        return;
      }

      // Proceed with sending the friend request
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

      // Re-fetch user data to reflect the latest changes
      fetchUserData();

      // Clear input field
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
