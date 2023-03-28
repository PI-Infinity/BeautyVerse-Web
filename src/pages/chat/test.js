// import React, { useState, useEffect, useRef } from 'react';
// import socketIOClient from 'socket.io-client';
// import { useSelector, useDispatch } from 'react-redux';

// const SOCKET_SERVER = 'http://localhost:5000';

// function TestChat() {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [room, setRoom] = useState('General');
//   const messagesEndRef = useRef(null);
//   const currentuser = useSelector((state) => state.storeMain.user);
//   useEffect(() => {
//     const socketConnection = socketIOClient(SOCKET_SERVER);
//     setSocket(socketConnection);

//     socketConnection.on('init', (data) => {
//       setMessages(data);
//     });

//     socketConnection.on('message', (message) => {
//       console.log(message);
//       setMessages((messages) => [...messages, message]);
//     });

//     socketConnection.on('connect', () => {
//       socketConnection.emit('join', { room: room });
//     });

//     return () => {
//       socketConnection.disconnect();
//     };
//   }, [room, SOCKET_SERVER]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (input.trim() === '') {
//       return;
//     }

//     const message = {
//       username: currentuser._id,
//       content: input,
//       sentAt: new Date(),
//       room,
//     };

//     setInput('');
//     socket?.emit('message', message);
//   };

//   const handleRoomChange = (e) => {
//     setRoom(e.target.value);
//     console.log(e.target.value);
//     socket?.emit('join', { room: e.target.value });
//   };

//   return (
//     <div className="TestChat">
//       <div className="chat">
//         {messages.map((message, i) => (
//           <div key={i} style={{ color: '#fff' }}>
//             <strong>{message.username}</strong> {message.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef}></div>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button type="submit">Send</button>
//       </form>
//       <div>
//         <select value={room} onChange={handleRoomChange}>
//           <option value="General">General</option>
//           <option value="Room1">Room 1</option>
//           <option value="Room2">Room 2</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// export default TestChat;
