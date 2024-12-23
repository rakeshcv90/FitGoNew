import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {AppColor, Fonts} from '../../Component/Color';
import FitText from '../../Component/Utilities/FitText';
import MeditationMusic from './MeditationMusic';

const NewMeditationExercise = ({navigation, route}: any) => {
  const {index, allMeditation} = route.params;
  const [number, setNumber] = useState(index);
  const [backPressed, setBackPressed] = useState(false);

  return (
    <View style={[styles.container,{paddingTop: 10}]}>
      <Wrapper styles={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'black'}
          translucent={false}
        />
        <NewHeader1
          header={allMeditation[number]?.exercise_mindset_title}
          fillColor={AppColor.WHITE}
          headerStyle={{
            color: AppColor.WHITE,
            fontFamily: Fonts.HELVETICA_BOLD,
            fontSize: 20,
            textTransform: 'capitalize',
          }}
          backButton
          onBackPress={() => {
            setBackPressed(true)
          }}
        />
        <View
          style={{
            width: '100%',
            height: '55%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
            source={{
              uri: allMeditation[number]?.exercise_mindset_image_link,
            }}
          />
          <FitText
            type="Heading"
            value={allMeditation[number].exercise_mindset_title}
            color={AppColor.WHITE}
          />
        </View>
        <MeditationMusic allMeditation={allMeditation} number={number} setNumber={setNumber} backPressed={backPressed} />
      </Wrapper>
    </View>
  );
};

export default NewMeditationExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.BLACK,
  },
});
