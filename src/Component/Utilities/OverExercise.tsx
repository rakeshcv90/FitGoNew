import {
  BackHandler,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {store} from '../ThemeRedux/Store';
import moment from 'moment';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth} from '../Config';
import FitIcon from './FitIcon';
import {localImage} from '../Image';
import FitText from './FitText';
import {useDispatch, useSelector} from 'react-redux';
import {setExerciseInTime, setExerciseOutTime} from '../ThemeRedux/Actions';
import {ActivityIndicator} from 'react-native';

type OverExerciseType = {
  overExerciseVisible: boolean;
  setOverExerciseVisible: Function;
  handleBreakButton: Function | any;
  loader?: boolean;
  closeExtrFunction?: Function | any
};

const format = 'hh:mm:ss';

const OverExerciseModal = ({
  setOverExerciseVisible,
  overExerciseVisible,
  handleBreakButton,
  loader,
  closeExtrFunction
}: OverExerciseType) => {
  const dispatch = useDispatch();

  const close = () => {
   closeExtrFunction && closeExtrFunction()
    setOverExerciseVisible(false);
    dispatch(setExerciseInTime(''));
    dispatch(setExerciseOutTime(''));
  };

  return (
    <Modal visible={overExerciseVisible} animationType="slide" transparent>
      <View style={styles.container}>
        <View
          style={{
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: '20%',
              alignItems: 'flex-end',
            }}>
            <FitIcon name="close" size={30} type="AntDesign" onPress={close} />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '50%',
            }}>
            <Image
              source={localImage.Hourglass}
              resizeMode="contain"
              style={{width: '50%', height: '20%', marginVertical: 20}}
            />
            <FitText
              type="SubHeading"
              value={`Today's 45-min Workout Goal Achieved!`}
              fontFamily={Fonts.HELVETICA_REGULAR}
              fontSize={22}
              color="#1F2937"
              textAlign="center"
              lineHeight={30}
              fontWeight="600"
            />
            <FitText
              type="normal"
              value={`You’ve Completed a 45-Minute Workout! We Recommend You to Take a Break and Give Your Body the Rest It Deserves.`}
              color="#6B7280"
              textAlign="center"
              lineHeight={23}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: '20%',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={handleBreakButton}
              style={{
                width: '90%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: AppColor.RED,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                marginBottom: 10,
              }}>
              {loader ? (
                <ActivityIndicator size="small" color={AppColor.RED} />
              ) : (
                <FitText
                  type="SubHeading"
                  value="Take a break"
                  color={AppColor.RED}
                  fontWeight="600"
                  fontFamily={Fonts.HELVETICA_REGULAR}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={close}>
              <FitText
                type="SubHeading"
                value="Continue Exercise"
                color="#6B7280"
                fontWeight="600"
                fontFamily={Fonts.HELVETICA_REGULAR}
                marginVertical={10}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OverExerciseModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
});
