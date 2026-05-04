export interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  image?: any;
}

export const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: 'Transform Your Body',
    description: 'Track every calorie, step, and workout with precision.',
    image: require('../assets/images/fitness1.png'),
  },
  {
    id: 2,
    title: 'Track Your Food',
    description: 'Search thousands of food items and track your daily intake with ease.',
    image: require('../assets/images/fitness2.png'),
  },
  {
    id: 3,
    title: 'Peak Performance',
    description: 'Stay consistent with smart reminders designed to push you beyond your limits.',
    image: require('../assets/images/fitness3.png'),
  },
];