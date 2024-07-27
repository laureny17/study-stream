// "use client";

// import React, { useState } from "react";
// import { sendFriendRequest } from "@/firestoreUtils";

// const FriendRequestHandler = () => {
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const handleSendRequest = async () => {
//     if (!recipientEmail) {
//       setError("Please enter an email address.");
//       return;
//     }

//     try {
//       await sendFriendRequest(recipientEmail);
//       setRecipientEmail("");
//       setError(null);
//       alert("Friend request sent!");
//     } catch (err) {
//       console.error("Error sending friend request:", err);
//       setError("Failed to send friend request");
//     }
//   };

//   return (
//     <div>
//       <input
//         type="email"
//         value={recipientEmail}
//         onChange={(e) => setRecipientEmail(e.target.value)}
//         placeholder="Enter friend's email"
//       />
//       <button onClick={handleSendRequest}>Send Friend Request</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default FriendRequestHandler;
