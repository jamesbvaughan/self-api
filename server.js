require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

app.use(cors())

app.get('/song', (req, res) => {
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=magicjamesv&api_key=${process.env.LAST_FM_API_KEY}&format=json`)
    .then(r => r.json())
    .then(json => json.recenttracks.track)
    .then(tracks =>
      res.send(`${tracks.length > 1
          ? 'at the moment I\'m listening to'
          : 'the last song I listened to was'
        }
        <a href='${tracks[0].url}'>
          ${tracks[0].name} by ${tracks[0].artist['#text']}</a>`)
    )
})

app.get('/movie', (req, res) => {
  fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fletterboxd.com%2Fjamesbvaughan%2Frss%2F&api_key=${process.env.RSS_2_JSON_API_KEY}`)
    .then(r => r.json())
    .then(json => json.items[0])
    .then(movie =>
      res.send(`the last movie I watched was <a href="${movie.link}">${
        movie.title.split(',')[0]
      }</a>`)
    )
})

app.listen(3048, () => console.log('running on port 3048'))
