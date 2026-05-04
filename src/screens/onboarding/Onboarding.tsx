import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedRef,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/types';
import { onboardingData } from '../../utils/onboardingData';
import { useTheme } from '../../hooks/useTheme';
import { AnimatedDot } from './AnimatedDot';
import { OnboardingItemComponent } from './OnboardingItem';
import { BackgroundIcons } from './BackgroundIcons';
import { styles } from './styles';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Onboarding'
>;

export const OnboardingScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      const newIndex = Math.round(event.contentOffset.x / width);
      runOnJS(setCurrentIndex)(newIndex);
    },
  });

  const currentIndexValue = useDerivedValue(() =>
    Math.round(scrollX.value / width),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        const nextIndex = currentIndex + 1;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      } else {
        // Optional: loop back to start or just stay at the end
        scrollRef.current?.scrollTo({ x: 0, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, width]);

  const handleNext = () => navigation.navigate('Login');
  const handleSkip = () => navigation.navigate('Login');

  return (
    <LinearGradient
      colors={theme.colors.gradients.background} 
      style={styles.container}
    >
      <BackgroundIcons />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Scrollable Slides */}
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Disable manual swiping
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <OnboardingItemComponent
            key={item.id}
            item={item}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <AnimatedDot
            key={index}
            index={index}
            currentIndex={currentIndexValue}
          />
        ))}
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleNext}
        style={styles.nextButtonWrapper}
      >
        <LinearGradient
          colors={[
            theme.colors.primary,
            theme.colors.primaryDark || theme.colors.primary,
          ]}
          style={styles.nextButton}
        >
          <Text style={[styles.nextButtonText, { color: theme.colors.white }]}>
            Get Started
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};
