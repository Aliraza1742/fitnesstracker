import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ProfileAvatar } from '../../components/common/ProfileAvatar';
import { InfoCard } from '../../components/profile/InfoCard';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { AuthButton } from '../../components/common/AuthButton';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';
import { useProfileScreen } from './useProfile';

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
    user,
    stats,
    editModalVisible,
    setEditModalVisible,
    updating,
    handleUpdateProfile,
    handleImagePick,
    handleLogout,
  } = useProfileScreen();

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Please log in</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradients.primary} style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <ProfileAvatar
            name={`${user.firstName} ${user.lastName}`}
            size={120}
            onPress={handleImagePick}
            editable
          />
          <Text style={[styles.userName, { color: theme.colors.onBackground }]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.onSurface }]}>{user.email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Personal Information</Text>
          <InfoCard icon="👤" title="Full Name" value={`${user.firstName} ${user.lastName}`} />
          <InfoCard icon="📧" title="Email" value={user.email} />
          <InfoCard icon="🎯" title="Fitness Goal" value={user.fitnessGoal || 'Not set'} />
        </View>

        {/* Body Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Body Metrics</Text>
          <InfoCard icon="⚖️" title="Weight" value={user.weight ? `${user.weight} kg` : 'Not set'} />
          <InfoCard icon="📏" title="Height" value={user.height ? `${user.height} cm` : 'Not set'} />
          <InfoCard icon="🎂" title="Age" value={user.age ? `${user.age} years` : 'Not set'} />
        </View>

        {/* Fitness Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Fitness Statistics</Text>
          <InfoCard icon="🏋️‍♂️" title="Total Workouts" value={stats.totalWorkouts.toString()} />
          <InfoCard icon="🔥" title="Calories Burned" value={stats.totalCalories.toString()} />
          <InfoCard icon="⏱️" title="Total Duration" value={`${Math.round(stats.totalDuration / 60)} hours`} />
        </View>

        {/* Actions */}
        <AuthButton
          title="Edit Profile"
          onPress={() => setEditModalVisible(true)}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
          borderColor={theme.colors.info}
        />
        <AuthButton
          title="Logout"
          onPress={handleLogout}
          backgroundColor={theme.colors.error}
          textColor={theme.colors.white}
          borderColor={theme.colors.white}
        />

        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSubmit={handleUpdateProfile}
          user={user}
          loading={updating}
        />
      </ScrollView>
    </LinearGradient>
  );
};
