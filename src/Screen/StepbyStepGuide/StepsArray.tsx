import {Image} from 'react-native';

export type StepsArrayType = {
  id: number;
  heading: string;
  text: string;
  image: Image | any;
  bold: string;
};

export const StepsArray = [
  {
    id: 1,
    heading: `Register`,
    text: `Register yourself by entering the details to begin your journey.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide1.png'),
    bold: '',
  },
  {
    id: 2,
    heading: `Choose Your Plan`,
    text: `Choose your plan to participate in the weekly challenges.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide2.png'),
    bold: '',
  },
  {
    id: 3,
    heading: `Weekly Workout Plan`,
    text: `Start your 7 day plan to win exciting prize`,
    image: require('../../Icon/Images/InAppRewards/StepGuide3.png'),
    bold: '',
  },
  {
    id: 4,
    heading: `Earn Bonus FitCoins`,
    text: `Complete short cardio and breathing sessions to earn bonus FitCoins.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide4.png'),
    bold: '',
  },
  {
    id: 5,
    heading: `Don’t Miss the Streak`,
    text: `Workout daily without missing a day to make sure you don’t lose your hard-earned FitCoins.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide5.png'),
    bold: '',
  },
  {
    id: 6,
    heading: `Challenge Starts Every Monday`,
    text: `The new challenge will start every Monday.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide6.png'),
    bold: '',
  },
  {
    id: 7,
    heading: `Top the Leaderboard`,
    text: `Earn as many FitCoins as you can and top the leaderboard to win the amazing prize.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide7.png'),
    bold: '',
  },
];
