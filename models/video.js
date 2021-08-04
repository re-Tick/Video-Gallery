const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    photo: {
        data : String
      },
    thumbnail: {
      data: String
    }
    
});

const Videos = mongoose.model('Video', VideoSchema);

module.exports = Videos;
