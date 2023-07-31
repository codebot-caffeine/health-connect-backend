const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const socket = require('socket.io');
const port = 3000;
let users;
let count;
let chatRooms;
let messagesArray = [];

const app = express();

app.use(bodyParser.json());

const MongoClient = mongodb.MongoClient;

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

function chatApp(){
    MongoClient.connect('mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority', (err, Database) => {
        if(err) {
            console.log(err);
            return false;
        }
        console.log("Connected to MongoDB");
        const db = Database.db("root-db");
        users = db.collection("users");
        chatRooms = db.collection("chatRooms");
        const server = app.listen(port, () => {
            console.log("Server started on port " + port + "...");
        });
        const io = socket.listen(server,{cors: {origin: '*', methods: ['POST', 'GET']}, transports: ['websocket']});
    
        io.sockets.on('connection', (socket) => {
            socket.on('join', (data) => {
                socket.join(data.room);
                chatRooms.find({}).toArray((err, rooms) => {
                    if(err){
                        console.log(err);
                        return false;
                    }
                    count = 0;
                    rooms.forEach((room) => {
                        if(room.name == data.room){
                            count++;
                        }
                    });
                    if(count == 0) {
                        chatRooms.insert({ name: data.room, messages: [] }); 
                    }
                });
            });
            socket.on('message', (data) => {
                io.in(data.room).emit('new message', {user: data.user, message: data.message});
                chatRooms.update({name: data.room}, { $push: { messages: { user: data.user, message: data.message } } }, (err, res) => {
                    if(err) {
                        console.log(err);
                        return false;
                    }
                    console.log("Document updated");
                });
            });
            socket.on('typing', (data) => {
                socket.broadcast.in(data.room).emit('typing', {data: data, isTyping: true});
            });
        });
    
    }); 
}

module.exports = {chatApp}

