const express = require('express')
const main = require('./src/routes/main');
const app = express();

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/js', express.static(__dirname + 'public/js'))


app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use('/', main);
module.exports = app;