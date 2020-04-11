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

  if (req.method === 'GET') {
    if (req.url === '/') {
      var dequeue = mess.dequeue() || 'up';

      res.writeHead(200, headers);
      res.write(dequeue);
      res.end();
      next();
    } else if (
      req.url === '/background.jpg' &&
      fs.existsSync(module.exports.backgroundImageFile)
    ) {
      var backgroundImageData = fs.readFileSync(
        module.exports.backgroundImageFile
      );
      res.writeHead(200, headers, { 'Content-Type': 'image/jpeg' });
      res.write(backgroundImageData);
      res.end();
      next();
    } else {
      console.log('line 51');
      res.writeHead(404, headers);
      res.end();
      next();
    }
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }

  // next(); // invoke next() at the end of a request to help with testing!
};

// res.writeHead(200, headers);
// var directions = ['up', 'down', 'left', 'right'];
// var randomDirection = directions[Math.floor(Math.random() * 4)];

// console.log('background image path does exist');
// fs.readFile(module.exports.backgroundImageFile, (err, data) => {
//   if (err) {
//     res.writeHead(404, headers);
//     // throw err;
//   } else {
//     res.writeHead(200, headers, { 'Content-Type': 'image/jpeg' });
//     res.write(data);
//   }
//   res.end();
//   next();
// });

// res.writeHead(200, headers);
// res.end();

// res.end();
// else {
//   res.writeHead(404, headers);
//   res.end();
// }
