// app.js
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan())
app.use(express.static('public'));

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-'+ math.round(Math.random() * 1E9);
    cb(null, file.filename + '_' + uniqueSuffix);
  },
});

const upload= multer({storage});
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

app.post('/upload-profile-pic', upload.single('profilePic'), (req, res)=>{
  const filePath = file.filePath;
  const userId = req.params.userId;
  userId.update({ profilePicture: filePath}, {where: { Id: userId}})
  .then (()=>{
    res.status(200).json({message: 'Profile picture upload successfulloy'});
  })
  .catch(error=> {
    console.log(error);
    res.status(500).json({message: 'error uploading profile picture'});
  });
});
app.get('/user/:userId', (req, res)=>{

  const userId = req. params.userId;

  userId.findOne ({where: { Id: userId}})
  .then (user => {
    if (user){
      res.status(200).json(user);
    } else {
      res.status (404).json({message: 'user not found'});
    } 
  })
  .catch(error =>{
    console.log(error);
    res.status(500).json({message: 'Error retrieveing user information'});
  });
});


app.put('user/:userId', (req,res)=>{
  const userId = req.params.userId;
  const updatedInfo = req.body;

  User.update( updatedInfo, { where: { id: userId}})
  .then(()=>{
    res.status(200).json({message: 'user information updated sucessfully '});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'error updating user information'});
  });
});


app.get('/videos', async (req, res) => {

  try {
    const video = await Video.findAll();
    console.log(video)
  res.json(video)}
   catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
   }}
)
app.post('/videos', async (req, res) => {
  try {
    const {title ,url} = req.body;
    const video = await Video.create({title, url})
    res.status(201).json(video);
  } catch(error){
  console.error(error);
  res.status(500).json({ message: error.message });
  }
});

app.get('/videos/:id', async(req,res) => {

  try {
    const videoId = req.params.id;
    const video = await Video.findByPk(videoId)
    if (video){
  res.json(video);
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
    const video = await Video.findByPk(videoId);
    if (video){
  video.title = title;
  video.url = url;
  await video.save();

  res.json(video)
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
