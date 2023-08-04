import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./VideoPlayer.css";

const VideoPlayer = ({ playbackId,current_video_id, onPlay }) => {
  return (
    <div className="video-container">
      <MuxPlayer
        streamType="live"
        playbackId={playbackId}
        metadata={{
          // video_id: "video-id-54321",
          video_id: current_video_id,
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
        onPlay={onPlay}
      />
    </div>
  );
};

export default VideoPlayer;
