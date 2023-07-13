// app.js
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './database.js';
import { User, Video } from './models/index.js';
import userRoutes from './Routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';
// import { Video } from './models/video.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan())

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

// Session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) // 1 year in milliseconds
    }
  })
);
 
sessionStore.sync();

app.use(userRoutes);


app.get('/videos', async (req, res) => {

  try {
    const videos = await Video.findAll();
    console.log(videos)
  res.json(videos)}
   catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
   }}
)
app.post('/videos', async (req, res) => {
  try {
    const {title ,url} = req.body;
    const videos = await Video.create({title, url})
    res.status(201).json(videos);
  } catch(error){
  console.error(error);
  res.status(500).json({ message: error.message });
  }
});

app.get('/videos/:id', async(req,res) => {

  try {
    const videoId = req.params.id;
    const videos = await Video.findByPk(videoId)
    if (videos){
  res.json(videos);
}else  {
  res.status(404).json({ error:' Video not Found' });
}
  }catch (error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/videos/:id', async(req,res) => {

  try {
    const videoId = req.params.id;
    const {title,url}=  req.body;
    const videos = await Video.findByPk(videoId);
    if (videos){
  videos.title = title;
  videos.url = url;
  await videos.save();

  res.json(videos)
}else  {
  res.status(404).json({ error:' Video not Found' });
}
  }catch (error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
sequelize.sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
