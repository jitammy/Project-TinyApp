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
app.get("/urls/:shortURL", (req, res) => {
    // console.log("hello")
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL] 
    };
    res.render("urls_show", templateVars);
  });
