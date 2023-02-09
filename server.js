import express from 'express'
import router from './src/routes/main'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.static('public'))
app.use('/css', express.static(`${__dirname}/public/css`))
app.use('/images', express.static(`${__dirname}/public/images`))
app.use('/js', express.static(`${__dirname}/public/js`))

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use('/', router)

const server = app.listen(5000, () => {
    console.log(`Express is running on port ${server.address().port} http://localhost:5000`);
});