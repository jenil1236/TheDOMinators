

// import React from 'react';
// import { Routes, Route, useParams } from 'react-router-dom';
// import ChatList from '../components/ChatList';
// import ChatWindow from '../components/ChatWindow';
// import './GetYourChats.css';

// const GetYourChats = () => {
//   return (
//     <div className="chats-page">
//       <ChatList />
//       <Routes>
        
//         <Route path="/:chatId" element={<ChatWindowWrapper />} />
//       </Routes>

//     </div>
//   );
// };

// const ChatWindowWrapper = () => {
//   const { chatId } = useParams();
//   return <ChatWindow chatId={chatId} />;
// };

// export default GetYourChats;

import React from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import './GetYourChats.css';

const GetYourChats = () => {
  const location = useLocation();
  const isChatOpen = location.pathname !== '/chats';

  return (
    <div className={`chats-page ${isChatOpen ? 'chat-open' : ''}`}>
      <ChatList />
      <Routes>
        <Route path="/:chatId" element={<ChatWindowWrapper />} />
      </Routes>
    </div>
  );
};

const ChatWindowWrapper = () => {
  const { chatId } = useParams();
  return <ChatWindow chatId={chatId} />;
};

export default GetYourChats;