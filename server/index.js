const express = require('express')
const app = express()
const http =  require('http').Server(app);
const path = require('path')
const io = require('socket.io')(http)

const uri = process.env.MONGODB_URI
const port = process.env.PORT || 5000

const Message = require('./Message')
const mongoose = require('mongoose')

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

io.on('connection', (socket) => {
    // get the last 10 messages from db
    Message.find().sort({createdAt: -1}).limit(10).exec((err,messages) => {
        if (err) return console.error(err)
        // send messages to user
        socket.emit('init', messages)
    })

    //listen to connected users for a new message
    socket.on('message', (msg) => {
        //create msg with posted content
        const message = new Message({
            text: msg.content,
            name: msg.name,
        })
        // save to db
        message.save((err) => {
            if (err) return console.error(err)
        })

        socket.broadcast.emit('push', msg)
    })
})

http.listen(port, () => {
    console.log('listening on *:' + port)
})
