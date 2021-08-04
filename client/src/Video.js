import axios from 'axios';
import React, { Fragment, useEffect, useState } from "react";
import './Video.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function Video({match}){
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

    return(
        <div>
            <nav>
                <div className="nav-container">  
                    <Link to="/"><h1>Video Gallery</h1></Link>
                    <Link to="/upload">Upload</Link>
                </div>
            </nav>
            <div className="video-container">
            
                <div>
                    <video id="videoPlayer" width="650" controls muted="muted" autoplay>
                        <source src={`/video/${match.params.id}`} type="video/mp4" />
                    </video>
                </div>
            
            
            </div>
        </div>
        
    )
}

export default Video;