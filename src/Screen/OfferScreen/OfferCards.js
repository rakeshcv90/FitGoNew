import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {ImageBackground} from 'react-native';
import {localImage} from '../../Component/Image';
import NewButton from '../../Component/NewButton';
import {Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';
const OfferCards = React.memo(
  ({
    imgSource,
    header,
    text1,
    text2,
    text3,
    text1Color,
    coinTextColor,
    bannerType,
    opacity,
    onPress,
    buttonText,
    isactive,
    withAnimation,
    downloaded,
    showRightArrow
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txt1}>{header}</Text>
        <ImageBackground
          source={imgSource}
          style={[styles.imgBackground, ]}
          resizeMode="stretch">
          <Text style={[styles.text2, {color: text1Color}]}>{text1}</Text>
          <Text style={[styles.text3, {color: text1Color}]}>{text2}</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            {bannerType == 'breathe' && (
              <>
                <Image
                  source={localImage.Clock1}
                  style={{height: 25, width: 25}}
                  tintColor={AppColor.WHITE}
                />
                <Text style={{color: AppColor.WHITE, fontFamily: 'Helvetica'}}>
                  {' 30 Sec • '}
                </Text>
              </>
            )}
            <Image
              source={localImage.FitCoin}
              style={{height: 30, width: 30}}
            />
            <Text style={[styles.text4, {color: coinTextColor}]}>{text3}</Text>
          </View>
          <NewButton
            title={buttonText ?? 'Start Now'}
            svgArrowRight={showRightArrow??true}
            svgArrowColor={AppColor.WHITE}
            iconColor={AppColor.WHITE}
            ButtonWidth={DeviceWidth * 0.38}
            alignSelf={'flex-start'}
            fontFamily={'Helvetica-Bold'}
            pV={10}
            position={'absolute'}
            bottom={DeviceHeigth * 0.04}
            left={16}
            onPress={onPress}
            disabled={!isactive}
            withAnimation={withAnimation??false}
            download={downloaded??0}
            opacity={isactive ? 1 : 0.7}
          />
        </ImageBackground>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    top: -DeviceHeigth * 0.14,
    paddingVertical: 15,
    marginBottom: 15,
  },
  txt1: {
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    fontFamily: 'Helvetica-Bold',
    color: AppColor.BLACK,
    fontSize: 16,
  },
  imgBackground: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.25,
    marginTop: 15,
    alignSelf: 'center',
    padding: 18,
  },
  text2: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 17,
  },
  text3: {
    fontFamily: 'Helvetica',
    width: DeviceWidth * 0.55,
    fontSize: 13,
  },
  text4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    marginLeft: 6,
  },
});
export default OfferCards;
