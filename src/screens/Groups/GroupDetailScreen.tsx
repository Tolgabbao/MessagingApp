import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import api from '../../services/api';
import { colors, typography, layouts } from '../../theme';
import BackgroundLayout from '../../components/BackgroundLayout';
import { NavigationProps, GroupDetails, ApiResponse, RootStackParamList } from '../../types/global';

interface GroupDetailScreenProps extends NavigationProps {
  route: RouteProp<RootStackParamList, 'GroupDetail'>;
}

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({ route, navigation }) => {
  const { groupDetails } = route.params;

  console.log('GroupDetail params:', route.params);

  const handleOpenChat = () => {
    navigation.navigate('GroupChat', {
      groupId: groupDetails.group.groupId,
      groupName: groupDetails.group.groupName,
      groupDetails: groupDetails
    });
  };

  if (!groupDetails) {
    return (
      <BackgroundLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </BackgroundLayout>
    );
  }

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
          <Text style={styles.headerText}>{groupDetails.group.groupName}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Created: {new Date(groupDetails.group.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.adminText}>Admin: {groupDetails.adminName}</Text>
        </View>
        
        <Text style={styles.membersHeader}>
          Members ({groupDetails.members.length}):
        </Text>
        
        <FlatList 
          data={groupDetails.members}
          keyExtractor={(item) => item.userId}
          renderItem={({item}) => (
            <View style={styles.memberItem}>
              <Text style={styles.memberText}>
                {`${item.firstName} ${item.lastName}`}
              </Text>
              <Text style={styles.emailText}>{item.email}</Text>
            </View>
          )}
        />
        
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleOpenChat}
        >
          <Ionicons name="chatbubbles" size={24} color={colors.white} />
          <Text style={styles.buttonText}>Open Group Chat</Text>
        </TouchableOpacity>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layouts.contentContainer,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    ...typography.header,
    color: colors.white,
    flex: 1,
  },
  infoSection: {
    padding: 16,
    backgroundColor: colors.lightGray,
  },
  infoText: {
    ...typography.body,
    color: colors.darkGray,
    marginBottom: 4,
  },
  adminText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: 'bold',
    marginTop: 8,
  },
  membersHeader: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
    padding: 16,
    backgroundColor: colors.white,
  },
  memberItem: {
    ...layouts.listItem,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  memberText: {
    ...typography.body,
    color: colors.black,
  },
  emailText: {
    ...typography.caption,
    color: colors.mediumGray,
  },
  chatButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  errorContainer: {
    ...layouts.errorContainer,
    margin: 16,
  },
  errorText: {
    color: colors.white,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.mediumGray,
  },
});


export default GroupDetailScreen;
