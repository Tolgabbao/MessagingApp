import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function GroupChatScreen({ route }) {
  const { groupId, groupName } = route.params;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.sub);
    } catch (err) {
      console.error('Error getting user ID:', err);
    }
  };

  const formatMessage = (msg) => {
    const isSelfMessage = msg.senderId === userId;
    const messageId = msg.id ? msg.id.toString() : generateTempId();
    
    return {
      _id: messageId,
      text: msg.content || '',
      createdAt: msg.timestamp?.$numberLong 
        ? new Date(parseInt(msg.timestamp.$numberLong))
        : msg.timestamp 
          ? new Date(msg.timestamp) 
          : new Date(),
      user: {
        _id: isSelfMessage ? userId : msg.senderId,
        name: isSelfMessage ? 'You' : msg.senderName || msg.senderId
      }
    };
  };

  const loadMessages = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/messages`);
      const formatted = res.data.map(formatMessage);
      setMessages(formatted.reverse());
    } catch (err) {
      console.error('Error loading group messages:', err);
      alert('Error loading messages: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSend = async (newMessages = []) => {
    if (!newMessages.length) return;
    
    const m = newMessages[0];
    try {
      const res = await api.post(`/groups/${groupId}/send`, {
        content: m.text,
        recipientId: groupId  // Add the required recipientId field
      });

      setMessages(GiftedChat.append(messages, formatMessage({
        ...res.data,
        senderId: userId,
        id: generateTempId()
      })));
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error sending message: ' + (err.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadMessages();
    }
  }, [userId]);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => handleSend(messages)}
      user={{ _id: userId || 'temp' }}
    />
  );
}
