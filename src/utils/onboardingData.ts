export interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  image?: any; // We'll use require() for local images for now
}

export const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: 'Track Your Progress',
    description: 'Monitor your workouts, steps, and calories with detailed analytics and charts.',
    image: require('../assets/images/fitness1.png'), // Placeholder - add images later
  },
  {
    id: 2,
    title: 'Personalized Workouts',
    description: 'Get custom workout plans tailored to your goals and fitness level.',
    image: require('../assets/images/fitness2.png'),
  },
  {
    id: 3,
    title: 'Stay Motivated',
    description: 'Receive reminders, achievements, and notifications to keep you on track.',
    image: require('../assets/images/fitness3.png'),
  },
];