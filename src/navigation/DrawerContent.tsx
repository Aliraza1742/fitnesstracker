import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LogOut, User } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <View style={[styles.header, { borderBottomColor: theme.colors.primaryDark }]}>
        <View
          style={[
            styles.userAvatar,
            { backgroundColor: theme.colors.primary + '20' },
          ]}
        >
          <Text
            style={[styles.avatarText, { color: theme.colors.primary }]}
          >
            {user?.firstName?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.userName,
              { color: theme.colors.onBackground },
            ]}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            style={[
              styles.userEmail,
              { color: theme.colors.grey500 },
            ]}
          >
            {user?.email}
          </Text>
        </View>
      </View>

      <DrawerItemList {...props} />

      <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: theme.colors.error + '10' },
        ]}
        onPress={handleLogout}
      >
        <LogOut
          size={24}
          color={theme.colors.error}
        />
        <Text style={[styles.logoutText, { color: theme.colors.error }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
