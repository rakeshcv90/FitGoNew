import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {IntroductionData} from './IntroductionScreenData';
import IntroSlider from './IntroSlider';
import IntroScreen from './IntroScreen';

const LiquidSwipeIntro = ({navigation}: any) => {
  const [index, setIndex] = useState(0);
  const prev = IntroductionData[index - 1];
  const next = IntroductionData[index + 1];
  return (
    <IntroSlider
      index={index}
      setIndex={setIndex}
      next={
        next && (
          <IntroScreen index={index} slide={next} navigation={navigation} />
        )
      }
      prev={
        prev && (
          <IntroScreen index={index} slide={prev} navigation={navigation} />
        )
      }>
      <IntroScreen
        index={index}
        slide={IntroductionData[index]}
        navigation={navigation}
      />
    </IntroSlider>
  );
};

export default LiquidSwipeIntro;

const styles = StyleSheet.create({});
