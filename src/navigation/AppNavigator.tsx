import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { RootStackParamList } from '../types/global';

// Import screens directly
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FriendsListScreen from '../screens/Friends/FriendListScreen';
import AddFriendScreen from '../screens/Friends/AddFriendScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import GroupListScreen from '../screens/Groups/GroupListScreen';
import CreateGroupScreen from '../screens/Groups/CreateGroupScreen';
import GroupDetailScreen from '../screens/Groups/GroupDetailScreen';
import GroupChatScreen from '../screens/Chat/GroupChatScreen';
import PendingFriendRequestsScreen from '../screens/Friends/PendingFriendRequestsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenConfigType = {
  [K in keyof RootStackParamList]: React.ComponentType<any>;
};

const screens: ScreenConfigType = {
  Login: LoginScreen,
  Register: RegisterScreen,
  Home: HomeScreen,
  FriendsList: FriendsListScreen,
  AddFriend: AddFriendScreen,
  Chat: ChatScreen,
  GroupList: GroupListScreen,
  CreateGroup: CreateGroupScreen,
  GroupDetail: GroupDetailScreen,
  GroupChat: GroupChatScreen,
  PendingRequests: PendingFriendRequestsScreen,
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {(Object.keys(screens) as Array<keyof RootStackParamList>).map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            component={screens[name]}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
