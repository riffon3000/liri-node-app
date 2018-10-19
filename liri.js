require('dotenv').config();
const keys = require('./keys');
const inquirer = require('inquirer');
const fs = require('fs');
const request = require('request');
const spotify = require('node-spotify-api');
const moment = require('moment');
const spotifyKey = new Spotify(keys.spotify);
const ombdKey = new OBDb(keys.ombd);
const bandsintownKey = new Bandsintown(keys.bandsintown);

function searchSpotify() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What song title do you want me to look up?",
                name: "query"
            }])
        .then(function (songTitle) {
            spotify
                .request(`https://api.spotify.com/v1/tracks/${songTitle.query}&apikey=${spotifyKey}`)
                .then(function (data) {
                    // console.log(data);
                    let song = data.tracks.items[0];
                    let artistName = song.album.artists[0].name;
                    console.log(`
            Artist: ${artistName}
            Song title: ${song}
            Album Name: ${song.album.name}
            Preview URL: ${song.preview_url}
            `)
                })
                .catch(function (err) {
                    console.log(`Error occurred: ${err}`);
                });
            liri();
        });
};

function searchOMDb() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Which movie title do want me to look up?',
                name: 'query'
            }])
        .then(function (movieTitle) {
            request(`http://www.omdbapi.com/?t=${movieTitle.query}&apikey=${ombdKey}`, function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    let movie = JSON.parse(body);
                    // console.log(movie);
                    console.log(`
                movieTitle Title: ${movie.Title}
                Year Released: ${movie.Year}
                IMDB Rating: ${movie.Ratings[0].Value}
                Rotten Tomtoes Rating: ${movie.Ratings[1].Value}
                Produced in: ${movie.Country}
                Language(s): ${movie.Language}
                Plot: ${movie.Plot}
                Actors: ${movie.Actors}
                 `);
                    liri();
                }
            });
        });
};

function liri() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Hi, I\'m Liri! What would you like to do?',
                choices: ['concert-this', 'spotify-this-song', 'movieTitle-this', 'do-what-it-says'],
                name: 'command'
            },
            {
                type: 'confirm',
                message: 'Are you sure?',
                name: 'confirm',
                default: true
            }
        ])
        .then(function (userChoice) {
            if (userChoice.confirm) {
                switch (userChoice.command) {
                    case 'concert-this':
                        searchBands();
                        break;
                    case 'spotify-this-song':
                        searchSpotify();
                        break;
                    case 'movieTitle-this':
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

