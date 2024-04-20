const express=require("express")
const app=express();
const path=require("path");
const socket = require("socket.io");



const server=app.listen(3000,(req,res)=>{
    console.log("server run in port 3000");
})
const io=require("socket.io")(server);

app.use(express.static(path.join(__dirname,"public")))
let socketConected=new Set()
io.on("connection",onconected)
    

function onconected(socket){
    console.log(socket.id)
    socketConected.add(socket.id);
    io.emit("clients_total",socketConected.size)
    socket.on("disconnect",()=>{
        console.log("socked disconnected",socket.id)
        socketConected.delete(socket.id)
        io.emit("clients_total",socketConected.size)

    })
    socket.on("message",(data)=>{
        console.log(data)
        socket.broadcast.emit("chat_message",data)

    })

    socket.on("feedback",(data)=>{
        socket.broadcast.emit("feedback",data);
    })

    
}