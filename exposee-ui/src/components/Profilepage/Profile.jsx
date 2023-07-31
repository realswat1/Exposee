import React, { useState, useEffect, useContext } from "react";
import { UserContext}  from '../../UserContext';
import { Link, useNavigate } from "react-router-dom";
//import axios from "axios";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.log("Failed to fetch user profile");
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.id, setUser]);
console.log(user.access_token);

  const handleBroadcast = async () => {
    try {
      const response = await fetch('http://localhost:3000/broadcast', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            access_token: user.access_token
        },
        body: JSON.stringify({
          description: "STREAM",
        }),
      });
console.log('helloe',response);
      if (response.ok) {
        const data = await response.json();
        alert(`Broadcast started successfully!, use the pop up stream key to set up stream in OBS . STREAMKEY: ${data.mux_stream_key
        }`);
        console.log(data);
      } else {
        console.log("Failed to start the live stream");
      }
    } catch (error) {
      console.error('Error going live:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <h2>User Information</h2>
        <div>
          <img src={user.profilePicture} alt="Profile" />
        </div>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
      <button onClick={handleBroadcast}>Broadcast</button>
      <Link to="/">GET INSPIRED</Link>
    </div>
  );
};

export default ProfilePage;
