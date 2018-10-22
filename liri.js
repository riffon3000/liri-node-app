require('dotenv').config();
const keys = require('./keys');
const inquirer = require('inquirer');
const fs = require('fs');
const request = require('request');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const spotify = new Spotify(keys.spotify);
const ombdKey = keys.ombd;
const bandsintownKey = keys.bandsintown;

// search Bands in Town
function searchBands() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What artist name do want me to look up?',
                name: 'query'
            }])
        .then(function (artistName) {
            request(`https://rest.bandsintown.com/artists/${artistName.query}/events?app_id=${bandsintownKey}`, function (err, response, body) {
                if (err) {
                    throw err;
                } else {
                    let artist = JSON.parse(body);
                    // console.log(artist);
                    console.log(`
                    Next Show
                    ---------------------------------
                    Venue Name: ${artist.venue.name}
                    Venue Location: ${artist.venue.city}, ${artist.venue.country}
                    Event Date: ${moment(artist.datetime).format(MM / DD / YYYY)}
                     `);
                    liri();
                }
            })
        });
}
// search Spotify
function searchSpotify() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What song title do you want me to look up?',
                name: 'query',
                default: 'The Sign Ace of Base'
            }])
        .then(function (songTitle) {
            spotify
                .search({ type: 'track', query: `${songTitle.query}` })
                .then(function (data) {
                    // console.log(data);
                    let song = data.tracks.items[0];
                    console.log(`
            Artist: ${song.artists[0].name}
            Song title: ${song.name}
            Album Name: ${song.album.name}
            Preview URL: ${song.preview_url}
            `)
                })
                .catch(function (err) {
                    console.log(`Error occurred: ${err}`);
                })
            liri();
        });
}
// search OMBD
function searchOMDb() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Which movie title do want me to look up?',
                name: 'query',
                default: 'Mr Nobody'
            }])
        .then(function (movieTitle) {
            request(`https://www.omdbapi.com/?t=${movieTitle.query}&apikey=${ombdKey}`, function (err, response, body) {
                if (err) {
                    throw err;
                } else {
                    let movie = JSON.parse(body);
                    // console.log(movie);
                        console.log(`
                    Movie Title: ${movie.Title}
                    Year Released: ${movie.Year}
                    IMDB Rating: ${movie.Ratings[0].Value}
                    Rotten Tomatoes Rating: ${movie.Ratings[1].Value}
                    Produced in: ${movie.Country}
                    Language(s): ${movie.Language}
                    Plot: ${movie.Plot}
                    Actors: ${movie.Actors}
                     `);
                    liri();
                }
            })
        });
}
// read random.txt and do as it says
function readRandomTxt() {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) {
            throw err;
        } else {
            let randomRead = data.split(',');
            let command = randomRead[0].trim();
            let query = randomRead[1].trim();
            switch (command) {
                case 'concert-this':
                    searchBands(query);
                    break;
                case 'spotify-this-song':
                    searchSpotify(query);
                    break;
                case 'movieTitle-this':
                    searchOMDb(query);
                    break;
                default:
                    break;
            }
        }
    });
}
// Welcome Liri and prompt choices
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
// Run Liri
liri();