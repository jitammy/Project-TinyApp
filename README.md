# Project-TinyApp

## User Stories
As an avid twitter poster, 
I want to be able to shorten links 
so that I can fit more non-link text in my tweets.

As a twitter reader, 
I want to be able to visit sites via shortened links, 
so that I can read interesting content.

![login page](https://github.com/jitammy/Project-TinyApp/blob/master/views/images/login.png )
![Register page](https://github.com/jitammy/Project-TinyApp/blob/master/views/images/register.png)
![Main page](https://github.com/jitammy/Project-TinyApp/blob/master/views/images/main.png)
![Create page](https://github.com/jitammy/Project-TinyApp/blob/master/views/images/create.png)

## Dependencies:
- Node.js
- Express
- EJS
- Bcypt
- Cookie-session
- body-parser

## Security
All personal information is encrypted using bcrypt, and cookie-session is used to establish a private and secure connection between the server and the client. If the user is not logged in, all web features are disabled until a valid user is logged in
