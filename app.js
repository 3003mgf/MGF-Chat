const express = require("express"),
      app = express(),
      http = require("http").createServer(app),
      io = require("socket.io")(http),
      logger = require("morgan"),
      port = process.env.PORT || 3000,
      publicDir = express.static(`${__dirname}/public`);



app
    .use(publicDir)
    .use(logger("dev"))

    .get("/", (req, res)=>{
      res.sendFile(`${publicDir}/index.html`)
    })

http.listen(port, "localhost", ()=>{
  console.log("Server running at localhost %d", port);
})


//CHATROOM

let usersConnected = 0;
let users = {};


io.on("connection", (socket)=>{
  
  socket.on("checkUsername", (username, cb)=>{
     if(users.hasOwnProperty(username)){
       cb(false);
     }else{
       users[username] = "exists";
       cb(true);
     }
  })

  socket.on("setUserName", (username)=>{
    
     socket.username = username;
     usersConnected++;

     socket.emit("welcome", {message: `Welcome to MGF.IO Chat <br> <b>Users Online:</b> ${usersConnected}`});
     socket.broadcast.emit("welcome", {message: `Welcome to MGF.IO Chat <br> <b>Users Online:</b> ${usersConnected}`});
     socket.broadcast.emit("new user", {message: `<b>${socket.username}</b> has joined the chat`, username: socket.username});
  });
  
  socket.on("new message", (data)=>{
    socket.emit("show message", {message: data.message, username: socket.username});
    socket.broadcast.emit("show message", {message: data.message, username: socket.username});
  })

  socket.on("disconnect", ()=>{
    if(socket.username){
      usersConnected--;
      socket.broadcast.emit("user left", {message: `<b>${socket.username}</b> left the chat`, username: socket.username});
      socket.broadcast.emit("welcome", {message: `Welcome to MGF.IO Chat <br> <b>Users Online:</b> ${usersConnected}`});
    }
  })

})


