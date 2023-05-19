const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const session = require('express-session')
const fs = require('fs')
const counterFile = 'counter_request.txt'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))


app.get('/', (req, res) => {
    res.render('main/main', {onLoadSlideValue: req.session.weatherSetting})
})


function readCounter() {
    if (fs.existsSync(counterFile)) {
        return parseInt(fs.readFileSync(counterFile, 'UTF-8'))
    } else {
        return 0
    }
}

function updateCounter(counter) {
    fs.writeFileSync(counterFile, counter.toString())
}

app.post('/geocoder', async (req, res) => {
    try {
        const response = await axios.get(`http://dataservice.accuweather.com//locations/v1/search?apikey=${process.env.accuWeatherAPI_KEY}&q=${req.body.location}&offset=25`);
        let counter = readCounter()
        counter++
        updateCounter(counter)
        res.json(response.data)

    }
    catch (err) {
        console.log(err)
    }
});

app.post('/weatherAPI', async (req, res) => {
    try {
        console.log(req.body.key)
        const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${req.body.key}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
        let counter = readCounter()
        counter++
        updateCounter(counter)
        console.log(conditions)
        res.json(conditions.data)
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/slider-setting', (req, res) => {
    if (!req.session.weatherSetting) {
        req.session.weatherSetting = "Imperial"
    } else if (req.session.weatherSetting === "Metric") {
        req.session.weatherSetting = "Imperial"
    } else {
        req.session.weatherSetting = "Metric"
    }
    console.log(req.session.weatherSetting)
    let sliderValue = req.session.weatherSetting
    res.json(sliderValue)
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

