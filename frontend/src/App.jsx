import { useState,useEffect } from 'react'
import { io } from "socket.io-client";
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([

  ])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (inputText.trim() === '') return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    }

    setMessages(prevMessages => [...prevMessages, userMessage])
    
    socket.emit('ai-message', inputText)

    
    setInputText('')
    
  }



  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  useEffect(() => {
    let socketInstance = io("http://localhost:3000"); 
    setSocket(socketInstance)

    socketInstance.on('ai-message-response', (response) => {

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }

      setMessages(prevMessages => [...prevMessages, botMessage])
      
    })
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Interface</h1>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">
                <span className="message-text">{message.text}</span>
                <span className="message-timestamp">{message.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="input-field"
        />
        <button 
          onClick={handleSendMessage}
          className="send-button"
          disabled={inputText.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
