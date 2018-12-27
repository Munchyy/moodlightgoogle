const express = require('express');
const bodyparser = require('body-parser');
const driver = require('rpi-ws281x-native');
const debug = require('debug')('led-server');

const NUMBER_OF_LEDS = 32;
const port = 3000;

let app = express();
app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/display', (req, res) => {
  let leds = req.body.leds;

  if (leds && Array.isArray(leds) && (leds.length === NUMBER_OF_LEDS && leds.every(l => l >= 0 && l <= 0xffffff))) {
    driver.render(leds);
    res.status(200).json({response: 'ok'});
  } else {
    res.status(400).json({response: 'error', received: leds});
  }
});

app.get('/clear', (req, res) => {
  console.log('get');
  const leds = [
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
  ];
  driver.render(leds);
  res.status(200).json({response: 'ok'});
});
let server = app.listen(3000);
console.log('initialising');
driver.init(NUMBER_OF_LEDS);
driver.setBrightness(5);
console.log('Server running on moodlight:3000');
