import React, { useState, useEffect } from 'react';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [usernameError, setUsernameError] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [isUsernameSet, setIsUsernameSet] = useState(false); 

    useEffect(() => {
      const newSocket = new WebSocket('ws://localhost:5000');
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log('Connected to WebSocket server');
        setConnectionError(false);
      };

      newSocket.onmessage = (event) => {
        const newMessage = event.data;
        if (typeof newMessage === 'string') {
          setChatMessages((prevMessages) => [...prevMessages, { text: newMessage, sent: false }]);
        } else if (newMessage instanceof Blob) {
          const reader = new FileReader();
          reader.onload = function () {
            const text = reader.result;
            setChatMessages((prevMessages) => [...prevMessages, { text, sent: false }]);
          };
          reader.readAsText(newMessage);
        }
      };

      newSocket.onclose = (event) => {
        if (!event.wasClean) {
          console.error('Connection died');
          setConnectionError(true);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error.message);
        setConnectionError(true);
      };

      return () => {
        newSocket.close();
      };
    }, []);

    const handleSetUsername = () => {
      if (!username.trim()) {
        setUsernameError(true);
      } else {
        setUsernameError(false);
        setUsername(username.trim());
        setIsUsernameSet(true); // Set the state to true when username is set
      }
    };

    const handleSendMessage = () => {
      if (message.trim() !== '') {
        const newMessage = { text: message, sent: true };
        socket.send(username + ': ' + message);
        setChatMessages([...chatMessages, newMessage]);
        setMessage('');
      }
    };

    return (
      <div className="App">
        {!isUsernameSet ? (
          <div id="username-container">
            <h1>Enter Your Username</h1>
            <input
              type="text"
              id="username-input"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSetUsername}>Set Username</button>
            {usernameError && <p id="username-error" style={{ color: 'red' }}>Please enter a valid username.</p>}
          </div>
        ) : (
          <div id="container">
            <h1>WebSocket Chat</h1>
            <div id="chat-box">
              {chatMessages.map((msg, index) => (
                <div
                 key={index}
                 className={msg.sent ? 'message sent' : 'message received'}
                >
                 {msg.text}
                </div>
              ))}
            </div>
            <div id="input-container">
              <input
                type="text"
                id="message"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button id="send-button" onClick={handleSendMessage}>Send</button>
            </div>
            {connectionError && <div id="connection-error" style={{ color: 'red' }}>Connection to the web server was lost. Please try again later.</div>}
          </div>
        )}
      </div>
    );
}

export default Chat;