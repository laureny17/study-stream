// src/components/FriendRequests.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Ensure correct path
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const FriendRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const { user } = useAuth();
  const userEmail = user.email || "";

  useEffect(() => {
    const q = query(collection(db, "friends"), where("email", "==", userEmail));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsList: any[] = [];
      querySnapshot.forEach((doc) => {
        requestsList.push(doc.data());
      });
      setRequests(requestsList);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <div>
      <h2>Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        <ul>
          {requests.map((request, index) => (
            <li key={index}>
              <p>
                From: {request.senderName} ({request.senderEmail})
              </p>
              <p>Sent at: {request.timestamp.toDate().toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
