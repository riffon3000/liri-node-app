require("dotenv").config();
const keys = require('./keys');
const inquirer = require('inquirer');
const request = require('request');
const spotify = require('node-spotify-api');
const moment = require('moment');
const spotifyKey = new Spotify(keys.spotify);
const ombdKey = new OBDb(keys.ombd);
const bandsintownKey = new Bandsintown(keys.bandsintown);