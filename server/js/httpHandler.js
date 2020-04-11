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
  var directions = ['up', 'down', 'left', 'right'];
  var randomDirection = directions[Math.floor(Math.random() * 4)];

  if (req.method === 'GET') {
    if (req.url === '/') {
      var dequeue = mess.dequeue() || randomDirection;

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
      res.writeHead(404, headers);
      res.end();
      next();
    }
  }
  if (req.method === 'POST') {
    var body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body);
        var imageFile = multipart.getFile(body);
        fs.writeFile(
          module.exports.backgroundImageFile,
          imageFile.data,
          (err) => {
            if (err) {
              throw err;
            }
            res.writeHead(201, headers, { 'Content-Type': imageFile.type });
            res.end();
            next();
          }
        );
      });
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }
};
