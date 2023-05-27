const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const session = require('express-session')
const fs = require('fs')

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


app.use((req, res, next) => {
    if (!req.session.requests) {
        req.session.requests = 0
    }
    if (!req.session.timeStamp) {
        req.session.timeStamp = Date.now() + 60 * 60 * 1000
    }
    next()
})

app.get('/', (req, res) => {
    res.render('main/main', { onLoadSlideValue: req.session.weatherSetting })
})




app.post('/geocoder', async (req, res) => {
    try {
        if (req.session.requests >= 1000) {
            if (Date.now() > req.session.timeStamp) {
                req.session.timeStamp = Date.now() + 60 * 60 * 1000
                req.session.requests = 0
                const response = await axios.get(`http://dataservice.accuweather.com//locations/v1/search?apikey=${process.env.accuWeatherAPI_KEY}&q=${req.body.location}&offset=25`);
                req.session.requests++
                res.json(response.data)
            } else {
                res.json({
                    status: "failure"
                })
            }
        } else {
            const response = await axios.get(`http://dataservice.accuweather.com//locations/v1/search?apikey=${process.env.accuWeatherAPI_KEY}&q=${req.body.location}&offset=25`);
            req.session.requests++
            res.json(response.data)
        }

    }
    catch (err) {
        console.log(err)
    }
});

app.post('/weatherAPI', async (req, res) => {
    try {
        if (req.session.requests >= 1000) {
            if (Date.now() > req.session.timeStamp) {
                req.session.requests = 0
                req.session.timeStamp = Date.now() + 60 * 60 * 1000
                if (!req.session.currentConditions || req.session.locationKey !== req.body.key) {
                    const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${req.body.key}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                    req.session.requests++
                    console.log(req.session.requests)
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
                    status: "success",
                    locationName: req.session.location,
                    locationKey: req.session.locationKey,
                    currentConditions: req.session.currentConditions,
                    currentConditionsUNI: req.session.currentConditionsUNI,
                    metricOrImperial: req.session.weatherSetting,
                })
            } else {
                res.json({
                    status: "failure"
                })
            }
        } else {
            if (!req.session.currentConditions || req.session.locationKey !== req.body.key) {
                const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${req.body.key}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                req.session.requests++
                console.log(req.session.requests)
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
                status: "success",
                locationName: req.session.location,
                locationKey: req.session.locationKey,
                currentConditions: req.session.currentConditions,
                currentConditionsUNI: req.session.currentConditionsUNI,
                metricOrImperial: req.session.weatherSetting,
            })
        }
    }
    catch (err) {
        console.log(err)
    }
})


app.get('/loadEvent', async (req, res) => {
    try {
        if (req.session.requests >= 1000) {
            if (Date.now() > req.session.timeStamp) {
                req.session.requests = 0
                req.session.timeStamp = Date.now() + 60 * 60 * 1000
                if (req.session.locationKey) {
                    const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                    req.session.requests++
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
                        status: "success",
                        locationName: req.session.location,
                        locationKey: req.session.locationKey,
                        currentConditions: req.session.currentConditions,
                        currentConditionsUNI: req.session.currentConditionsUNI,
                        metricOrImperial: req.session.weatherSetting,
                    })
                } else {
                    const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${310227}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                    req.session.requests++
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
            } else {
                res.send("Maximum number of API requests. Wait 1 hour!")
            }
        } else {
            let locationKey = req.session.locationKey
            if (req.session.locationKey) {
                const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                req.session.requests++
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
                    status: "success",
                    locationName: req.session.location,
                    locationKey: req.session.locationKey,
                    currentConditions: req.session.currentConditions,
                    currentConditionsUNI: req.session.currentConditionsUNI,
                    metricOrImperial: req.session.weatherSetting,
                })
            } else {
                const conditions = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${310227}?apikey=${process.env.accuWeatherAPI_KEY}&details=true`)
                req.session.requests++
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
                    status: "success",
                    locationName: "Hjulsta, Stockholm, SE",
                    locationKey: req.session.locationKey,
                    currentConditions: req.session.currentConditions,
                    currentConditionsUNI: req.session.currentConditionsUNI,
                    metricOrImperial: req.session.weatherSetting,
                })
            }
        }
    } catch (err) {
        console.log(err)
    }

})

app.get('/slider-setting', (req, res) => {
    try {
        if (!req.session.weatherSetting) {
            req.session.weatherSetting = "Imperial"
        } else if (req.session.weatherSetting === "Metric") {
            req.session.weatherSetting = "Imperial"
        } else {
            req.session.weatherSetting = "Metric"
        }
        console.log(req.session.weatherSetting)
        let sliderValue = req.session.weatherSetting
        res.json({
            sliderValue: sliderValue,
            currentConditions: req.session.currentConditions
        })
    } catch (err) {
        console.log(err)
    }
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

