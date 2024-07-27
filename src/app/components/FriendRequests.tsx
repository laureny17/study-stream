// src/app/friends/receivedRequests.tsx (or wherever you display received requests)

import { useState } from "react";
import { acceptFriendRequest } from ".././friendUtils";

const FriendRequests = () => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptRequest = async () => {
    if (selectedEmail) {
      try {
        await acceptFriendRequest(selectedEmail);
        // Handle successful acceptance (e.g., show a success message or update UI)
      } catch (err) {
        setError("Failed to accept friend request.");
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>Received Friend Requests</h1>
      {/* Render list of received requests here */}
      <button onClick={handleAcceptRequest}>Accept Request</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default FriendRequests;
