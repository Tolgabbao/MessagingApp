import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string | { $numberLong: string };
  senderName?: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  createdAt: string | number;
  updatedAt: string | number;
  createdBy?: string;
  members?: User[];
}

export interface GroupDetails {
  adminName: string;
  group: Group;
  members: User[];
}

export interface FriendRequest extends User {
  isSent?: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  FriendsList: undefined;
  AddFriend: undefined;
  Chat: { 
    friendId: string;
    friendName: string;
    friendEmail: string;
  };
  GroupList: undefined;
  CreateGroup: undefined;
  GroupDetail: {
    groupId: string;
    groupDetails: GroupDetails;
  };
  GroupChat: {
    groupId: string;
    groupName: string;
    groupDetails: GroupDetails;
  };
  PendingRequests: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

export type RoutePropType<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

export interface NavigationProps {
  navigation: NavigationProp<keyof RootStackParamList>;
  route?: RoutePropType<keyof RootStackParamList>;
}

export interface Theme {
  colors: typeof import('../theme').colors;
  typography: typeof import('../theme').typography;
  layouts: typeof import('../theme').layouts;
}

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface StyledComponentProps {
  style?: any;
  children?: React.ReactNode;
}