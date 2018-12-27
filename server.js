const express = require('express');
const bodyparser = require('body-parser');
const driver = require('rpi-ws281x-native');
const colours = require('./colours.json');

const NUMBER_OF_LEDS = 32;
const port = 5000;

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

const getLeds = (colour) => {
  const index = colours.findIndex(col => col.name.toLowerCase() === colour.toLowerCase())
  if (index !== -1) {
    return new Array(NUMBER_OF_LEDS).fill(parseInt(colours[index].hex, 16));
  }
  return new Array(NUMBER_OF_LEDS).fill(0);
};

app.post('/google', (req, res) => {
  const colourCommand = req.body.colour;

  console.log({colourCommand});
  const leds = getLeds(colourCommand);
  console.log(leds);
  res.status(200).json({response: 'ok'});
  driver.render(leds);
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
let server = app.listen(port);
console.log('initialising');
driver.init(NUMBER_OF_LEDS);
driver.setBrightness(5);
console.log('Server running on moodlight:' + port);
