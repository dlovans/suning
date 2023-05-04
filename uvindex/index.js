const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect('mongodb://127.0.0.1:27017/uvindex');

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

const Location = require('./models/locations.js')


app.get('/', (req, res) => {
    res.render('main/main')
})

app.post('/geocoder', async (req, res) => {
    try {
        console.log(req.body.location)
        const caseInsensitiveRegex = new RegExp(req.body.location, "i");
        let checkDB = await Location.find({ localizedName: caseInsensitiveRegex })
        console.log(checkDB)
        let arrayOfLocData = []
        if (!checkDB) {
            const response = await axios.get(`http://dataservice.accuweather.com//locations/v1/search?apikey=${process.env.accuWeatherAPI_KEY}&q=${req.body.location}&offset=25`);
            const databaseInteraction = async function () {
                for (let locData of response.data) {
                    let inDatabase = await Location.findOne({ key: locData.Key });
                    if (!inDatabase) {
                        const createLocDoc = new Location({
                            key: locData.Key,
                            localizedName: locData.LocalizedName,
                            city: locData.AdministrativeArea.LocalizedName,
                            country: locData.Country.ID
                        })
                        await createLocDoc.save()
                    }
                    arrayOfLocData.push({
                        LocalizedName: locData.LocalizedName,
                        AdministrativeArea: { LocalizedName: locData.AdministrativeArea.LocalizedName },
                        Key: locData.Key,
                        Country: { ID: locData.Country.ID }
                    })
                }
            }
            await databaseInteraction()
        } else {
            let databaseToArray = async function () {
                for (let result of checkDB) {
                    arrayOfLocData.push({
                        LocalizedName: result.localizedName,
                        AdministrativeArea: { LocalizedName: result.city },
                        Key: result.key,
                        Country: { ID: result.country }
                    })
                }
            }
            await databaseToArray()
        }
        res.json(arrayOfLocData)
    } catch (err) {
        console.log(err)
    }
});


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

