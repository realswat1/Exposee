import "./main.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";

function Main() {
  const { user, updateUser } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleLogout = () => {
    // Perform logout logic here
    // Example: Clear user data from localStorage, reset user state, etc.
    updateUser(null);
  };

  return (
    <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
              {/* <Link to= "/profile"> Go to profile Page</Link> */}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <div
        className="video-list"
        onMouseUp={handleSwipeUp}
        style={{ cursor: "grab", touchAction: "pan-y" }}
      >
        {videos.map((video, index) => (
          <div
            className={`video-container ${
              index === currentIndex ? "active" : ""
            }`}
            key={video.id}
          >
            <video src={video.url} controls loop>
              YOUR BROWSER DOES NOT SUPPORT THE VIDEO TAG.
            </video>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
