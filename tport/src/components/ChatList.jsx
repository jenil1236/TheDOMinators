// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './ChatList.css';

// const ChatList = ({ setCurrentChat }) => {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/chats/my-chats', {
//           withCredentials: true
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, []);

//   const handleChatClick = (chatId) => {
//     navigate(`/chats/${chatId}`);
//   };

//   if (loading) return <div className="loading">Loading chats...</div>;

//   return (
//     <div className="chat-list-container">
//       <h2>Your Chats</h2>
//       {chats.length === 0 ? (
//         <p className="no-chats">No chats yet. Start a conversation after a ride!</p>
//       ) : (
//         <ul className="chat-list">
//           {chats.map(chat => (
//             <li 
//               key={chat._id} 
//               className="chat-item"
//               onClick={() => handleChatClick(chat._id)}
//             >
//               <div className="chat-header">
//                 <h3>{chat.participants.join(', ')}</h3>
//                 <span className="last-message-time">
//                   {chat.messages[0]?.timestamp || ''}
//                 </span>
//               </div>
//               <p className="last-message">
//                 {chat.messages[0]?.text || 'No messages yet'}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ChatList;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatList.css';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { chatId: currentChatId } = useParams();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats/my-chats', {
          withCredentials: true
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  if (loading) return <div className="loading">Loading chats...</div>;

  return (
    <div className="chat-list-container">
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p className="no-chats">No chats yet. Start a conversation after a ride!</p>
      ) : (
        <ul className="chat-list">
          {chats.map(chat => (
            <li 
              key={chat._id} 
              className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
              onClick={() => handleChatClick(chat._id)}
            >
              <div className="chat-header">
                <h3>{chat.participants.join(', ')}</h3>
                <span className="last-message-time">
                  {chat.messages[0]?.timestamp || ''}
                </span>
              </div>
              <p className="last-message">
                {chat.messages[0]?.text || 'No messages yet'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;