import { useEffect, useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { useWorkout } from '../../hooks/useWorkout';
import * as ImagePicker from 'react-native-image-picker';
import { User } from '../../types/auth';
import { customAlert } from '../../utils/alert';


export const useProfileScreen = () => {
  const { user, updateUser, logout } = useAuth();
  const { getStatistics } = useWorkout();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const statistics = await getStatistics();
    setStats(statistics);
  };

  const handleUpdateProfile = async (userData: Partial<User>) => {
    setUpdating(true);
    try {
      await updateUser(userData);
      setEditModalVisible(false);
      customAlert('Success', 'Profile updated successfully!');
    } catch (error) {
      customAlert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        // Update user on server & context
        await updateUser({ avatarUrl: imageUri }); // make sure User type has avatarUrl

        customAlert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      customAlert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLogout = () => {
    customAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return {
    user,
    stats,
    editModalVisible,
    setEditModalVisible,
    updating,
    handleUpdateProfile,
    handleImagePick,
    handleLogout,
  };
};
