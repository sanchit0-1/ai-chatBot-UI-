require('dotenv').config()
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateRespose = require('./src/services/ai.service')


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Adjust 
    }
});




const chatHistory = []
io.on("connection", (socket) => {
    console.log("server is started !");

    socket.on('disconnect', ()=>{
        console.log("disconnected")
    })

    socket.on('ai-message',async (data)=>{
        console.log('your question: ', data);
        chatHistory.push({
            role: "user",
            parts: [{text: data}]
        })
        const mama = await generateRespose(chatHistory);
        chatHistory.push({
            role: "model",
            parts: [{text: mama}]
        })
        
        socket.emit('ai-response',mama)
    })


});

httpServer.listen(3000);