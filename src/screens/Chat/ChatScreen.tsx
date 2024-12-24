import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send, IMessage } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';
import { NavigationProps, Message, ApiResponse } from '../../types/global';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Chat: {
    friendId: string;
    friendName: string;
    friendEmail: string;
  };
};

interface ChatScreenProps extends NavigationProps {
  route: RouteProp<RootStackParamList, 'Chat'>;
}

interface UserDetails {
  name: string;
  id: string;
  email: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { friendId, friendName } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetailsVisible, setUserDetailsVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  const generateTempId = (): string => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.sub);
    } catch (err) {
      console.error('Error getting user ID:', err);
    }
  };

interface MessageInput {
    senderId: string;
    id?: string | number;
    content?: string;
    timestamp?: {
        $numberLong?: string;
    } | string | Date;
}

interface FormattedMessage {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
    };
}

const formatMessage = (msg: MessageInput): FormattedMessage => {
    const isSelfMessage = msg.senderId === userId;
    const messageId = msg.id ? msg.id.toString() : generateTempId();
    
    return {
        _id: messageId,
        text: msg.content || '',
        createdAt: msg.timestamp 
            ? typeof msg.timestamp === 'object' && '$numberLong' in msg.timestamp
                ? new Date(parseInt(msg.timestamp.$numberLong!))
                : msg.timestamp instanceof Date
                    ? msg.timestamp
                    : new Date(msg.timestamp as string)
            : new Date(),
        user: {
            _id: isSelfMessage ? userId : msg.senderId,
            name: isSelfMessage ? 'You' : friendName
        }
    };
};

  const loadMessages = async () => {
    try {
      const res = await api.get<ApiResponse<Message[]>>('/messages', { 
        params: { friendId } 
      });
      
      // Debug log
      console.log('Messages response:', JSON.stringify(res.data, null, 2));

      if (!res.data?.data) {
        console.error('Invalid response structure:', res.data);
        return;
      }

      const formatted = res.data.data.map(formatMessage);
      setMessages(formatted.reverse());
    } catch (err: unknown) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSend = async (newMessages: IMessage[] = []): Promise<void> => {
    if (!newMessages.length) return;
    
    const m = newMessages[0];
    try {
      const res = await api.post<ApiResponse<Message>>('/messages/send', {
        recipientId: friendId,
        content: m.text
      });

      if (userId) {
        setMessages(prevMessages => 
          GiftedChat.append(prevMessages, [formatMessage({
            ...res.data.data,
            senderId: userId,
            id: generateTempId()
          })])
        );
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
      getUserId();
    }, []);
  
    useEffect(() => {
      if (userId) {
        // Initial load
        loadMessages();
        
        // Set up polling every 3 seconds
        const pollInterval = setInterval(loadMessages, 3000);
        
        // Cleanup on unmount
        return () => clearInterval(pollInterval);
      }
    }, [userId]);
  
    interface MessageContextData {
        actionSheet: () => void;
    }

    const handleBubblePress = (context: MessageContextData, message: IMessage): void => {
        // Only show details for friend's messages
        if (message.user._id !== userId) {
            setSelectedUser({
                name: friendName,
                id: friendId,
                email: route.params.friendEmail // Make sure to pass this in navigation params
            });
            setUserDetailsVisible(true);
        }
    };

  // Add types to render functions
  const renderBubble = (props: any) => (
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

interface InputToolbarProps {
    containerStyle?: any;
    primaryStyle?: any;
}

const renderInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputToolbarPrimary}
    />
);

interface ComposerProps {
    textInputStyle?: any;
    placeholderTextColor?: string;
    multiline?: boolean;
}

const renderComposer = (props: ComposerProps) => (
    <Composer
        {...props}
        textInputStyle={styles.composer}
        placeholderTextColor={colors.mediumGray}
        multiline={true}
    />
);

interface SendProps {
    text?: string;
    containerStyle?: any;
    children?: React.ReactNode;
}

interface RenderSendProps extends SendProps {
    text?: string;
}

const renderSend = (props: RenderSendProps) => (
    <Send {...props} containerStyle={styles.sendContainer}>
        <View style={[
            styles.sendButton,
            !props.text && styles.sendButtonDisabled
        ]}>
            <Ionicons 
                name="send" 
                size={20} 
                color={props.text ? colors.white : colors.mediumGray} 
            />
        </View>
    </Send>
);

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
          <Text style={styles.headerText}>{friendName}</Text>
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
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setUserDetailsVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.userDetailsHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>
                    {selectedUser?.name?.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.userName}>{selectedUser?.name}</Text>
                <Text style={styles.userEmail}>{selectedUser?.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    borderTopColor: colors.lightGray,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '80%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  userDetailsHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    ...typography.header,
    color: colors.white,
    fontSize: 24,
  },
  userName: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.caption,
    color: colors.darkGray,
  },
});

export default ChatScreen;
