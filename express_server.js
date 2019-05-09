// require npm package to use
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
// app use
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('short'));
// app.use(cookieParser())
app.use(
    cookieSession({
        name: 'session',
        keys: ['my super secret cookie']
    })
)
// functions
function generateRandomString(){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < 6; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    if (checkIdExists(random_string)) {
        generateRandomString();
    } 
    return random_string
}
//add new users
function addNewUser(email, password) {
    let userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: email,
      password: bcrypt.hashSync(password, 10)
    }
    return userId
  }
  // check if a give Email is already in teh users
  function checkEmailExists(email) {
    for (user in users) {
      if(users[user].email === email){
        return true
      }
    }
    return false
  }
  // check if a give ID is already in the users/urlsDatabase
  function checkIdExists(userId){
    if (userId in users) {
      return true
    } else if (userId in urlDatabase) {
      return true
    }
    return false
  }
  //returns the URLs created by currently logged in user
  function urlsForUser(id) {
    let userUrls = {};
    for (var shortURL in urlDatabase){
      if (urlDatabase[shortURL].userID === id) {
        userUrls[shortURL] = {...urlDatabase[shortURL]}
      }
    }
    return userUrls
  }
// iterate users database to check if user email exist to decide whether register the user
function getUserByEmail(email){
    for(user in users){
        if(users[user].email === email){
            return users[user]
        }
    }
}
// database
var urlDatabase = {
    "b2xVn2": {
        ShortURL: "b2xVn2",
        longURL:"http://www.lighthouselabs.ca",
        userID: "user1"
    },
    "9sm5xK": {
        shortURL: "9sm5xK",
        longURL:"http://www.google.com",
        userID: "user2"
    }
}
const users = { 
    "user1": {
      id: "user1", 
      email: "a@a", 
      password: bcrypt.hashSync('a', 10)
    }
}
// get 
app.get("/", (req, res) => {
//   res.send("Hello!");
// const user = getUserById(req.session.user_id)
let templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase
}
res.render("urls_index", templateVars)
});
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
//   res.json([body]) 发送一个json的响应。这个方法和将一个对象或者一个数组作为参数传递给res.send()方法的效果相同
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//  get home page
app.get("/urls", (req, res) => {
    let templateVars = { 
        urls: urlDatabase,
        user: users[req.session.user_id]
    };
    console.log(templateVars)
    res.render("urls_index", templateVars);
});
// get create new url page
app.get("/urls/new", (req, res) => {
    let templateVars ={
        user: users[req.session.user_id],
    }
    console.log(templateVars)
    res.render("urls_new", templateVars);
});
// get reading shortURL 
app.get("/urls/:shortURL", (req, res) => {
    // console.log("hello")
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL],
        user: users[req.session.user_id],
    };
    res.render("urls_show", templateVars);
});
//post create a new ShortURL
app.post("/urls", (req, res) => {
    console.log(`longURL is ${req.body.longURL}`);  // Log the POST request body to the console
    // res.send("Ok");         // Respond with 'Ok' (we will replace this)
    let randomString = generateRandomString()
    urlDatabase[randomString] = req.body.longURL;
    console.log(urlDatabase)
    res.status(200)
    let templateVars = {
        user: users[req.session.user_id],
    }
    res.redirect(`/urls/${randomString}`, templateVars)
});
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
});
app.get("/register", (req, res)=>{
    res.render("register")
})
app.get("/login", (req, res)=>{
    res.render("login")
})
// post: delete
app.post('/urls/:shortURL/delete', (req, res) => {
    delete urlDatabase[req.params.shortURL]
    res.redirect('/urls')
})
// post assign new longURL to your shortURL
app.post('/urls/:shortURL', (req, res)=>{
    // console.log(req.body.longURL)
    urlDatabase[req.params.shortURL] = req.body.longURL
    console.log(req.params.shortURL)
    res.redirect('/urls')
}) 
app.post('/login',(req, res)=> {
    // req.session('username', req.body.username)
    // res.redirect('/urls')
    const { email, password } = req.body
    if (email === "" || password === "") {
        res.status(403).send(`Please provide email and password`)
      } else if (checkEmailExists(email) === false ){
        res.status(403).send(`No account record`)
      } else if (bcrypt.compareSync(password, getUserByEmail(email).password)){
        req.session.user_id = getUserByEmail(email).id
        res.redirect("/urls")
      } else {
        res.status(403).send(`Please check your email and password and try again`)
      }
      console.log(users)
})
app.post('/logout', (req,res)=>{
    req.session.user_id = null
    res.redirect('/urls')
})
app.post("/register", (req, res)=>{
    const {email, password}= req.body
    if (email === "" || password === "" ) {
        res.status(400).send(`Please provide email and password!`);
      } else if (checkEmailExists(email)){
        res.status(404).send(`This email already has an account!`)
      } else {
        let userId = addNewUser(email, password);
        req.session.user_id = userId;
        res.redirect("/urls")
      }
      console.log(users)
      console.log(urlDatabase)
})
// listen on port 8080 for http requst
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});