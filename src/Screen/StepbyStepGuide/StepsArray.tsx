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
    bold:''
  },
  {
    id: 2,
    heading: `Choose your Plan`,
    text: `Choose your plan to participate in weekly challenges.`,
    image: require('../../Icon/Images/InAppRewards/StepGuide2.png'),
    bold:''
  },
  {
    id: 3,
    heading: `Your 7 day plan`,
    text: `Start your 7 day plan to win exciting `,
    image: require('../../Icon/Images/InAppRewards/StepGuide3.png'),
    bold:'cash prize.',
  },
  {
    id: 4,
    heading: `Earn more coins`,
    text: `By participating on weeklyearn `,
    image: require('../../Icon/Images/InAppRewards/StepGuide4.png'),
    bold:'extra fitcoins'
  },
  {
    id: 5,
    heading: `Don’t miss the streak`,
    text: `Do not let your streak break and earn `,
    image: require('../../Icon/Images/InAppRewards/StepGuide5.png'),
    bold:'extra bonus!'
  },
  {
    id: 6,
    heading: `Challenge starts every Monday`,
    text: `Challenge will start every `,
    image: require('../../Icon/Images/InAppRewards/StepGuide6.png'),
    bold:'monday.'
  },
  {
    id: 7,
    heading: `Be the big winner`,
    text: `Do not let your streak break and earn `,
    image: require('../../Icon/Images/InAppRewards/StepGuide7.png'),
    bold:'extra bonus!'
  },
];
