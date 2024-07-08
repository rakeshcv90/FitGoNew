import React, {useEffect, useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {Vector} from 'react-native-redash';
import {Dimensions} from 'react-native';

import {Side} from './Wave';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AppColor} from '../../Component/Color';

const {width} = Dimensions.get('screen');
const RADIUS = 25;

interface ButtonProps {
  position: Vector<Animated.SharedValue<number>>;
  side: Side;
  activeSide: Animated.SharedValue<Side>;
  currentIndex: number;
}

const Button = ({position, side, activeSide, currentIndex}: ButtonProps) => {
  const isLeft = side === Side.LEFT;
//   const pos = activeSide.value === 1 ? 4 : 2
//   console.log(activeSide.value)
  const [pos, setPos] = useState(2);
  useEffect(() => {
    setPos(activeSide.value === 2 ? 4 : 2);
  }, [activeSide.value]);
  
  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: isLeft
      ? position.x.value * pos - RADIUS * 2
      : width - position.x.value * pos,
    top: position.y.value - RADIUS * 5,
    borderRadius: RADIUS,
    width: RADIUS * 2,
    height: RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 1,
    opacity: withTiming(activeSide.value === Side.NONE ? 1 : 0),
  }));
  return (
    <Animated.View style={style}>
      <FitIcon
        type="AntDesign"
        name={`${!isLeft ? 'right' : 'left'}` as const}
        size={30}
        color={currentIndex == 1 ? AppColor.WHITE : AppColor.RED}
      />
    </Animated.View>
  );
};

export default Button;
