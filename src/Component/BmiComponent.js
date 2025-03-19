import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from './Color';
import {DeviceWidth, DeviceHeigth} from './Config';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnalyticsConsole} from './AnalyticsConsole';
import {setBmi} from './ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
export const BmiMeter = ({getBmi}) => {
  return (
    <>
      <View style={{width: DeviceWidth * 0.9, alignSelf: 'center'}}>
        <View
          style={{
            width: 100,
            marginLeft:
              getBmi > 0 && getBmi <= 18
                ? DeviceWidth * 0.1
                : getBmi > 18 && getBmi < 25
                ? DeviceWidth * 0.35
                : getBmi
                ? DeviceWidth * 0.6
                : DeviceWidth * 0.35,
          }}>
          <View
            style={{
              backgroundColor: '#F25C19',
              borderRadius: 8,
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '500', color: AppColor.WHITE}}>
              {getBmi <= 18
                ? 'Under Weight'
                : getBmi > 18 && getBmi < 25
                ? 'Normal'
                : isFinite(getBmi)
                ? 'Over Weight'
                : 'No Data'}
            </Text>
          </View>
          <View style={styles.arrowheadContainer}>
            <View style={styles.arrowhead} />
          </View>
        </View>
      </View>
      <LinearGradient
        colors={[
          '#BCFFF7',
          '#92FFBD',
          '#00BE4C',
          '#FFC371',
          '#FF7A1A',
          '#D5191A',
          '#941000',
        ]}
        style={{
          width: DeviceWidth * 0.9,
          height: 18,
          borderRadius: 6,
          alignSelf: 'center',
        }}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
      />
      <View
        style={{
          flexDirection: 'row',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: DeviceWidth * 0.88,
          marginTop: 5,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: AppColor.BLACK,
            position: 'absolute',
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
          }}>
          {'0'}
        </Text>
        <Text
          style={{
            color: AppColor.BLACK,
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            textAlign: 'center',
            width: 85,
            marginLeft:
              getBmi > 0 && getBmi <= 18
                ? DeviceWidth * 0.1
                : getBmi > 18 && getBmi < 25
                ? DeviceWidth * 0.35
                : DeviceWidth * 0.6,
          }}>
          {getBmi}
        </Text>
        <Text
          style={{
            color: AppColor.BLACK,
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            right: isFinite(getBmi) ? null : 28,
            textAlign: 'center',
          }}>
          {getBmi < 18
            ? (getBmi * 2 + 10).toFixed(0)
            : getBmi > 18 && getBmi < 25
            ? (getBmi * 2).toFixed(0)
            : (getBmi * 2 - 8).toFixed(0)}
        </Text>
      </View>
    </>
  );
};
// for modal content
const WeightHeight = ({
  arr,
  heading,
  value,
  setValue,
  setHeightType,
  setWeightType,
  heightInch,
  setHeightInch,
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <View style={styles.View2}>
      <Text style={styles.txt2}>{heading}</Text>
      <View style={styles.View3}>
        {heading == 'Height' && selectedItem == 0 ? (
          <>
            <TextInput
              style={{width: DeviceWidth * 0.24}}
              underlineColor="transparent"
              placeholder="ft"
              placeholderTextColor={AppColor.GRAY2}
              mode="outlined"
              keyboardType="decimal-pad"
              activeUnderlineColor="transparent"
              maxLength={1}
              outlineStyle={{borderRadius: 10}}
              outlineColor={AppColor.BORDERCOLOR}
              activeOutlineColor="#C8170D"
              value={value}
              onChangeText={txt => {
                if(txt<4 && txt !=''){
                  setValue('');
                  showMessage({
                    message: "Height can't be less than 4 ft.",
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                }else{
                  setValue(txt);
                }
              }}
            />
            <TextInput
              style={{width: DeviceWidth * 0.24}}
              underlineColor="transparent"
              mode="outlined"
              keyboardType="decimal-pad"
              activeUnderlineColor="transparent"
              placeholder="inch"
              placeholderTextColor={AppColor.GRAY2}
              maxLength={2}
              outlineStyle={{borderRadius: 10}}
              outlineColor={AppColor.BORDERCOLOR}
              activeOutlineColor="#C8170D"
              value={heightInch}
              onChangeText={txt => {
                if (txt > 12 ) {
                  setHeightInch('');
                  showMessage({
                    message: 'Please enter number between 0 and 12',
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                } else {
                  setHeightInch(txt);
                }
              }}
            />
          </>
        ) : (
          <TextInput
            style={{width: DeviceWidth * 0.5}}
            underlineColor="transparent"
            mode="outlined"
            keyboardType="decimal-pad"
            placeholder={
              heading == 'Weight' && selectedItem == 0
                ? 'kg'
                : heading == 'Weight' && selectedItem == 1
                ? 'lbs'
                : 'cm'
            }
            placeholderTextColor={AppColor.GRAY2}
            activeUnderlineColor="transparent"
            maxLength={3}
            outlineStyle={{borderRadius: 10}}
            outlineColor={AppColor.BORDERCOLOR}
            activeOutlineColor="#C8170D"
            value={value}
            onChangeText={txt => {
              setValue(txt);
            }}
          />
        )}
        {arr.map((v, i) => (
          <View key={i}>
            <TouchableOpacity
              style={[
                styles.button1,
                {
                  backgroundColor:
                    selectedItem == i ? AppColor.BLACK : AppColor.GRAY2,
                },
              ]}
              onPress={() => {
                setSelectedItem(i);
                if (heading == 'Weight') {
                  setWeightType(i == 0 ? 'kg' : 'lbs');
                } else {
                  setHeightType(i == 0 ? 'ft' : 'cm');
                }
              }}>
              <Text
                style={[
                  styles.txt3,
                  {
                    color: selectedItem == i ? AppColor.WHITE : AppColor.BLACK,
                  },
                ]}>
                {v}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};
//modal

export const BMImodal = ({setModalVisible, modalVisible, dispatch}) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightInch, setHeightInch] = useState('');
  const [heightType, setHeightType] = useState('ft');
  const [weightType, setWeightType] = useState('kg');
  let newHeight = height + '.' + heightInch;
  console.log(newHeight, height);
  const HandleSubmitBMI = () => {
    console.log( weight === '' ||
    newHeight === '' ||
    height === '' ||
    isNaN(weight) ||
    isNaN(height) ||
    weight < 10 )
    if (
      weight === '' ||
      newHeight === '' ||
      height === '' ||
      isNaN(weight) ||
      isNaN(height) ||
      weight < 10 ||
      weight > 300
    ) {
      Alert.alert('Please enter valid height and weight', '', [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    }
     else {
      AnalyticsConsole(`Submit_BMI_BUTTON`);
      const BMI =
        (weightType == 'kg' ? weight : weight / 2.2) /
        (heightType == 'ft' ? newHeight * 0.3048 : height / 100) ** 2;
      dispatch(
        setBmi({
          Bmi: BMI.toFixed(2),
          userHeight:
            heightType == 'ft' ? newHeight + heightType : height + heightType,
          userWeight: weight + weightType,
        }),
      );
      setModalVisible(false);
      setHeight('');
      setWeight('');
      setHeightType('ft');
      setWeightType('kg');
      setHeightInch('');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, {backgroundColor: AppColor.WHITE}]}>
          <View style={styles.View1}>
            <Text style={styles.txt1}>BMI</Text>
            <Icon
              name="close"
              onPress={() => {
                setModalVisible(false);
              }}
              size={27}
              color={AppColor.BLACK}
            />
          </View>
          <WeightHeight
            arr={['kg', 'lbs']}
            heading={'Weight'}
            value={weight}
            setValue={setWeight}
            setWeightType={setWeightType}
          />
          <WeightHeight
            arr={['ft', 'cm']}
            heading={'Height'}
            value={height}
            setValue={setHeight}
            setHeightInch={setHeightInch}
            heightInch={heightInch}
            setHeightType={setHeightType}
          />
          <View
            style={{
              borderWidth: 0.3,
              height: 0,
              marginTop: 15,
              borderColor: AppColor.GRAY2,
            }}
          />
          <View
            style={[
              styles.View3,
              {marginTop: 20, alignItems: 'center', justifyContent: 'flex-end'},
            ]}>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                HandleSubmitBMI();
              }}>
              <Text
                style={[
                  styles.txt3,
                  {
                    color: AppColor.WHITE,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  },
                ]}>
                Calculate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
// Calories and action report
export const CaloriesActionReport = ({arr}) => {
  return (
    <View style={{backgroundColor: AppColor.LIGHTGREY2, borderRadius: 8}}>
      {arr.map((v, i) => (
        <View key={i}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              paddingVertical: 4,
            }}>
            <View style={styles.View5}>
              <Image
                source={v?.img}
                style={{height: 30, width: 30}}
                resizeMode="contain"
              />
              <Text style={[styles.txt2, {marginLeft: 8}]}>{v.txt}</Text>
            </View>
            <Text style={[styles.txt1, {color: AppColor.RED}]}>{v.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  arrowheadContainer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F25C19', // Adjust the color of the arrowhead
    borderStyle: 'solid',
    alignSelf: 'center',
    marginTop: -1,
  },
  arrowhead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
  },
  View1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  View2: {},
  View5: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt1: {
    fontSize: 18,
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '600',
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 18,
    marginVertical: 15,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 17,
  },
  View3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button1: {
    borderRadius: 6,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeigth * 0.07,
    width: DeviceWidth * 0.15,
  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: AppColor.RED,
    borderRadius: 6,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,
    position: 'absolute',
    top: DeviceHeigth / 6,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(0,0,0,0.3)`,
    // Semi-transparent background
  },
});
