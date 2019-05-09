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
    return random_string
}
// iterate users database to check if user email exist to decide whether register the user
function getUserByEmail(email){
    for(user in users){
        if(user.email === email){
            return user
        }
    }
    return false;
}
// database
var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "a@a", 
      password: "a"
    },
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
    const {email, password}= req.body
    if (email && password) {
        if (getUserByEmail(email)){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    console.log(" Error checking passwords", err)
                    res.redirect('/login')
                } else if (result){
                    req.session.user_id = user_id
                    res.redirect('/urls')
                } else {
                    res.send(403, `Password in valid`)
                }
            })
        } else {
            res.send(403, `Invalid user or password`)
        }
    } else {
        res.send(400, `Pls provide valid user information`)
    }
})
app.post('/logout', (req,res)=>{
    req.session.user_id = null
    res.redirect('/urls')
})
app.post("/register", (req, res)=>{
    let randomUserID = generateRandomString()
    const {email, password, password_confirm}= req.body
    console.log(req.body)
    if(getUserByEmail(email)){
        res.send(400, `<h2>"BAD REQUEST USER ALREADY EXIST"</h2>`)
    } else {
        if ( email && password && password_confirm){
            if(password === password_confirm){
                bcrypt.hash(password, 10 ,(err, password_hashed)=>{
                    if (err){
                        console.log("Got an error hashing the password")
                        res.redirect("/register")
                    } else {
                        users[randomUserID] = {
                            user_id: randomUserID,
                            email: email,
                            password: password_hashed
                        }
                    req.session.user_id = randomUserID
                    res.redirect("/urls")
                    }
                })
            } else {
                console.log("password not match")
                res.redirect ("/register")
            }
        } else if(!email || !password || !password_confirm){
            res.send(400, `<h2>BAD REQUEST PLSESE INPUT REGISTRATION INFO</h2>`)
        } 
    }
})
// listen on port 8080 for http requst
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});