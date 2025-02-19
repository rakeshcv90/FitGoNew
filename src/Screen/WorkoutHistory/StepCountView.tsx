import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import FitText from '../../Component/Utilities/FitText';
import {localImage} from '../../Component/Image';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';

type Props = {
  data: Object;
};

const arr = [
  {
    id: 1,
    val: 'Steps',
    img: localImage.Step3,
    color: '#EAF7ED',
  },
  {
    id: 2,
    val: 'Distance',
    img: localImage.Step2,
    color: '#FFC1071A',
  },
  {
    id: 3,
    val: 'Calories',
    img: localImage.Step1,
    color: '#DC35451A',
  },
];

const StepCountView = ({data}: Props) => {
  const TripView = ({data, val}: {data: (typeof arr)[0]; val: string}) => (
    <View style={{alignItems: 'center'}}>
      <View
        style={[
          styles.imgContainer,
          {
            backgroundColor: data.color,
          },
        ]}>
        <Image
          source={data.img}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
          tintColor={data.val == 'Steps' ? '#5FB67B' : ''}
        />
      </View>
      <FitText
        type="SubHeading"
        value={val}
        fontWeight='700'
        color={AppColor.PrimaryTextColor}
      />
      <FitText
        type="normal"
        value={data.val}
        color={AppColor.SecondaryTextColor}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FitText type="SubHeading" fontWeight="700" value="Step Tracking" marginHorizontal={5} />
      <View style={[PredefinedStyles.rowBetween, {padding: 10}]}>
        {arr.map(item => (
          <TripView key={item.id} data={item} val={item.color} />
        ))}
      </View>
    </View>
  );
};

export default StepCountView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: AppColor.WHITE,
    padding: 10,
    marginBottom: 10
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 10,
    marginVertical: 10,
  },
});
