const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keyPressHandler = require('./keypressHandler');
const mess = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => {}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  fs.readFile(module.exports.backgroundImageFile, (err, data) => {
    if (err) {
      console.log('this is the error from fs.readFile: ');
      res.writeHead(404, headers);
      res.end();
      next();
    } else {
      // console.log('successful fs.readFile')
      res.writeHead(200, headers);
      // res.write(data)
      res.end();
    }
  });
  res.writeHead(200, headers);
  // var directions = ['up', 'down', 'left', 'right'];
  // var randomDirection = directions[Math.floor(Math.random() * 4)];
  var dequeue = mess.dequeue();
  if (req.method === 'GET' && dequeue) {
    console.log(dequeue);
    res.write(dequeue);
  }
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
