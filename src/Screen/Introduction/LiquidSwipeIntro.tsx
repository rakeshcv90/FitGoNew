// import {StyleSheet, Text, View} from 'react-native';
// import React, {useState} from 'react';
// import {IntroductionData} from './IntroductionScreenData';
// import IntroSlider from './IntroSlider';
// import IntroScreen from './IntroScreen';

// const LiquidSwipeIntro = ({navigation}: any) => {
//   const [index, setIndex] = useState(0);
//   const prev =
//     index == 1 ? IntroductionData[0] : index == 2 ? IntroductionData[1] : null;
//   const next =
//     index == 0 ? IntroductionData[1] : index == 1 ? IntroductionData[2] : null;

//   console.log('INDEX', IntroductionData[index]!);
//   return (
//     <IntroSlider
//       index={index}
//       setIndex={setIndex}
//       next={next && <IntroScreen slide={next} navigation={navigation} />}
//       prev={prev && <IntroScreen slide={prev} navigation={navigation} />}>
//       <IntroScreen slide={IntroductionData[index]!} navigation={navigation} />
//     </IntroSlider>
//   );
// };

// export default LiquidSwipeIntro;

// const styles = StyleSheet.create({});

import React, {useEffect, useState} from 'react';
import Slider from './IntroSlider';
import Slide from './IntroScreen';
import {localImage} from '../../Component/Image';
import {IntroductionData} from './IntroductionScreenData';
import LogSignUp from '../LogSignUp';

// const slides = [
//   {
//     color: "#F2A1AD",
//     title: "Dessert Recipes",
//     description:
//       "Hot or cold, our dessert recipes can turn an average meal into a memorable event",
//     picture: localImage.Intro1,
//   },
//   {
//     color: "#0090D6",
//     title: "Healthy Foods",
//     description:
//       "Discover healthy recipes that are easy to do with detailed cooking instructions from top chefs",
//     picture: localImage.Intro2,
//   },
//   {
//     color: "#69C743",
//     title: "Easy Meal Ideas",
//     description:
//       "explore recipes by food type, preparation method, cuisine, country and more",
//     picture: localImage.Intro3,
//   },
//   {
//     color: "#FB3A4D",
//     title: "10000+ Recipes",
//     description:
//       "Browse thousands of curated recipes from top chefs, each with detailled cooking instructions",
//     picture: localImage.Intro1,
//   },
//   {
//     color: "#F2AD62",
//     title: "Video Tutorials",
//     description:
//       "Browse our best themed recipes, cooking tips, and how-to food video & photos",
//     picture: localImage.Intro2,
//   },
// ];

// export const assets = slides.map(({ picture }) => picture);

const LiquidSwipe = ({navigation}: any) => {
  const [index, setIndex] = useState(0);
  const prev = IntroductionData[index - 1];
  const next = IntroductionData[index + 1];


  return (
    <Slider
      key={index}
      index={index}
      setIndex={setIndex}
      prev={prev && <Slide index={index} slide={prev} />}
      next={next && <Slide index={index} slide={next} />}>
      {index == 3 ? (
        <LogSignUp navigation={navigation} />
      ) : (
        <Slide index={index} slide={IntroductionData[index]!} />
      )}
    </Slider>
  );
};

export default LiquidSwipe;
