// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { io } from 'socket.io-client';
// import './ChatWindow.css';

// const ChatWindow = ({ chatId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/chats/${chatId}/messages`,
//           { withCredentials: true }
//         );
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();

//     // Initialize Socket.IO
//     const newSocket = io('http://localhost:5000', {
//       withCredentials: true
//     });
//     setSocket(newSocket);

//     newSocket.emit('joinRoom', { chatId });

//     newSocket.on('newMessage', (message) => {
//       setMessages(prev => [...prev, {
//         text: message.text,
//         username: message.sender.user.username,
//         timestamp: new Date(message.createdAt).toLocaleTimeString()
//       }]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [chatId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/chats/send',
//         { chatId, text: newMessage },
//         { withCredentials: true }
//       );

//       // The socket.io event will handle adding the message to the state
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   if (loading) return <div className="loading">Loading messages...</div>;

//   return (
//     <div className="chat-window">
//       <div className="messages-container">
//         {messages.length === 0 ? (
//           <p className="no-messages">No messages yet. Start the conversation!</p>
//         ) : (
//           messages.map((message, index) => (
//             <div 
//               key={index} 
//               className={`message ${message.username === 'driver' ? 'sent' : 'received'}`}
//             >
//               <div className="message-header">
//                 <span className="sender">{message.username}</span>
//                 <span className="timestamp">{message.timestamp}</span>
//               </div>
//               <p className="message-text">{message.text}</p>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="message-input">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './ChatWindow.css';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join room and setup listeners when chatId or socket changes
  useEffect(() => {
    if (!socket) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chats/${chatId}/messages`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    socket.emit('joinRoom', { chatId });
    fetchMessages();

    // Setup message listener
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, {
        text: message.text,
        username: message.sender.user.username,
        timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [chatId, socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chats/send',
        { chatId, text: newMessage },
        { withCredentials: true }
      );

     
      
      setNewMessage('');
      
      // Socket will handle the actual update from the server
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback optimistic update if needed
    }
  };

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.username === 'You' || message.username === 'driver' ? 'sent' : 'received'}`}
            >
              <div className="message-header">
                <span className="sender">{message.username}</span>
                <span className="timestamp">{message.timestamp}</span>
              </div>
              <p className="message-text">{message.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;