import io from "socket.io-client";
import { SERVER } from "./config";
import { useState, useEffect } from "react";

import './App.css'

const socket = io(SERVER);

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{
    body: "Escribe cualquier cosa para comenzar",
    from: "TestChat"
  }])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages])
  };

  useEffect(() => {
    const reciveMessage = (message) => {
      setMessages([ message, ...messages])
    };
    socket.on("message", reciveMessage);

    return () => {
      socket.off("message", reciveMessage);
    };
  }, [messages]);

  return (
    <div className="chat"> 
      <div className="chat-messages">
      {messages.map((message, index) => (
            <div key={index} className={`text ${message.from === "Me" ? "user-text" : "next-user"}`}>{message.from}: {message.body}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input">
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button className="chat-send">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default App;
