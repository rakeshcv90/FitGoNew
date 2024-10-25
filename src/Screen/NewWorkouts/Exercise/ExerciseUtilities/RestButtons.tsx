import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../../../../Component/Color';
import FitText from '../../../../Component/Utilities/FitText';
import {DeviceWidth} from '../../../../Component/Config';

type RestButtonsProps = {
  seconds: number;
  setRestSet: Function;
  setSeconds: Function;
  reset: Function;
};

type ButtonProps = {
  name: string;
};

const RestButtons = ({
  setRestSet,
  setSeconds,
  reset,
  seconds,
}: RestButtonsProps) => {
  const [isButtonClicked, setisButtonClicked] = useState(false);

  const Button = ({name}: ButtonProps) => {
    const onPress = () => {
      if (name == 'Skip') {
        setRestSet(false);
        reset();
      } else if(!isButtonClicked) {
        setisButtonClicked(true);
        setSeconds(seconds + 5);
      }
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={name != 'Skip' && isButtonClicked}
        style={[
          styles.button,
          {
            backgroundColor: name != 'Skip' ? AppColor.WHITE : AppColor.RED,
            borderColor:
              name == 'Skip'
                ? AppColor.WHITE
                : isButtonClicked
                ? '#979797'
                : AppColor.RED,
            marginRight: 10,
          },
        ]}>
        <FitText
          type="normal"
          value={name}
          color={
            name == 'Skip'
              ? AppColor.WHITE
              : isButtonClicked
              ? '#979797'
              : AppColor.RED
          }
          fontWeight="700"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
      }}>
      <Button name="+5sec" />
      <Button name="Skip" />
    </View>
  );
};

export default RestButtons;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: DeviceWidth * 0.25,
    alignItems: 'center',
  },
});

