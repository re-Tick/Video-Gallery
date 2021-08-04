import axios from 'axios';
import './Upload.css';
import React, { Fragment, useEffect, useState } from "react";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function Upload() {
    const [thumbnail, setThumbanail] = useState();
    console.log(thumbnail);
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
            // console.log(body);
            // console.log(res.data.fileName.slice(0, 19));
            
            // setThumbanail(res.data.fileName.slice(0, 19));
            alert("Uploaded Successfully");
            const response = await axios.post('/uploadThumbnail', res.data,  config2);
            
            // console.log(response);
            // alert("Uploaded");
          }
          else{
            alert('Failed to save');
          }
          
        }
        catch{
          console.log("error occured");
        }
      };
    

    return(
        <div>
            <nav >
                <div className="nav-container">  
                    <Link to="/"><h1>Video Gallery</h1></Link>
                    <Link to="/upload">Upload</Link>
                </div>
            </nav>
            <div className="upload-container">
                {/* <img src={`http://localhost:8000/uploads/thumbnails/thumbnail-${thumbnail}.png`} alt="my" /> */}
                <div className="vertical-upload-container">
                <input 
                type="file"
                id="uploadInput"
                accept="video/mp4"
                onChange={(e) => {uploadVideo(e.target.files)}}
                 />
                </div>
            </div>
        </div>
    );
}

export default Upload;