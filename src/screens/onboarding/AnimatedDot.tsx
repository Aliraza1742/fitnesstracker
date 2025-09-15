import React from 'react';
import Animated, { useAnimatedStyle, interpolate, SharedValue } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export const AnimatedDot = React.memo(
  ({ index, currentIndex }: { index: number; currentIndex: SharedValue<number> }) => {
    const { theme } = useTheme();

    const animatedStyle = useAnimatedStyle(() => {
      const width = interpolate(currentIndex.value, [index - 1, index, index + 1], [8, 24, 8], 'clamp');
      const opacity = interpolate(currentIndex.value, [index - 1, index, index + 1], [0.4, 1, 0.4], 'clamp');
      return { width, opacity };
    });

    return (
      <Animated.View
        style={[
          {
            height: 8,
            borderRadius: 4,
            borderWidth:1.2,
            borderColor: theme.colors.black,
            backgroundColor: theme.colors.primaryDark,
            marginHorizontal: 4,
          },
          animatedStyle,
        ]}
      />
    );
  }
);
