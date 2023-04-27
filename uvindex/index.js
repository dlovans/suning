const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    app.use(session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false
    }))
}



mongoose.connect('mongodb://127.0.0.1:27017/uvindex');

app.set('view engine', 'ejs')
app.set('public', path.join(__dirname, 'public'))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('main/main')
})

app.post('/geocoder', async (req, res) => {
    console.log(req.body.location)
    await axios.get(`http://dataservice.accuweather.com//locations/v1/search?apikey=${process.env.accuWeatherAPI_KEY}&q=${req.body.location}&offset=25`)
        .then(response => {
            res.json(response.data)
        })
        .catch(err => {
            console.log(err)
        })
})

app.listen('2000', () => {
    const timestamp = new Date().toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    console.log('listening on port 2000')
    console.log(timestamp)
})

