const  request = require('request')


const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=340f86294a96351b7046297a84316d99&query='+ latitude +','+ longitude

    request({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location!', undefined)
        } else {
            callback(undefined, `${body.current.weather_descriptions[0]}, It is currently ${body.current.temperature} degrees out. There is ${body.current.humidity}% chance of rain.`)
        }
    })
}


module.exports = forecast