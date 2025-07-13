import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    //Send api request to bot
    const res = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: newUserMessage.text })
    });

    const AIresponse = await res.json();
    console.log(AIresponse)
    const newBotMessage = {
      id: messages.length + 1,
      text: AIresponse.answer,
      sender: 'bot'
    }

    setMessages(prev => [...prev, newBotMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  /** this will point to an invisible <div/> after the last message */
  const endOfMessagesRef = useRef(null);

  /* whenever messages change, scroll the dummy div into view */
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!isOpen ? (
        <motion.div
          className="chat-bot-button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="chat-icon">💬</div>
          <span>TransitBot</span>
        </motion.div>
      ) : (
        <motion.div
          className="chat-bot-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="chat-header">
            <h3>Saarthi</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <motion.div
                key={message.id}
                className={`message ${message.sender}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.text}
              </motion.div>
            ))}
            {/* 👇 dummy div marks the end of the scroll area */}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about routes, fares, or alerts..."
            />
            <button onClick={handleSendMessage}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ➤
              </motion.div>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ChatBot;