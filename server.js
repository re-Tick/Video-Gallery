const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
// const fs = require('fs');
const Videos = require('./models/video');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
var ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);
ffmpeg.setFfmpegPath(ffmpegPath);
const bodyParser = require('body-parser');


//mongoose middleware
mongoose
  .connect(
    'mongodb+srv://admin-ritik:Ritik@1001@cluster0.q5hot.gcp.mongodb.net/VideoStreamDB?retryWrites=true&w=majority',
    { useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Express body parser
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.use(express.static(__dirname));  

//multer middleware
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,  'video-' + Date.now() + path.extname(file.originalname));
  }
});

const maxSize = 400 * 1024; //400kb
var upload = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  //   }
  // }
}).single('video')


app.get("/videos",  async(req, res) => {
  console.log('called');
  try{
    const data = await Videos.find({});
    //console.log(data);
    res.json(data);
  }
  catch(err){
    console.log(err);
  }
    // res.sendFile(__dirname + "/index.html");
  
});

//Upload video
app.post('/uploadVideo', upload, async(req, res) => {
  

  try{
    
    // res.send("uploaded");
    res.json({success: true, url: req.file.path, fileName: req.file.filename});
  }
  catch(err){
    res.send(err);
  }
});

//Upload thumbnail
app.post('/uploadThumbnail', upload, async(req, res) => {
  console.log(req.body);
  ffmpeg(req.body.url)
  .on('filenames', async(filenames) => {
    console.log('Will Generate' + filenames.join(', '))
    console.log(filenames);
    // const newVideo = new Videos({
    //   photo:{
    //     data: req.body.fileName,
    //   },
    //   thumbnail: {
    //     data: fs.readFileSync(path.join(__dirname + '/uploads/thumbnails/' + filenames[0])),
    //     contentType: 'image/png'
    //   }
    // })
    // try{
    //   await newVideo.save();
    // }
    // catch(err){
    //   console.log(err);
    // }
  })
  .on('end', async() => {
    
    console.log("SS taken");
    const string = req.body.fileName.slice(0, 19);
    console.log(string);
    const newVideo = new Videos({
      photo:{
        data: req.body.fileName,
      },
      thumbnail: {
        // data: fs.readFileSync(path.join(__dirname + '/uploads/thumbnails/thumbnail-' + string + '.png')),
        // contentType: 'image/png'
        data: 'uploads/thumbnails/thumbnail-' + string + '.png'
      }
    })
    try{
      await newVideo.save();
    }
    catch(err){
      console.log(err);
    }
  })
  .on('error', function(err){
    console.error(err);
  })
  .screenshot({
    count: 1,
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: 'thumbnail-%b.png'
  })

});

//video stream
app.get("/video/:vid", async (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoFromDB = await Videos.findById(req.params.vid);

  // get video stats (about 61MB)
  const videoPath = `./uploads/${videoFromDB.photo.data}`;
  const videoSize = fs.statSync(`./uploads/${videoFromDB.photo.data}`).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});