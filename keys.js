console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
  id: process.env.OMDb_ID
};

exports.bandsintown = {
  id: process.env.BANDSINTOWN_ID
};