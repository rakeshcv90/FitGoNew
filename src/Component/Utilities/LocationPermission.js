import { Linking, StyleSheet, View } from 'react-native';
import { Modal } from 'react-native';
import { DeviceHeigth, DeviceWidth } from '../Config';
import { AppColor, Fonts } from '../Color';
import { Platform } from 'react-native';
import { Text } from 'react-native';
import NewButton from '../NewButton';
import AnimatedLottieView from 'lottie-react-native';
export const LocationPermissionModal = ({locationP, setLocationP}) => {
    return (
      <Modal
        visible={locationP}
        onRequestClose={() => setLocationP(false)}
        transparent>
        <View style={styles.modalContainer}>
          <View
            style={{
              // height: DeviceWidth,
              width: DeviceWidth * 0.8,
              backgroundColor: AppColor.WHITE,
              borderRadius: 10,
              padding: 10,
              alignItems: 'center',
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}>
            <Text
              style={{
                fontSize: 20,
                color: AppColor.LITELTEXTCOLOR,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                lineHeight: 30,
                marginTop: DeviceWidth * 0.05,
              }}>
              Enable Your Location
            </Text>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Location.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: AppColor.HEADERTEXTCOLOR,
                fontWeight: '600',
                fontFamily: Fonts.MONTSERRAT_REGULAR,
                lineHeight: 24,
                textAlign: 'center',
                // marginHorizontal: DeviceWidth * 0.1,
              }}>
              {
                'Please allow required permissions to use the app. Go to App->Permissions and enable all Permissions.'
              }
            </Text>
            <NewButton
              ButtonWidth={DeviceWidth * 0.6}
              title={'Enable Location Services'}
              pV={12}
              mV={8}
              onPress={() => {
                Linking.openSettings().finally(() => {
                  setLocationP(false);
                 
                });
              }}
            />
            <NewButton
              ButtonWidth={DeviceWidth * 0.6}
              title={'Do not allow'}
              pV={12}
              mV={8}
              buttonColor={AppColor.GRAY1}
              titleColor={AppColor.BLACK}
              onPress={() => {
                setLocationP(false);

              }}
            />
          </View>
        </View>
      </Modal>
    );
  };
  const styles=StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        // Semi-transparent background
      },
  })