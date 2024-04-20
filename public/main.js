
const socket=io()
const clients_total=document.getElementById("clients_total");


const user_name=document.querySelector(".user_name")
const messageContainer=document.querySelector(".message_content")

const messageforn=document.querySelector("#messageforn")

const send_message=document.querySelector(".send_message")

const messageTone=new Audio("/messageTone.mp3");

messageforn.addEventListener("submit",(e)=>{
    e.preventDefault()
    sendedMessage()
    
})

socket.on("clients_total",(data)=>{
    clients_total.innerText=`total clients ${data}`
    
})

function sendedMessage(){
    if (send_message.value==="")return
    console.log(send_message.value)
    const data={
        name:user_name.value,
        message:send_message.value,
        dateTime: new Date()
    }
    socket.emit("message",data);
    addMessageToUI(true,data)
    send_message.value='';
}
socket.on("chat_message",(data)=>{
    messageTone.play();
   // console.log(data)
    addMessageToUI(false,data)
    
})


function addMessageToUI(isownMessage,data){
    clearMessages()
   const element=` 
   <li class="${isownMessage ? "message_right": "message_left"} ">
   <p id="message">
       ${data.message}
   </p>
   <span> ${data.name} ${moment(data.dateTime).fromNow()}</span>
</li>`
messageContainer.innerHTML += element;
scrollDown()
}

function scrollDown(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight);
}

addEventListener("keypress",(e)=>{
    
    
    socket.emit("feedback",{
        feeback:`${user_name.value} is typing a message`
    });

})
addEventListener("focus",(e)=>{
    socket.emit("feedback",{
        feeback:`${user_name.value} is typing a message`,
    });
})
addEventListener("blur",(e)=>{
    socket.emit("feedback",{
        feeback:'',
    });
})


socket.on("feedback",(data)=>{
    clearMessages()
    const element=`
        <div class="feedback">
            <p>${data.feeback}</p>
        </div>`

    messageContainer.innerHTML += element;
})
function clearMessages(){
    document.querySelectorAll("div.feedback").forEach(element=>{
        element.parentNode.removeChild(element)
    })
}