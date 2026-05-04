import React from 'react';
import { View, Text, useWindowDimensions, Image } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, SharedValue } from 'react-native-reanimated';
import { OnboardingItem } from '../../utils/onboardingData';
import { useTheme } from '../../hooks/useTheme';
import { PlaceholderImage } from '../../components/common/Placeholder';
import { SectionCard } from '../../components/ui/SectionCard';
import { styles } from './styles';

export const OnboardingItemComponent = ({
  item,
  index,
  scrollX,
}: {
  item: OnboardingItem;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [50, 0, -50], 'clamp');
    const opacity = interpolate(scrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 1, 0], 'clamp');
    return { transform: [{ translateY }], opacity };
  });

  return (
    <Animated.View style={[styles.itemContainer, { width }, animatedStyle]}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={{ width: width * 0.9, height: width * 0.9, resizeMode: 'contain' }} />
        ) : (
          <PlaceholderImage size={width * 0.55} />
        )}
      </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.colors.onSurface }]}>{item.description}</Text>
        </View>
    </Animated.View>
  );
};
