"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Ensure correct path
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const FriendsPage = () => {
  const { user } = useAuth(); // Use custom hook to get authenticated user
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      console.log("Fetching data for user: ", user.email);

      // Set up real-time listener for friends
      const friendsQuery = query(
        collection(db, "friends"),
        where("email", "==", user.email),
        where("status", "==", "accepted")
      );
      const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
        const friendsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Friends list: ", friendsList);
        setFriends(friendsList);
      });

      // Set up real-time listener for friend requests
      const requestsQuery = query(
        collection(db, "friends"),
        where("email", "==", user.email),
        where("status", "==", "pending")
      );
      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const requestsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Friend requests list: ", requestsList);
        setFriendRequests(requestsList);
      });

      // Clean up listeners on unmount
      return () => {
        unsubscribeFriends();
        unsubscribeRequests();
      };
    }
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    if (user) {
      try {
        console.log("Handling accept request for ID: ", requestId);
        const requestRef = doc(db, "friends", requestId);
        const requestSnapshot = await getDoc(requestRef);

        if (requestSnapshot.exists()) {
          const requestData = requestSnapshot.data();

          // Update the status to accepted
          await setDoc(requestRef, { ...requestData, status: "accepted" });

          console.log("Friend request accepted");
        } else {
          console.log("No such friend request!");
        }
      } catch (e) {
        console.error("Error accepting friend request: ", e);
      }
    }
  };

  return (
    <div>
      <h1>Friends</h1>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.length === 0 ? (
          <li>No friend requests</li>
        ) : (
          friendRequests.map((request) => (
            <li key={request.id}>
              {request.senderEmail}
              <button onClick={() => handleAcceptRequest(request.id)}>
                Accept
              </button>
            </li>
          ))
        )}
      </ul>

      <h2>Your Friends</h2>
      <ul>
        {friends.length === 0 ? (
          <li>No friends</li>
        ) : (
          friends.map((friend) => <li key={friend.id}>{friend.senderEmail}</li>)
        )}
      </ul>
    </div>
  );
};

export default FriendsPage;
