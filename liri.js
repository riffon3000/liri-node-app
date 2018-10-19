require('dotenv').config();
const keys = require('./keys');
const inquirer = require('inquirer');
const request = require('request');
const spotify = require('node-spotify-api');
const moment = require('moment');
const spotifyKey = new Spotify(keys.spotify);
const ombdKey = new OBDb(keys.ombd);
const bandsintownKey = new Bandsintown(keys.bandsintown);

function liri() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Hi, I\'m Liri! What would you like to do?',
                choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
                name: 'command'
            },
            {
                type: 'confirm',
                message: 'Are you sure?',
                name: 'confirm',
                default: true
            }
        ])
        .then(function (commandChoice) {
            if (commandChoice.confirm) {
                switch (commandChoice.command) {
                    case 'concert-this':
                        searchBands();
                        break;
                    case 'spotify-this-song':
                        searchSpotify();
                        break;
                    case 'movie-this':
                        searchOMDb();
                        break;
                    case 'do-what-it-says':
                        readRandomTxt();
                        break;
                    default:
                        break;
                }
            }
        });
};

