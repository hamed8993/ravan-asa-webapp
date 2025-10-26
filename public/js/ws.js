
//DOM Elements
const Messages = document.getElementById("messages")
const myInput = document.getElementById("message");
const UserID = document.getElementById("userID");
const ChatBy_id = document.getElementById("chatBy_id");

const HaveRoom = document.getElementById("haveRoom");
const sendBtn = document.getElementById("send")
sendBtn.disabled = true
// sendBtn.addEventListener("click", sendMsg, false)
sendBtn.addEventListener("click", sendMsg, false)
////////////////////////////////////////////
//Websocekt variables
// const moment = require('moment');
const url = `ws://localhost:1000/${HaveRoom.value}`;
const clientWsServer = new WebSocket(url);
// const Chat = require('app/models/chats/chat.js');
WebSocket.prototype.emit = function (data,event,status,userID,haveRoom,chatBy_id){
    this.send(JSON.stringify({data,event,status,userID,haveRoom,chatBy_id}));
    // return userID || data
}


//********************Functions:********************** */
// for date now:
function generateDate() {
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }
    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let time = h + ":" + m ;
   return time;
}

//Creating DOM element to show received messages on browser page
function myGeneration(msg) {
    const newMessageContainer_DIV = document.createElement("div");
    newMessageContainer_DIV.style='width:60%;margin:5px 5px 5px 38%;border-radius:5px;background:#d9fdd3;';
    const newMessage_P = document.createElement("p");
    newMessage_P.style = 'padding:10px; margin:3px 2px 25px 5px;';
    newMessage_P.innerText = msg;
    newMessageContainer_DIV.appendChild(newMessage_P);
    const timeStamp_i = document.createElement('i');
    timeStamp_i.style = 'margin-right:80%;';
    timeStamp_i.innerText = generateDate(); //DATE().NOW()!!!!
    newMessageContainer_DIV.appendChild(timeStamp_i);
    const checksContainer = document.createElement('i');
    checksContainer.style = 'color:#7aceef;';
    checksContainer.className = 'checksContainer';
    const sentCheck = document.createElement('i');
    sentCheck.className = 'fa fa-check';
    checksContainer.appendChild(sentCheck);
    const seenCheck = document.createElement('i');
    seenCheck.className = 'fa fa-check';
    seenCheck.style.display = 'none';
    seenCheck.setAttribute('checkseenatr','willSeen');
    checksContainer.appendChild(seenCheck);
    newMessageContainer_DIV.appendChild(checksContainer);
    Messages.appendChild(newMessageContainer_DIV);

}

    function GuestMSGGeneration(data){
        const newMessageContainer_DIV = document.createElement("div");
        newMessageContainer_DIV.style='width:60%;margin:5px 38% 5px 5px;border-radius:5px;background:#ffffff;';
        const newMessage_P = document.createElement("p");
        newMessage_P.style = 'padding:10px; margin:3px 2px 25px 5px;';
        newMessage_P.innerText = data;
        newMessageContainer_DIV.appendChild(newMessage_P);
        const timeStamp_i = document.createElement('i');
        timeStamp_i.style = 'margin-right:80%;';
        timeStamp_i.innerText = generateDate(); //DATE().NOW()!!!!
        newMessageContainer_DIV.appendChild(timeStamp_i);
        Messages.appendChild(newMessageContainer_DIV);
    }

//**************SEND LIsteners : ******************************** */
window.addEventListener("load",()=>{SendOnStatus(); iHaveSaw()});
window.addEventListener("mouseover",()=>{SendOnStatus(); iHaveSaw()});
document.addEventListener("click",()=>{SendOnStatus(); iHaveSaw()});
document.addEventListener("visibilitychange",function() {
    if (document.hidden) {
        SendOffStatus();
        console.log('SENT:: visibilitychange=>hidden')
    } else {
        SendOnStatus();
        iHaveSaw();
        console.log('SENT:: visibilitychange=>visible')
    }
} );
//for "TYPING..." feature:
myInput.addEventListener('keypress',()=>{
    clientWsServer.emit('','typing','');
});

//**************SEND Commands to-SERVER:******************************************** */
//Sending message from client
async function sendMsg() {
    const text = myInput.value
    myGeneration(text);
    clientWsServer.emit(text,'message','',UserID.value,HaveRoom.value);
   }

function SendOnStatus(){
    clientWsServer.emit('','status','online');
    console.log('my-on-status-sent');
}

function SendOffStatus(){
    clientWsServer.emit('','status','offline');
    console.log('my-off-status-sent')
}

function iHaveSaw() {
    clientWsServer.emit('','seen','','',HaveRoom.value,ChatBy_id.value);
}
//********************Receive Commands from-Sever:******************************* */
clientWsServer.onopen = function() {
    sendBtn.disabled = false
}
clientWsServer.onclose = function() {
    sendBtn.disabled = true;
    ShowOffStatus();
}
//handling message event
clientWsServer.onmessage = function(event) {
    const { data } = event;
    if(data == 'typing') return typing();// for typing****
    if(data == 'online') return ShowOnStatus();
    if(data == 'offline') return ShowOffStatus();
    if(data == 'received') return received();
    if(data == '!seen!') return Seen();
    GuestMSGGeneration(data);
}

//********************Functions for Received Commands from-Sever:******************************* */
function typing(){
    document.querySelector('.typing').style.visibility = 'visible';
    setTimeout(()=>{
        document.querySelector('.typing').style.visibility = 'hidden';
    },500)
}

function ShowOnStatus(){
    document.getElementById('status').innerHTML = 'آنلاین'
    document.getElementById('status').style.color = 'green';
    console.log('GUEST-Status:>on-line')
}

function ShowOffStatus(){
    document.getElementById('status').innerHTML = 'آفلاین'
    document.getElementById('status').style.color = 'red';
    console.log('GUEST-Status:>off-line')
}

function receivedCheck(){
    console.log('RECEIvEDDD')
    document.getElementById('receivedCheck').display = 'block';
}

function Seen(){
    console.log('seennnnnnnnnn*********************************************************')
    const collection = document.querySelectorAll('[checkseenatr]');

    for(let i=0; i < collection.length; i++){
        // console.log('collection[i]>>>>',collection[i]);
        collection[i].style.display = 'inline';//با نغییر کلاس نمیشه...
    }
}

function msGeneration(msg, from) {
    const newMessage = document.createElement("p")
    newMessage.innerText = `${from} says: ${msg}`
    newMessage.setAttribute("onfocus", "iHaveSaw()");//?????
    myMessages.appendChild(newMessage);
    if(!document.hasFocus()){//************************SEND Message Recieve ********************** */
        iHaveSaw()
        //   console.log('!document.hasFocus()');
    };
}
