require("dotenv").config();
const spotify = new Spotify(keys.spotify);
const ombd = new OBDb(keys.ombd);
const bandsintown = new Bandsintown(keys.bandsintown);