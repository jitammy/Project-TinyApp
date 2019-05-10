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
        keys: ['my super secret cookie'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
    if(req.session.user_id){
        res.redirect("/urls")
    } else {
        res.redirect("/login")
    }
});
//  get home page
app.get("/urls", (req, res) => {
    if(req.session.user_id){
        let templateVars = { 
            user: users[req.session.user_id],
            urls: urlsForUser(req.session.user_id)
        }
        console.log(templateVars)
        res.render("urls_index", templateVars)
    } else {
        res.status(401).send(`Unauthorized! Pls login or register first`)
    } 
});
// get create new url page
app.get("/urls/new", (req, res) => {
    if(req.session.user_id){
        let templateVars = {
            user: users[req.session.user_id]
        }
        console.log(templateVars)
        res.render("urls_new", templateVars);
    } else {
        res.redirect('login')
    }
});
// get reading shortURL 
app.get("/urls/:shortURL", (req, res) => {
    if(req.session.user_id = urlDatabase[req.params.shortURL].userID){
        let templateVars = {
            shortURL: req.params.shortURL,
            longURL: urlDatabase[req.params.shortURL].longURL,
            user: users[req.session.user_id],
        }
        res.render("urls_show", templateVars);
    } else if(req.session.user_id) {
        res.status(401).send(`You may only edit your own URL`)
    }
    else {
        res.redirect('login')
    }
})
app.get("/u/:shortURL", (req, res) => {
    if(urlDatabase.hasOwnProperty([req.params.shortURL])) {
        res.redirect(urlDatabase[req.params.shortURL].longURL);
    } else {
        res.status(401).send(`Unauthorized user`)
    }
})
app.get("/register", (req, res)=>{
    if(req.session.user_id){
        let templateVars = {
            shortURL: req.params.shortURL,
            longURL: urlDatabase[req.params.shortURL].longURL,
            user: users[req.session.user_id],
        }
        res.redirect('urls', templateVars)
    } else {
        res.render("register")
    }
})
app.get("/login", (req, res) => {
    if(req.session.user_id){
        let templateVars = {
            shortURL: req.params.shortURL,
            longURL: urlDatabase[req.params.shortURL].longURL,
            user: users[req.session.user_id],
        }
        res.redirect('urls', templateVars)
    } else {
        res.render("login")
    }
})
app.post("/urls", (req, res) => {
    if(req.session.user_id){
        let randomString = generateRandomString()
        urlDatabase[randomString] = {
            longURL: req.body.longURL,
            userID: req.session.user_id
        }
        let templateVars = {
        user: users[req.session.user_id]
        }
        res.redirect(`/urls/${randomString}`, templateVars)
    } else {
        res.status(401).send(`Unauthorized user`)
    }
})
// post: delete
app.post('/urls/:shortURL/delete', (req, res) => {
    if(req.session.user_id){
        delete urlDatabase[req.params.shortURL]
        res.redirect('urls')
    } else if (req.session.user_id !== urlDatabase[req.params.shortURL].userID){
        res.status(401).send(`This is not your URL`)
    } else {
        res.status(401).send(`Unauthorized user`)
    }
})
// post assign new longURL to your shortURL
app.post('/urls/:shortURL', (req, res) => {
    if(req.session.user_id === urlDatabase[req.params.shortURL].userID ){
        urlDatabase[req.params.shortURL].longURL = req.body.longURL
        res.redirect('/urls')
    } else if (!req.session.user_id){
        res.status(401).send(`Unauthorized user`)
    } else {
        res.status(401).send(`This is not your URL`)
    }
}) 
app.post('/login',(req, res)=> {
    const { email, password } = req.body
    if (email === "" || password === "") {
        res.status(403).send(`Please provide email and password`)
      } else if (checkEmailExists(email) === false ){
        res.status(403).send(`No account record`)
      } else if (bcrypt.compareSync(password, getUserByEmail(email).password)){
        req.session.user_id = getUserByEmail(email).id
        res.redirect("urls")
      } else {
        res.status(403).send(`Please check your email and password and try again`)
      }
      console.log(users)
})
app.post("/register", (req, res) => {
    const {email, password}= req.body
    if (email === "" || password === "" ) {
        res.status(400).send(`Please provide email and password!`);
    } else if (checkEmailExists(email)){
        res.status(404).send(`This email already has an account!`)
    } else {
        let userId = addNewUser(email, password);
        req.session.user_id = userId;
        res.redirect("urls")
    }
    console.log(users)
    console.log(urlDatabase)
})
app.post('/logout', (req,res) => {
    req.session.user_id = null
    res.redirect('urls')
})
// listen on port 8080 for http requst
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})