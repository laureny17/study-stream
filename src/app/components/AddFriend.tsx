"use client";

import { useState } from "react";
import { auth } from "@/firebaseConfig"; // Adjust path if necessary
import { sendFriendRequest } from "@/firestoreUtils"; // Adjust path if necessary

const AddFriend = () => {
  const [email, setEmail] = useState("");

  const handleSendRequest = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to send friend requests");
      return;
    }

    const senderEmail = user.email!;
    try {
      await sendFriendRequest(senderEmail, email);
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Error sending friend request");
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Friend's email"
      />
      <button onClick={handleSendRequest}>Send Friend Request</button>
    </div>
  );
};

export default AddFriend;
