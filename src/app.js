const fs = require("fs");

const getFile = function(url){
  if(url == '/') return './index.html';
  return '.' + url;
}

const app = (req, res) => {
  let path = getFile(req.url);
  fs.readFile(path, function(err, data) {
    res.statusCode = 200;
    res.write(data);
    res.end();
  });
};

// Export a function that can act as a handler

module.exports = app;
