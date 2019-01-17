const fs = require("fs");

const getFile = function(url) {
  if (url === "/") return "./public/index.html";
  return "./public" + url;
};

const app = (req, res) => {
  let path = getFile(req.url);
  fs.readFile(path, function(err, data) {
    try {
      res.statusCode = 200;
      res.write(data);
      res.end();
    } catch (error) {
      res.statusCode = 404;
      res.end();
    }
  });
};

// Export a function that can act as a handler

module.exports = app;
