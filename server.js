require('dotenv').config()
const express = require('express')
const cors = require('cors')
const qs = require('querystring')
const fetch = require('node-fetch')
const app = express()

const lastfmURL = 'https://ws.audioscrobbler.com/2.0/?' + qs.stringify({
  method: 'user.getrecenttracks',
  limit: 1,
  user: 'magicjamesv',
  format: 'json',
  api_key: process.env.LAST_FM_API_KEY,
})

const letterboxdURL = 'https://api.rss2json.com/v1/api.json?' + qs.stringify({
  rss_url: 'https://letterboxd.com/jamesbvaughan/rss/',
  api_key: process.env.RSS_2_JSON_API_KEY,
})

app.use(cors())

app.get('/song', (req, res) => {
  fetch(lastfmURL)
    .then(r => r.json())
    .then(({ recenttracks: { track } }) => {
      const linkBody = `${track[0].name} by ${track[0].artist['#text']}`
      const link = `<a href='${track[0].url}'>${linkBody}</a>`
      const responseText = track.length > 1
        ? 'at the moment I\'m listening to'
        : 'the last song I listened to was'

      res.send(responseText + link)
    })
})

app.get('/movie', (req, res) => {
  fetch(letterboxdURL)
    .then(r => r.json())
    .then(({ items: [movie] }) => {
      const link = `<a href="${movie.link}">${movie.title.match(/(.*),/)[1]}</a>`

      res.send('the last movie I watched was' + link)
    })
})

app.listen(3048, () => console.log('running on port 3048'))
