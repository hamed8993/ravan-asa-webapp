const mongoose = require('mongoose');
const Chat = require("./app/models/chats/chat.js");
module.exports = class WebSocketServer {
   constructor() {
        const WebSocket = require("ws");
        const Chat = require('./app/models/chats/chat.js');
        // let  chats = await Chat.find({});
        const wsServer = new WebSocket.Server({
            port:1000
        });
        wsServer.on("connection", function connection(ws,request,client) {

            // wsServer.wichChatRoom = request.... ;
            ws.on("message", function message(msg) {
                let chatRoomID = request.url.substring(1)
                // console.log('chatRoomID::>>>>',chatRoomID)
                wsServer.chatRoomId = chatRoomID;//??? type???
                // console.log(`${msg} from from ${client}`,`req:>>${request}`)
                const {data,event,status,userID,haveRoom,chatBy_id} = JSON.parse(msg);
                ws.chatRoomId= wsServer.chatRoomId;
                wsServer.clients.forEach(async function each(client) {
                     // console.log('*******client.chatRoomId:>>>>',ws.chatRoomId)
                    // console.log('client>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
                    //     client._headers);
                    if(client == ws && event == 'message')  {
                        let newChat = await Chat({
                            chatRoom: mongoose.Types.ObjectId(haveRoom),
                            user: mongoose.Types.ObjectId(userID),
                            body: data
                        });
                        await newChat.save();
                    }
                     if (client !== ws  && client.chatRoomId == ws.chatRoomId) {//&& client.readyState === WebSocket.OPEN
                          if(event == 'typing')  return client.send('typing');
                          if(event == 'seen') {
                              client.send('!seen!');
                              console.log('seeen');
                               await Chat.update( {$and:[{user:mongoose.Types.ObjectId(chatBy_id)},{chatRoom:mongoose.Types.ObjectId(haveRoom)}]},
                                  {
                                      $set : {msgSeen: true}
                                  },{multi: true});
                            // console.log('********updated!**********')
                            return
                          }
                          if(event == 'status'){
                              if(status == 'online') return client.send('online');
                              if(status == 'offline') return client.send('offline');
                          }
                          //  let newChat =await Chat({
                          //      chatRoom: mongoose.Types.ObjectId(haveRoom),
                          //      user: mongoose.Types.ObjectId(userID) ,
                          //      body: data
                          //  });
                          // await newChat.save();
                         // console.log(newChat);
                        client.send(data);
                    }
                })
            });
        })

        wsServer.on('upgrade', async function upgrade(request, socket, head) {
            //emit connection when request accepted
            wsServer.handleUpgrade(request, socket, head, function done(ws) {
                wsServer.emit('connection', ws, request);
            });
        });

    }

}