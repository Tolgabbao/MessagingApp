// src/screens/Groups/GroupChatScreen.js
import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import api from '../../services/api';

export default function GroupChatScreen({ route }) {
  const { groupId, groupName } = route.params;
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/messages`);
      const formatted = res.data.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.senderId,
          name: msg.senderId // or fetch user names if available
        }
      }));
      setMessages(formatted.reverse()); 
    } catch (err) {
      alert('Error loading group messages: ' + err.message);
    }
  };

  const handleSend = async (newMessages = []) => {
    const m = newMessages[0];
    try {
      await api.post(`/groups/${groupId}/send`, { content: m.text });
      // On success, append the message
      setMessages(GiftedChat.append(messages, { ...m, _id: Math.random().toString() }));
    } catch (err) {
      alert('Error sending group message: ' + err.message);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => handleSend(messages)}
      user={{
        _id: 'currentUser', // replace with actual user
      }}
    />
  );
}
