var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// functions
function generateRandomString(){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < 6; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}
// database
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
// get new url from website
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });
// show shortURL
app.get("/urls/:shortURL", (req, res) => {
    // console.log("hello")
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL] 
    };
    res.render("urls_show", templateVars);
  });
  //post 
  app.post("/urls", (req, res) => {
    console.log(req.body.longURL);  // Log the POST request body to the console
    // res.send("Ok");         // Respond with 'Ok' (we will replace this)
    let randomString = generateRandomString()
    urlDatabase[randomString] = req.body.longURL;
    console.log(urlDatabase)
    res.status(200)

    res.redirect(`/urls/${randomString}`)
  });

  app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });