if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/uvindex');

app.set('view engine', 'ejs')
app.set('public', path.join(__dirname, 'public'))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('main/main')
})

app.listen('2000', () => {
    console.log('listening on port 2000')
})