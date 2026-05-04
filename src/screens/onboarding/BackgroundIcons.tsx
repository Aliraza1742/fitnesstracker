import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, DimensionValue } from 'react-native';
import { 
  Dumbbell, 
  Activity, 
  Heart, 
  Timer, 
  Flame, 
  Zap, 
  Trophy, 
  Target 
} from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface IconItemProps {
  Icon: any;
  top: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  size: number;
  rotation: string;
  color: string;
  opacity: number;
  delay: number;
}

const FloatingIcon: React.FC<IconItemProps> = ({ 
  Icon, 
  top, 
  left, 
  right, 
  size, 
  rotation, 
  color, 
  opacity,
  delay 
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { rotate: rotation }
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        {
          top,
          left,
          right,
          opacity,
        },
        animatedStyle,
      ]}
    >
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

export const BackgroundIcons: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  // Use a dark green color as requested
  const iconColor = theme.colors.primaryDark || '#0a5741ff'; // Default to a deep emerald green
  const iconOpacity = isDark ? 0.15 : 0.12;

  const icons = [
    { Icon: Dumbbell, top: '10%', left: '5%', size: 55, rotation: '15deg', delay: 0 },
    { Icon: Activity, top: '12%', right: '8%', size: 65, rotation: '-10deg', delay: 500 },
    { Icon: Heart, top: '42%', left: '10%', size: 50, rotation: '20deg', delay: 1000 },
    { Icon: Timer, top: '38%', right: '12%', size: 60, rotation: '-5deg', delay: 1500 },
    { Icon: Flame, top: '68%', left: '15%', size: 55, rotation: '-15deg', delay: 2000 },
    { Icon: Zap, top: '72%', right: '10%', size: 55, rotation: '10deg', delay: 2500 },
    { Icon: Trophy, top: '58%', right: '18%', size: 50, rotation: '5deg', delay: 3000 },
    { Icon: Target, top: '23%', left: '42%', size: 55, rotation: '-20deg', delay: 3500 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {icons.map((item, index) => (
        <FloatingIcon
          key={index}
          Icon={item.Icon}
          top={item.top as DimensionValue}
          left={item.left as DimensionValue}
          right={item.right as DimensionValue}
          size={item.size}
          rotation={item.rotation}
          color={iconColor}
          opacity={iconOpacity}
          delay={item.delay}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
  },
});
