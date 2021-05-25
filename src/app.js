const express = require('express')
const path = require('path')
const hbs = require('hbs')
const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode')


const app = express()

// Defining the port no 
const port = process.env.PORT || 8080

// Set the view engige and views folder
const viewsPath = path.join(__dirname, '..', 'templates/views')
app.set('view engine', 'hbs')
app.set('views', viewsPath)

// Register partials and give location
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)

// Serve static files
const publicFolderPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicFolderPath))

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'SD'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpfulText: 'This is some helpful text.',
        name: 'SD'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'SD'
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You must provide search text!'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: 'Please, provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res)=> {
    res.render('404', {
        title: '404',
        name: 'SD',
        errorMessage: 'Help page not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'SD',
        errorMessage: 'My 404 page!'
    })
})


// Server creation
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})