import React, { useEffect, useState } from "react";
import formatTimestamp from "../utils/utils";
import "./Sidebar.css";

//will make everything props once backend is good
//also have to create the search bar

function Sidebar({ onSelectContact, onSelectSearch }) {
  return (
    <div className="sidebar">
      <h1>PolyMessages</h1>
      <button className="search-button" onClick={() => onSelectSearch()}>
        <i className="fa-solid fa-magnifying-glass"></i> Search
      </button>
      <ContactsList onSelectContact={onSelectContact} />
    </div>
  );
}

//will pass in contacts list through props from backend when it works
function ContactsList({ onSelectContact }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(
          `https://poly-messages-avgzbvbybqg4hhha.westus3-01.azurewebsites.net/api/channel/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        console.log("Response data:", data); // Debugging output

        if (response.ok) {
          const extractedData = data.cxus.map((item) => item.channel);
          console.log("Extracted data:", extractedData);
          setContacts(extractedData);
          //alert(data.message || "Channels fetched successfully!");
        } else {
          alert(data.message || "An error occurred."); // Corrected error message handling
        }
      } catch (error) {
        console.error("Error during fetch:", error); // More specific error output
        alert("An error occurred during channel fetch.");
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        /* Pass in user object for contact */
        <ContactItem
          key={contact._id}
          contact={contact}
          onSelectContact={onSelectContact}
        />
      ))}
    </div>
  );
}

function ContactItem({ contact, onSelectContact }) {
  return (
    <div
      className="contact-item"
      onClick={() => onSelectContact(contact)} // Pass contact name on click
    >
      <div className="contact-preview">
        {/* Get image from contact object when the actual schema is setup for it */}
        <img className="contact-pic" src="/assets/default-profile-pic.webp" />
        <div className="contact-details">
          <h3>{contact.name}</h3>
          <p>{contact.lastMessage}</p>
        </div>
      </div>

      {/* <p>{formatTimestamp(contact.lastTimestamp, true)}</p> */}
    </div>
  );
}

export default Sidebar;
