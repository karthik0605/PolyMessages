import React, { useState } from "react";
import "./Channel.css";

//will make everything props once backend is good

//add MessageList when needed
//maybe update contactName to be the whole user object?
function Channel({ user, contactName }) {
  return (
    <>
      <div className="channel">
        <div className="channel-contents">
          <ContactHeader name={contactName} />
          <MessageList user={user} />
        </div>
      </div>
      <MessageInput />
    </>
  );
}

//name changed based on button click, and what name gets passed in
function ContactHeader({ name }) {
  return (
    <div className="contact-header">
      <img
        className="profile-pic-medium"
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      />
      <h2>{name}</h2>
      <button className="view-profile-btn">
        <i className="fa-solid fa-user"></i>View Profile
      </button>
    </div>
  );
}

//again will do messaging in database once set up
function MessageList({ user }) {
  const messages = [
    {
      id: 1,
      timestamp: new Date(),
      sender: "John",
      contents: "A short message.",
    },
    {
      id: 2,
      timestamp: new Date(),
      sender: "John",
      contents:
        "A long message, from the sender. The max width should cause the message to wrap at some point.",
    },
    {
      id: 3,
      timestamp: new Date(),
      sender: "Alec",
      contents: "A short message, from the receiver.",
    },
    {
      id: 4,
      timestamp: new Date(),
      sender: "John",
      contents: "A short message, switching back to the sender.",
    },
    {
      id: 5,
      timestamp: new Date(),
      sender: "John",
      contents:
        "A long message. There should be extra spacing when switching between the sender and the receiver.",
    },
    {
      id: 6,
      timestamp: new Date(),
      sender: "Alec",
      contents:
        "A long message, from the receiver. A timestamp should appear under the last sent message in the thread.",
    },
    {
      id: 7,
      timestamp: new Date(),
      sender: "Alec",
      contents:
        "A long message. The area where messages and the contact header are stored should be contained within its own scrollable area, keeping the input at the bottom of the page. The last message should be shown when the channel is open, so that area should be scrolled all the way to the bottom by default.",
    },
    {
      id: 8,
      timestamp: new Date(),
      sender: "John",
      contents:
        "A long message. If the plan was to still lazy load in message as they come then you'd need to come up with some clever way to load in the contact header at the top once you reach it, meaning once there are no more messages to load. Otherwise I guess just assume that it won't be a problem. ChatGPT loads in all messages at once and it isn't that much of a problem.",
    },
  ];

  return (
    <div className="message-list">
      {messages.map((message) => (
        /*
        prevDate = message.timestamp
        if date was over a day ago
          <timestamp component />
        */
        /* <Message key={message.id} user={user} message={message} */
        <Message key={message.id} user={"John"} message={message} />
      ))}
    </div>
  );
}

function Message({ user, message }) {
  const [showTimestamp, setShowTimestamp] = useState(false);

  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp);
  };

  return (
    <>
      {/* div: className={`message ${message.sender === user._id ? "sent" : "received"}`} */}
      <div
        className={`message ${message.sender === user ? "sent" : "received"}`}
      >
        <p onClick={toggleTimestamp}>{message.contents}</p>
        {message.sender === user && (
          <div className="message-actions">
            <button className="edit-btn">
              <i className="fa-solid fa-pen"></i>
            </button>
            <button className="delete-btn">
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>
      {showTimestamp && (
        <p
          className={`message-timestamp ${message.sender === user ? "sent" : "received"}`}
        >
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      )}
    </>
  );
}

//console.log replace with whatever prop to display on the chat window
function MessageInput(props) {
  const [text, setText] = useState("");
  const sendMessage = () => {
    if (text.trim()) {
      console.log(text);
      setText("");
    }
  };

  return (
    <div className="message-input">
      <div className="message-input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
        />
        <button onClick={sendMessage}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Channel;
