import logo from './logo.svg';
import './App.css';
import {Player} from 'video-react';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from "react";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function App() {

  const [videos, setVideos] = useState([]);
  console.log(videos);

  const loadInit = async() => {
    try{
      const data = await axios.get('/videos');
      console.log(data);
      setVideos(data.data);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=> {
    loadInit();
  }, [])

  const uploadVideo= async( files) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append('video', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    try{
      const res = await axios.post('/uploadVideo', formData, config);
      console.log(res.data);
      console.log("video uploaded correctly");
      if(res.data.success){
        const body = JSON.stringify({
          url: res.data.url,
          filename: res.data.filename
        });
        const config2 = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        console.log(body);
        const response = await axios.post('/uploadThumbnail', res.data,  config2);
      }
      else{
        alert('Failed to save');
      }
      
    }
    catch{
      console.log("error occured");
    }
  };



  return (
    <div className="App">
      <nav>
        <div className="nav-container">  
          <Link to="/"><h1>Video Gallery</h1></Link>
          <Link to="/upload">Upload</Link>
        </div>
      </nav>
      <header className="App-header">
        {/* <Player>
          <source src="/video"/>
        </Player> */}
        {/* <video id="videoPlayer" width="650" controls muted="muted" autoplay>
          <source src="/video/61084390a91149291026fcb7" type="video/mp4" />
        </video> */}
        {/* <form action="#" onSubmit={(e) => uploadVideo(e, e.target.files)}> */}
          {/* <input 
              type="file"
              id="uploadInput"
              accept="video/mp4"
              onChange={(e) => {uploadVideo(e.target.files)}}
          /> */}
          {/* <button type="submit" >Upload</button>
        </form> */}
        
        <div class="container row">
          
          {videos.length===0 ? "" : 
            videos.map((el) => {
              return(
                <div class="col-4 thumbnails">
                  
                    <Link to={`/video/${el._id}`}>
                      <img id="profile-pic" src={`http://localhost:8000/${el.thumbnail.data}`} alt="mypic"></img>
                    </Link>
                  
                {/* <p>{el.thumbnail.data}</p> */}
                </div>
              );
            })
          }
        </div>
        
        
      </header>
    </div>
  );
}

export default App;
