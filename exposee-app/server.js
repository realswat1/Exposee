import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";

import { User, Video } from "./models/index.js";
import userRoutes from "./Routes/users.js";
import SequelizeStoreInit from "connect-session-sequelize";
import { DATE } from "sequelize";
import validate_Token from "./authentoken.js";

import dotenv from "dotenv";
import Mux from "@mux/mux-node";

const app = express();
dotenv.config();
const createLiveStream = async () => {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    console.error(
      "It looks like you haven't set up your Mux token in the .env file yet."
    );
    return;
  }

  const MuxVideo = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
  );
  const response = await MuxVideo.LiveStreams.create({
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
  });
  // Save the Mux API response in the PostgreSQL database
  try {
    const playbackId = response.playback_ids[0].id;
    const streamKey = response.stream_key;
    const liveStream = await Video.create({
      title: "STREAM",
      url: `https://stream.mux.com/${playbackId}.m3u8`,

      user_Id,
      description: DESCRIPTION_FROM_REQUEST,
      duration: DURATION_FROM_REQUEST,
      api_key: API_KEY_FROM_REQUEST,
      is_live: false,
      is_saved: false,
      mux_stream_key: streamKey,
      mux_playback_id: playbackId,
    });

    return liveStream;
  } catch (error) {
    console.error("Error saving stream details to the database:", error);
    return null;
  }
};

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan());

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});
app.use(express.static("public"));
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "_" + uniqueSuffix);
  },
});

function verifytoken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Acess denied. No token provided" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}
const upload = multer({ storage });
// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year in milliseconds
    },
  })
);

sessionStore.sync();

app.use(userRoutes);

app.post(
  "/upload-profile-pic/:id",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user_Id = req.params.id;
      const user = await User.findOne({ where: { id: user_Id } });

      if (user && user.profile_Picture) {
        return res
          .status(400)
          .json({ message: "user already has a profile picture" });
      }
      const filePath = req.file ? req.file.path : null;

      if (!filePath) {
        return res.status(400).json({ message: "no file uploaded" });
      }
      await User.update(
        { profile_Picture: filePath },
        { where: { id: user_Id } }
      );
      res.status(200).json({ message: "Profile picture upload successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading profile picture" });
    }
  }
);
app.get("/profile/:id", validate_Token, async (req, res) => {
  const user_Id = req.params.id;
  try {
    const user = await User.findByPk(user_Id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
});
app.get("/videos", async (req, res) => {
  try {
    const video = await Video.findAll();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/videos", validate_Token, async (req, res) => {
  try {
    const { title, url } = req.body;
    const video = await Video.create({ title, url });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/broadcast", validate_Token, async (req, res) => {
  try {
    const { description } = req.body;
    const user_Id = req.userId;
    if (!description) {
      return res.status(400).json({ error: "all fields are required" });
    }
    const user = await User.findByPk(user_Id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const { Video: MuxVideo } = new Mux(
      process.env.MUX_TOKEN_ID,
      process.env.MUX_TOKEN_SECRET
    );
    const response = await MuxVideo.LiveStreams.create({
      playback_policy: "public",
      new_asset_settings: { playback_policy: "public" },
    });
    const playbackId = response.playback_ids[0].id;
    const streamKey = response.stream_key;
    const time = response.max_continuous_duration;
    const video = await Video.create({
      title: "STREAM",
      url: `https://stream.mux.com/${playbackId}.m3u8`,
      user_Id,
      description,
      duration: time,
      api_key: playbackId,
      is_live: false,
      is_saved: false,
      mux_stream_key: streamKey,
      mux_playback_id: playbackId,
    });
    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/videos/:id", validate_Token, async (req, res) => {
  try {
    const video_Id = req.params.id;
    const video = await Video.findByPk(video_Id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ error: " Video not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
async function handleLiveStreamConnected(data) {
  const { stream_key } = data;

  try {
    // Find the corresponding video in the database based on the stream ID
    const video = await Video.findOne({
      where: { mux_stream_key: stream_key },
    });
    if (video) {
      // Update the is_live field to true
      await video.update({ is_live: true });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}

// Function to handle when the live stream is disconnected
async function handleLiveStreamDisconnected(data) {
  const { stream_key } = data;

  try {
    // Find the corresponding video in the database based on the stream ID
    const video = await Video.findOne({
      where: { mux_stream_key: stream_key },
    });
    if (video) {
      // Update the is_live field to false
      await video.update({ is_live: false });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}

// Function to handle when the live stream becomes active
async function handleLiveStreamActive(data) {
  const { playback_id } = data;

  try {
    // Find the corresponding video in the database based on the active_asset_id
    const video = await Video.findOne({
      where: { mux_playback_id: playback_id },
    });
    if (video) {
      // Update the is_live field to true
      await video.update({ is_live: true });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}
async function handleLiveStreamIdle(data) {
  const { playback_id } = data;

  try {
    // Find the corresponding video in the database based on the active_asset_id
    const video = await Video.findOne({
      where: { mux_playback_id: playback_id },
    });
    if (video) {
      // Update the is_live field to true
      await video.update({ is_live: false });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}
async function handleLiveStreamRecording(data) {
  const { playback_id } = data;

  console.log("its is :", playback_id);

  try {
    // Find the corresponding video in the database based on the active_asset_id
    const video = await Video.findOne({
      where: { mux_playback_id: playback_id },
    });
    if (video) {
      // Update the is_saved field to true
      await video.update({ is_saved: true });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}

// Function to handle when the asset's live stream is completed
async function handleAssetLiveStreamCompleted(data) {
  const { playback_id } = data;

  try {
    // Find the corresponding video in the database based on the active_asset_id
    const video = await Video.findOne({
      where: { mux_playback_id: playback_id },
    });
    if (video) {
      // Update the is_live field to false
      await video.update({ is_live: false });
    }
  } catch (error) {
    console.error("Error updating is_live in the database:", error);
  }
}

app.post("/mux-webhook", (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "video.live_stream.connected":
      handleLiveStreamConnected(data);
      break;
    case "video.live_stream.disconnected":
      handleLiveStreamDisconnected(data);
      break;
    case "video.live_stream.recording":
      handleLiveStreamRecording(data);
      break;
    case "video.live_stream.active":
      handleLiveStreamActive(data);
      break;
    case "video.live_stream.idle":
      handleLiveStreamIdle(data);
      break;
    case "video.asset.live_stream_completed":
      handleAssetLiveStreamCompleted(data);
      break;
    default:
      console.log("Unknown event type:", type);
  }

  res.status(200).send("Thanks, Mux!");
});

app.post("/videos/:id", validate_Token, async (req, res) => {
  try {
    const video_Id = req.params.id;
    const { title, url } = req.body;
    const video = await Video.findByPk(video_Id);
    if (video) {
      video.title = title;
      video.url = url;
      await video.save();

      res.json(video);
    } else {
      res.status(404).json({ error: " Video not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
sequelize
  .sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);

    });

  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  })
