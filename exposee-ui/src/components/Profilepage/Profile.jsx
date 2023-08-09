import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
import {ProfilePictureUpload} from "./Profilepic/Profilepic";
import "./profile.css";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [walletAmount, setWalletAmount] = useState(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/profile/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.log("Failed to fetch user profile");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
      }
    };
    const fetchUserWallet = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${user.id}/wallet`, {
          headers: {
            access_token: user.access_token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWalletAmount(data.balance);
          setHasWallet(true);
        } else {
          setHasWallet(false);
          console.log("Failed to fetch user wallet");
        }
      } catch (error) {
        setHasWallet(false);
        console.error("Error fetching user wallet:", error);
      }
    };


    Promise.all([fetchUserProfile(), fetchUserWallet()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [user.id, user.access_token, setUser]);

  const handleProfilePictureUpload = async (event) => {
    const formData = new FormData();
    formData.append("profilePicture", event.target.files[0]);

    try {
      const response = await fetch(`http://localhost:3000/upload-profile-pic/${user.id}`, {
        method: "POST",
        headers: {
          access_token: user.access_token,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile picture uploaded successfully");

        setUser(prevUser => ({
          ...prevUser,
          profile_Picture: data.profile_Picture,
        }));
        setHasProfilePicture(true);
      } else {
        console.log("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  const handleBroadcast = async () => {
    try {
      const response = await fetch("http://localhost:3000/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: user.access_token,
        },
        body: JSON.stringify({
          description: "STREAM",
        }),
      });
      console.log("hello", response);
      if (response.ok) {
        const data = await response.json();
        alert(
          `Broadcast started successfully! Use the pop-up stream key to set up stream in OBS. STREAMKEY: ${data.mux_stream_key}`
        );
        console.log(data);
      } else {
        console.log("Failed to start the live stream");
      }
    } catch (error) {
      console.error("Error going live:", error);
    }
  };

  const handleCreateWallet = async () => {
    try {
      const response = await fetch("http://localhost:3000/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: user.access_token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        setWalletAmount(data.balance);
        setHasWallet(true);
        alert("Wallet created successfully!");
      } else {
        console.log("Failed to create wallet");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleProfilePictureUpload(selectedFile);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Profile Page</h1>
      <div className="profile-info">
        {hasProfilePicture ? (
          <img src={user.profile_Picture} alt="Profile" />
        ) : (
          <div className="no-picture-text">No Profile Picture</div>
        )}
        <div className="profile-details">
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {hasWallet ? (
            <p>Wallet Amount: {walletAmount}</p>
          ) : (
            <button className="create-wallet-btn" onClick={handleCreateWallet}>
              Create Wallet
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />

        </div>
      </div>
      <button className="broadcast-btn" onClick={handleBroadcast}>
        Broadcast
      </button>
      <Link className="link-btn" to="/">
        GET INSPIRED
      </Link>
    </div>
  );
};

export default ProfilePage;
