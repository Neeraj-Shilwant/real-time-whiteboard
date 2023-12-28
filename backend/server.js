const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const { adduser, removeuser, getuser } = require("./utils/users");

const io = new Server(server);
//routes
app.get("/",(req,res)=>{
    res.send("this is real time whiteboard server.");
})

let ROOMID,IMGURL;

io.on("connection",(socket)=>{

    socket.on("userJoined",(data)=>{
        const {Name,roomId,userId,host,presenter} = data;
        ROOMID = roomId;
        socket.join(roomId);
        
        const users = adduser({Name,roomId,userId,host,presenter,socketId:socket.id});
        
        socket.emit("userIsJoined",{success:true,users});
        socket.broadcast.to(roomId).emit("userJoinedMessage",Name);
        socket.broadcast.to(roomId).emit("allUsers",users);
        socket.broadcast.to(roomId).emit("whiteboardDataResponse",{
            imgUrl:IMGURL,
        });
    }) ; //whenever a new user will join will will get this msg.

    socket.on("Whiteboard",(data)=>{
       IMGURL = data;
       socket.broadcast.to(ROOMID).emit("whiteboardDataResponse",{
        imgUrl:data,
    })
    });
    
    socket.on("message",(data)=>{
        const message = data;
        const user = getuser(socket.id);
        
        if(user){
        
            socket.broadcast.to(ROOMID).emit("messageResponse",{message,name:user.Name});
        }
        
    });

    socket.on("disconnect",()=>{
        
        const user = getuser(socket.id);
        
        
        if(user){
        removeuser(socket.id);
        socket.broadcast.to(ROOMID).emit("userLeftMessage",user.Name);
        }
        
    });
});

const port = process.env.PORT || 5000;
server.listen(port,()=>console.log("Server is running on http://localhost:5000"));