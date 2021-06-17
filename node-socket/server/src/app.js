const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
  });
const documents = {};

app.use(cors());

io.on("connection", socket => {
    let previousId;

    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`))
        previousId = currentId;
    };

    socket.on("getDoc", docId => {
        safeJoin(docId)
        socket.emit('document', documents[docId])
    })

    socket.on('addDoc', doc => {
        console.log('doc');
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit('document', doc)
    });

    socket.on('editDoc', doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit('document', doc);
    });

    io.on('connection', socket => {      
        console.log('doccy', documents)
        console.log('documents', Object.keys(documents));
        io.emit('documents', Object.keys(documents));
        console.log(`Socket ${socket.id} has connected`);
    });
})

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
