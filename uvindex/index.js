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
    res.render('main/main', { onLoadSlideValue: req.session.weatherSetting })
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
        if (!req.session.currentConditions || req.session.locationKey !== req.body.key) {
            const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${req.body.key}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
            let counter = readCounter()
            counter++
            updateCounter(counter)
            req.session.locationKey = req.body.key
            req.session.location = req.body.location
            req.session.currentConditionsUNI = {
                uvi: conditions.data[0].UVIndex,
                humidity: conditions.data[0].RelativeHumidity
            }
            req.session.currentConditions = {
                Metric: {
                    temperature: conditions.data[0].Temperature.Metric.Value,
                    precipitation: conditions.data[0].Precip1hr.Metric.Value,
                    wind: conditions.data[0].Wind.Speed.Metric.Value,

                },
                Imperial: {
                    temperature: conditions.data[0].Temperature.Imperial.Value,
                    precipitation: conditions.data[0].Precip1hr.Imperial.Value,
                    wind: conditions.data[0].Wind.Speed.Imperial.Value,
                }
            }
        }

        res.json({
            locationName: req.session.location,
            locationKey: req.session.locationKey,
            currentConditions: req.session.currentConditions,
            currentConditionsUNI: req.session.currentConditionsUNI,
            metricOrImperial: req.session.weatherSetting,
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/loadEvent', async (req, res) => {
    let locationName = req.session.location
    let locationKey = req.session.locationKey
    if (locationKey) {
        const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
        let counter = readCounter()
        counter++
        updateCounter(counter)
        req.session.currentConditionsUNI = {
            uvi: conditions.data[0].UVIndex,
            humidity: conditions.data[0].RelativeHumidity
        }
        req.session.currentConditions = {
            Metric: {
                temperature: conditions.data[0].Temperature.Metric.Value,
                precipitation: conditions.data[0].Precip1hr.Metric.Value,
                wind: conditions.data[0].Wind.Speed.Metric.Value,

            },
            Imperial: {
                temperature: conditions.data[0].Temperature.Imperial.Value,
                precipitation: conditions.data[0].Precip1hr.Imperial.Value,
                wind: conditions.data[0].Wind.Speed.Imperial.Value,
            }
        }
        res.json({
            locationName: req.session.location,
            locationKey: req.session.locationKey,
            currentConditions: req.session.currentConditions,
            currentConditionsUNI: req.session.currentConditionsUNI,
            metricOrImperial: req.session.weatherSetting,
        })
    } else {
        const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${310227}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
        let counter = readCounter()
        counter++
        updateCounter(counter)
        req.session.currentConditionsUNI = {
            uvi: conditions.data[0].UVIndex,
            humidity: conditions.data[0].RelativeHumidity
        }
        req.session.currentConditions = {
            Metric: {
                temperature: conditions.data[0].Temperature.Metric.Value,
                precipitation: conditions.data[0].Precip1hr.Metric.Value,
                wind: conditions.data[0].Wind.Speed.Metric.Value,

            },
            Imperial: {
                temperature: conditions.data[0].Temperature.Imperial.Value,
                precipitation: conditions.data[0].Precip1hr.Imperial.Value,
                wind: conditions.data[0].Wind.Speed.Imperial.Value,
            }
        }
        res.json({
            locationName: "Hjulsta, Stockholm, SE",
            locationKey: req.session.locationKey,
            currentConditions: req.session.currentConditions,
            currentConditionsUNI: req.session.currentConditionsUNI,
            metricOrImperial: req.session.weatherSetting,
        })
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

