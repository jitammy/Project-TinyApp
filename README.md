# Project-TinyApp

### User Stories
As an avid twitter poster, 
I want to be able to shorten links 
so that I can fit more non-link text in my tweets.

As a twitter reader, 
I want to be able to visit sites via shortened links, 
so that I can read interesting content.

![login page](../views/images/create.png)
![Register page](../views/images/register.png)
![Main page](../views/images/main.png)
![Create page](../views/images/create.png)

### Dependencies:
- Node.js
- Express
- EJS
- Bcypt
- Cookie-session
- body-parser

### Security
All personal information is encrypted using bcrypt, and cookie-session is used to establish a private and secure connection between the server and the client. If the user is not logged in, all web features are disabled until a valid user is logged in
