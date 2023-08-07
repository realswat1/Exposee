import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext.jsx";
import { Link } from "react-router-dom";
import VideoPlayer from "../Videoplayer/Videoplayer.jsx";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx"; // Make sure to import the LoadingSpinner component

import "./main.css";

function Main() {
  const { user, updateUser } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState(null); // Added state for the currently playing video's video_id


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/videos");
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.log("Failed to fetch videos");
        }
      } catch (error) {
        console.log("Error fetching videos", error);
      } finally {
        setLoading(false); // Set loading to false after videos are fetched
      }
    };

    fetchVideos();
  }, []);

  const handleSwipeUp = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === videos.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };
  const handleGiftButton = async (receiver_id) => {
    // Check if the user is logged in (make sure the access token is available)
    if (!user || !user.access_token) {
      alert("Please log in to send a gift.");
      return;
    }

    try {
      // Call the gift API endpoint with the required data
      const response = await fetch("http://localhost:3000/gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: user.access_token,
        },
        body: JSON.stringify({
          receiver_id,
          amount: 1,
          video_id: videos[currentIndex].id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send gift");
      }

      const data = await response.json();
      console.log(data); // Handle the response as needed
      alert("Gift sent successfully!");
    } catch (error) {
      console.error("Error sending gift:", error.message);
      alert("Error sending gift. Please try again.");
    }
  };



  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
              <Link to="/profile">Go to Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      {/* Conditionally render the LoadingSpinner while loading is true */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div
          className="video-grid"
          onMouseUp={handleSwipeUp}
          style={{ cursor: "grab", touchAction: "pan-y" }}
        >
          {videos.map((video, index) => (
            <div
              className={`video-container ${index === currentIndex ? "active" : ""}`}
              key={video.id}
            >
              <VideoPlayer playbackId={video.mux_playback_id} />
              <p>{video.title}</p>
              {/* Add the gift button */}
              <button
                className="gift-button"
                onClick={() => handleGiftButton(video.user_Id)}
              >
                Gift
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Main;
