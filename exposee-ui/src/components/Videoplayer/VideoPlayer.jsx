import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./VideoPlayer.css"; 

const VideoPlayer = ({ playbackId }) => {
  return (
    <div className="video-container">
      <MuxPlayer
        streamType="live" 
        playbackId={playbackId} 
        metadata={{
          video_id: "video-id-54321",
          video_title: "Test video title",
          viewer_user_id: "user-id-007",
        }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
        controls={true} 
      />
    </div>
  );
};

export default VideoPlayer;
