import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Modal } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';

export default function GroupChatScreen({ route, navigation }) {
  const { groupId, groupName, groupDetails } = route.params;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userDetailsVisible, setUserDetailsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    
    // Find the member from groupDetails to get their name
    const member = groupDetails.members.find(m => m.userId === msg.senderId);
    const senderName = member 
      ? `${member.firstName} ${member.lastName}`
      : msg.senderName || 'Unknown User';
    
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
        name: isSelfMessage ? 'You' : senderName
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

  const handleBubblePress = (context, message) => {
    if (message.user._id !== userId) {
      // Find member from the existing group details
      const member = groupDetails.members.find(m => m.userId === message.user._id);
      if (member) {
        setSelectedUser({
          name: `${member.firstName} ${member.lastName}`,
          id: member.userId,
          email: member.email,
          isAdmin: groupDetails.adminName === `${member.firstName} ${member.lastName}`
        });
        setUserDetailsVisible(true);
      }
    }
  };

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.bubbleRight,
        left: styles.bubbleLeft,
      }}
      textStyle={{
        right: styles.bubbleTextRight,
        left: styles.bubbleTextLeft,
      }}
      onPress={() => handleBubblePress(props, props.currentMessage)}
    />
  );

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputToolbarPrimary}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composer}
        placeholderTextColor={colors['heasy-gray']}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}
        disabled={!props.text}
      >
        <View style={[
          styles.sendButton,
          !props.text && styles.sendButtonDisabled
        ]}>
          <Ionicons name="send" size={16} color={colors.white} />
        </View>
      </Send>
    );
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{groupName}</Text>
        </View>

        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={messages => handleSend(messages)}
            user={{ _id: userId || 'temp' }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            alwaysShowSend
            scrollToBottom
            infiniteScroll
            maxComposerHeight={100}
            placeholder="Type a message..."
            timeTextStyle={{
              right: styles.timeTextRight,
              left: styles.timeTextLeft,
            }}
          />
        </View>

        <Modal
          visible={userDetailsVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setUserDetailsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.userDetailsHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>
                    {selectedUser?.name?.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.userName}>
                  {selectedUser?.name}
                  {selectedUser?.isAdmin && (
                    <Text style={styles.adminBadge}> (Admin)</Text>
                  )}
                </Text>
                <Text style={styles.userEmail}>{selectedUser?.email}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setUserDetailsVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    ...typography.header,
    color: colors.white,
    flex: 1,
  },
  bubbleRight: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 2,
    marginVertical: 2,
  },
  bubbleLeft: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 2,
    marginVertical: 2,
  },
  bubbleTextRight: {
    color: colors.white,
  },
  bubbleTextLeft: {
    color: colors.black,
  },
  timeTextRight: {
    color: colors.white,
    opacity: 0.7,
  },
  timeTextLeft: {
    color: colors.darkGray,
  },
  inputToolbar: {
    backgroundColor: colors.white,
    borderTopColor: colors.mediumGray,
    borderTopWidth: 1,
  },
  inputToolbarPrimary: {
    alignItems: 'center',
  },
  composer: {
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    color: colors.black,
    maxHeight: 100,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  adminBadge: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: 'normal',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    minHeight: 200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userDetailsHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
  },
  closeButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    ...typography.body,
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    ...typography.caption,
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
  },
  adminBadge: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '500',
  },
});
