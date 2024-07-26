// src/pages/Profile.tsx
import AddFriend from "../components/AddFriend";
import { FC } from "react";
import FriendRequests from "../components/FriendRequests";

const ProfilePage: FC = () => {
  return (
    <div>
      <h1>Your Profile</h1>
      <AddFriend />
      <FriendRequests />
    </div>
  );
};

export default ProfilePage;
