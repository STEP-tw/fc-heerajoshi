const fs = require("fs");
const Handler = require("./handler.js");
const app = new Handler();

if (!fs.existsSync("./src/comments.json")) {
  fs.writeFileSync("./src/comments.json", "[]", "utf-8");
}
const comments = JSON.parse(fs.readFileSync("./src/comments.json"));

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = unescape(content).replace(/\+/g, " ");
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
      send(res, "file_not_found", 404);
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
    .map(element => element.split("="))
    .forEach(([key, value]) => (args[key] = value));
  return args;
};

const getMessage = messageData => {
  return `<p>${messageData.date}<b>${" " + messageData.name}</b>${" " +
    messageData.comment}</p>`;
};

const writeComments = function(res) {
  fs.readFile("./public/guest.html", "utf-8", (err, content) => {
    let commentsHTML = "";
    comments.forEach(data => {
      let message = getMessage(data);
      commentsHTML += message;
    });
    const guestBookPageHTML = content.replace("____COMMENTS____", commentsHTML);
    send(res, guestBookPageHTML);
  });
};

const renderGuestBook = (req, res) => {
  const text = req.body;
  let { name, comment } = readArgs(text);
  let date = new Date();
  comments.unshift({ name, comment, date: date.toLocaleString() });
  fs.writeFile("./src/comments.json", JSON.stringify(comments), err => {
    return;
  });
  writeComments(res);
};
const serveComments = function(req, res) {
  fs.readFile("./public/guest.html", "utf-8", (err, content) => {
    let commentsHTML = "";
    comments.forEach(data => {
      let message = getMessage(data);
      commentsHTML += message;
    });
    send(res, commentsHTML);
  });
};

const renderError = (req, res, err) => {
  send(res);
};

const renderGuestURL = function(req, res) {
  writeComments(res);
};

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

app.use(logRequest);
app.use(readBody);
app.get("/guest.html", renderGuestURL);
app.post("/guest.html", renderGuestBook);
app.get("/comments", serveComments);
app.use(renderURL);
app.error(renderError);
module.exports = app.handleRequest.bind(app);
