import React, { useState, useEffect, useRef } from "react";
import "./Channel.css";
import { removeName, formatTimestamp } from "../utils/utils";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const socket = io("http://localhost:5001");

//will make everything props once backend is good

//add MessageList when needed
//maybe update contactName to be the whole user object?

function Channel({ channel, user }) {
  //const [refreshMessages, setRefreshMessages] = useState(false);
  return (
    <>
      <div className="channel">
        <div className="channel-contents">
          <MessageList
            channel={channel}
            user={user}
            //refreshMessages={refreshMessages}
            //setRefreshMessages={setRefreshMessages}
          />
        </div>
      </div>
      <MessageInput
        channel={channel} /**setRefreshMessages={setRefreshMessages}**/
      />
    </>
  );
}

//name changed based on button click, and what name gets passed in
function ContactHeader({ name, user }) {
  return (
    <div className="contact-header">
      <img
        className="profile-pic-medium"
        src="/assets/default-profile-pic.webp"
      />
      <h2>{removeName(name, user.name)}</h2>
      <button className="view-profile-btn">
        <i className="fa-solid fa-user"></i>View Profile
      </button>
    </div>
  );
}

//again will do messaging in database once set up
function MessageList({ channel, user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    console.log("SCROLLED");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!channel) return;
    //console.log(channel._id);
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/message/${channel._id}`,
          // `https://poly-messages-avgzbvbybqg4hhha.westus3-01.azurewebsites.net/api/message/${channel._id}`, // Use channel.id dynamically
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        //console.log("Response data:", data); // Debugging output
        if(data.message == "Invalid token."){
          navigate("/")
        }

        if (response.ok) {
          setMessages(data.messages); // Assuming `data` is an array of messages
          //console.log("Fetched messages:", data.messages);
        } else {
          alert(data.message || "An error occurred while fetching messages.");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("An error occurred while fetching messages.");
      }
    };
    fetchMessages();

    // Join the channel's socket room
    socket.emit("joinChannel", channel._id);
    console.log(`Joined socket room for channel: ${channel._id}`);

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {

      console.log("New message received via socket:", newMessage);

      // Update the messages state with the new message
      fetchMessages();
    });

    // Cleanup when component unmounts or channel changes
    return () => {
      socket.emit("leaveChannel", channel._id);
      console.log(`Left socket room for channel: ${channel._id}`);
      socket.off("newMessage"); // Remove event listener
    };
  }, [channel._id]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //console.log(messages)
  const shouldShowTime = (prevTimestamp, currTimestamp) => {
    const date1 = new Date(prevTimestamp);
    const date2 = new Date(currTimestamp);
    return Math.abs(date1 - date2) / (1000 * 60 * 60) > 1;
  };

  return (
    <div>
      <ContactHeader name={channel.name} user={user} />
      <div className="message-list">
        {messages.map((message, index) => (
          // <MessageItem key={message.id} message={message} />
          <Message
            key={message._id}
            user={user}
            message={message}
            showName={
              index === 0 ||
              messages[index - 1].sender._id !== message.sender._id
            }
            showTime={
              index === 0 ||
              shouldShowTime(messages[index - 1]?.timestamp, message?.timestamp)
            }
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

function Message({ user, message, showName, showTime }) {
  //console.log(showTime);
  return (
    <>
      <p className="user-name">
        {showTime && formatTimestamp(message?.timestamp)}
      </p>
      <p
        className={`user-name ${message.sender._id === user._id ? "sent" : "received"}`}
      >
        {showName && message.sender.name}
      </p>
      <div
        className={`message ${message.sender._id === user._id ? "sent" : "received"}`}
      >
        <p>{message.contents}</p>
        {message.sender._id === user.id && (
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
    </>
  );
}

//console.log replace with whatever prop to display on the chat window
function MessageInput({ channel }) {
  const [text, setText] = useState("");
  const sendMessage = async () => {
    if (text.trim()) {
      const message = text;
      setText("");
      try {
        const response = await fetch(
          `http://localhost:5001/api/message/send`,
          // `https://poly-messages-avgzbvbybqg4hhha.westus3-01.azurewebsites.net/api/message/send`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              channelId: channel._id, // Pass the ID of the channel where the message is being sent
              contents: message, // The message content
            }),
          }
        );

        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
          // setRefreshMessages(true);
          //alert(data.message || "Message sent successfully!"); // Notify on success
        } else {
          alert(data.message || "Failed to send message."); // Handle server-side errors
        }
      } catch (error) {
        console.error("Error while sending message:", error);
        alert("An error occurred while sending the message.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call your function here
      sendMessage();
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
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Channel;
