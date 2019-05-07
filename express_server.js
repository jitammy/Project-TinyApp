var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

//   res.json([body]) 发送一个json的响应。这个方法和将一个对象或者一个数组作为参数传递给res.send()方法的效果相同

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.get("/urls", (req, res) => {
let templateVars = { 
    urls: urlDatabase 
    };
res.render("urls_index", templateVars);
});

// Since we're following the Express convention of using a views directory, we can take advantage
// of a useful EJS shortcut! EJS automatically knows to look inside the views directory for any
// template files that have the extension .ejs. This means we don't need to tell it where to find
// them. It also means that we do not need to include the extension of the filename when
// referencing it.