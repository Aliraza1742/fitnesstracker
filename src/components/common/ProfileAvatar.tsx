import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ProfileAvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
  editable?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  name = 'User',
  size = 100,
  onPress,
  editable = false,
}) => {
  const { theme } = useTheme();
  
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (initials: string) => {
    const colors = [
      theme.colors.primary,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.info,
      '#8B5CF6', // Purple
      '#EC4899', // Pink
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(initials);

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={[styles.container, { width: size, height: size }]}>
        {uri ? (
<Image
  source={{ uri: `${uri}?${Date.now()}` }}
  style={[
    styles.image,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
  ]}
/>

        ) : (
          <View
            style={[
              styles.initialsContainer,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.initials,
                {
                  fontSize: size * 0.35,
                  color: theme.colors.white,
                },
              ]}
            >
              {initials}
            </Text>
          </View>
        )}
        
        {editable && (
          <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.editText, { color: theme.colors.white }]}>✏️</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  editText: {
    fontSize: 14,
  },
});