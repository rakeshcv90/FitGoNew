import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
const PastWinnersComponent = ({pastWinners, navigation}) => {
  const handleButtonPress = () => {
    navigation.navigate('PastWinner', {
      pastWinners: pastWinners,
    });
  };
  if (pastWinners?.length <= 0) return;
  return (
    <View style={styles.container}>
      <View style={{height: 40}}>
        {pastWinners?.slice(0, 4)?.map((item, index) => (
          <View style={[styles.imageView, {left: index * 25}]}>
            {index == 3 ? (
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  color: AppColor.BLACK,
                }}>
                +{pastWinners?.length}
              </Text>
            ) : item?.image != null ? (
              <Image
                source={{uri: item?.image}}
                style={{width: 40, height: 40}}
                resizeMode="cover"
              />
            ) : (
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  color: AppColor.BLACK,
                }}>
                {item?.name.substring(0, 1).toUpperCase()}
              </Text>
            )}
          </View>
        ))}
      </View>
      <NewButton
        ButtonWidth={DeviceWidth * 0.42}
        pV={6}
        title={'View Past Winners'}
        buttonColor={'#E9ECEF'}
        titleColor={'#343A40'}
        fontFamily={Fonts.HELVETICA_BOLD}
        onPress={handleButtonPress}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  imageView: {
    height: '100%',
    width: 40,
    borderWidth: 1.5,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#DBEAFE',
    borderColor: AppColor.WHITE,
    // top: PLATFORM_IOS ? 5 : 13,
  },
});
export default PastWinnersComponent;
