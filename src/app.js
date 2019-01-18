
const fs = require("fs");
const comments = require("./comments.json");
const Handler = require("./handler.js");
const app = new Handler();

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const getURLPath = function(url) {
  if (url == "/") return "./public/index.html";
  return "./Public" + url;
};

const readContent = function(res, url) {
  const path = getURLPath(url);
  fs.readFile(path, (err, content) => {
    if (err) {
      send(res, "Invalid_Request", 404);
      return;
    }
    send(res, content);
  });
};

const renderURL = (req, res) => {
  let url = req.url;
  readContent(res, url);
};

const readArgs = text => {
  let args = {};
  text
    .split("&")
    .map(element=> element.split("="))
    .forEach(([key,value])=>args[key]=value);
  return args;
};

const getMessage = (res, messageData) => {
  return `<h2>${messageData.name}<h2><h3>${messageData.date}</h3><p>${
    messageData.comment
  }</p>`;
};

const writeComments = function(res) {
  fs.readFile('./public/guest.html', (err, content)=>{
    comments.forEach(data => {
      let message = getMessage(res, data);
      content += message;
    });
    send(res, content)
  })
};

const renderGuestBook = (req, res) => {
  const text = req.body;
  let { name, comment } = readArgs(text);
  let date = new Date();
  comments.unshift({ name, comment, date: date.toLocaleString() });
  fs.writeFile('./src/comments.json', JSON.stringify(comments), (err) => {
    return;
  });
  writeComments(res);
};

const renderError = (req, res, err) => {
  send(res);
};

app.use(readBody);
app.get(renderURL);
app.post("/guest.html", renderGuestBook);
app.error(renderError);
module.exports = app.handleRequest.bind(app);