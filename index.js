import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import validUrl from 'valid-url';
import { nanoid } from 'nanoid';

const app = express();
//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const urlDatabase = {}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

//
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body

  //validate url
  if (!validUrl.isWebUri(url)) {
    return res.json({ error: 'Invalid URL' })
  }

  //generate a short url identifier
  const shorturl = nanoid(6)

  //save the mapping in database
  urlDatabase[shorturl] = url

  res.json({
    original_url: url,
    short_url: shorturl,
  })
})

//Api to redirect shorturl ot original url
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params

  const originalurl = urlDatabase[shortUrl]

  if (!originalurl) {
    return res.json({ error: 'No short URL found for the given input' })
  }
  res.redirect(originalurl)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
