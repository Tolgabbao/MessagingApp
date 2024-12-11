// src/screens/Friends/ChatScreen.js
import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import api from '../../services/api';

export default function ChatScreen({ route }) {
  const { friendId, friendName } = route.params;
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await api.get('/messages', { params: { friendId } });
      const formatted = res.data.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.senderId,
          name: msg.senderId === friendId ? friendName : 'You'
        }
      }));
      setMessages(formatted.reverse()); 
    } catch (err) {
      alert('Error loading messages: ' + err.message);
    }
  };

  const handleSend = async (newMessages = []) => {
    const m = newMessages[0];
    try {
      const res = await api.post('/messages/send', {
        recipientId: friendId,
        content: m.text
      });
      setMessages(GiftedChat.append(messages, {...m, _id: res.data.id}));
    } catch (err) {
      alert('Error sending message: ' + err.message);
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
        _id: 'currentUser', // replace with actual current user id fetched from token if needed
      }}
    />
  );
}
