import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Circle, Line} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector, useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {Calendar} from 'react-native-calendars';
import AnimatedLottieView from 'lottie-react-native';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {Linking} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NewProgressScreen = ({navigation}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getHomeGraphData = useSelector(state => state?.getHomeGraphData);
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState('Weekly');
  const [array, setArray] = useState([]);
  const [getBmi, setBmi] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [Height, setheight] = useState();
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  let arrayForData = [];
  useEffect(() => {
    WeightGraphData(1);
  }, []);
  const WeightGraphData = id => {
    if (id == 1) {
      let currentWeight = getUserDataDetails?.weight;
      for (i = 0; i < getHomeGraphData.weekly_data?.length; i++) {
        let NewWeight =
          currentWeight - getHomeGraphData?.weekly_data[i]?.total_burn_weight;
        currentWeight = NewWeight;
        arrayForData.push(parseFloat(NewWeight).toFixed(3));
      }
      setArray(arrayForData);
    } else if (id == 2) {
      let currentWeight = getUserDataDetails?.weight;
      for (i = 0; i < getHomeGraphData?.monthly_data?.length; i++) {
        let NewWeight =
          currentWeight - getHomeGraphData?.monthly_data[i]?.total_burn_weight;
        currentWeight = NewWeight;
        arrayForData.push(parseFloat(NewWeight).toFixed(3));
      }
      setArray(arrayForData);
    }
  };

  const LineText = ({Txt1, Txt2, NavigationScrnName}) => {
    const DropDownLabels = [
      {label: 'Weekly', value: '1'},
      {label: 'Monthly', value: '2'},
    ];
    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    };
    return (
      <View
        style={{
          marginVertical: 20,
          flexDirection: 'row',
          width: DeviceWidth * 0.95,
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: 'bold',
              lineHeight: 19.5,
              fontSize: 18,
            }}>
            {Txt1}
          </Text>
        </View>
        {Txt2 ? (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={DropDownLabels}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={value}
            value={value}
            onChange={item => {
              setValue(item.label);
              WeightGraphData(item.value);
            }}
            renderItem={renderItem}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(NavigationScrnName);
            }}>
            <Icons name={'chevron-right'} size={25} color={AppColor.BLACK} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
// weight graph data
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [
          getUserDataDetails?.weight,
          ...array,
          getUserDataDetails?.target_weight,
        ],
        color: () => AppColor.RED, // optional
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: AppColor.WHITE,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: AppColor.RED,
    backgroundGradientToOpacity: 0,
    color: () => AppColor.BoldText,
    decimalPlaces: 0,
    strokeWidth: 4, // optional, default 3
    barPercentage: 0,
    useShadowColorFromDataset: false, // optional
  };
  const specificDataIndex = array.length+1; // Index of the specific data point you want to emphasize

  const renderCustomPoint = ({x, y, index, value}) => {
    if (index === specificDataIndex) {
      return (
        <React.Fragment key={index}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={DeviceHeigth * 0.2} // Adjust this value based on your chart height
            stroke={AppColor.RED} // Line color
            strokeWidth={1}
            strokeDasharray={[4, 4]}
          />
          <Circle
            cx={x}
            cy={y}
            r={7}
            fill={AppColor.WHITE}
            stroke={AppColor.RED}
            strokeWidth={3}
          />
        </React.Fragment>
      );
    }
    return null; // Render nothing for other data points
  };
  //BMI
  const [modalVisible, setModalVisible] = useState(false);
  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };
  const BMImodal = () => {
    const [selected, setSelected] = useState('');
    const [focused, setFocused] = useState(false);
    const [isNextClicked, setNextClicked] = useState(false);
    const [height, setHeight] = useState('');
    const [Dvalue, setDValue] = useState('ft');
    const dropDownItems = [
      {label: 'ft', value: '1'},
      {label: 'cm', value: '2'},
    ];
    const renderDropItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    };
    const HandleSubmitBMI = () => {
      if (selected == '' || height == '') {
        Alert.alert('Please enter valid height and weight', '', [
          {
            text: 'Ok',
            onPress: () => {
              setBmi();
              setModalVisible(false);
            },
          },
        ]);
      } else {
        const BMI =
          (selected == '' ? getUserDataDetails?.weight : selected) /
          (Dvalue == 'ft' ? height * 0.3048 : height / 100) ** 2;
        setBmi(BMI.toFixed(2));
        setModalVisible(false);
        setheight(height);
      }
    };
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={{flex: 1, backgroundColor: 'red'}}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
          }}>
          <BlurView
            style={styles.modalContainer}
            blurType="light"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={[styles.modalContent, {backgroundColor: AppColor.WHITE}]}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
              }}
              onPress={closeModal}>
              <Icons name={'close'} size={25} color={AppColor.BLACK} />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  color: AppColor.BLACK,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                  lineHeight: 30,
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                {isNextClicked
                  ? 'Select your current height'
                  : 'Enter your current weight'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginVertical: 8,
                }}>
                <TextInput
                  keyboardType="number-pad"
                  value={isNextClicked ? height : selected}
                  onChangeText={text => {
                    if (text == '.') {
                      showMessage({
                        message: 'Wrong Input',
                        type: 'danger',
                        animationDuration: 500,
                        floating: true,
                        icon: {icon: 'auto', position: 'left'},
                      });
                    } else isNextClicked ? setHeight(text) : setSelected(text);
                  }}
                  onFocus={setFocused}
                  cursorColor={AppColor.RED}
                  placeholder={
                    focused
                      ? isNextClicked
                        ? height
                        : selected
                      : getUserDataDetails?.weight == 'undefined'
                      ? '0.0'
                      : isNextClicked
                      ? '0.0'
                      : getUserDataDetails?.weight
                  }
                  placeholderTextColor={focused ? AppColor.RED : AppColor.Gray5}
                  maxLength={3}
                  style={{
                    fontSize: 30,
                    fontFamily: 'Poppins-SemiBold',
                    color: AppColor.BLACK,
                    width: focused
                      ? isNextClicked
                        ? height != ''
                          ? null
                          : 50
                        : selected != ''
                        ? null
                        : 50
                      : 50,
                    borderColor: focused ? AppColor.RED : AppColor.DARKGRAY,
                    borderBottomWidth: 1,
                    alignSelf: 'center',
                    paddingLeft: 4,
                  }}
                />
                {isNextClicked == false ? (
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      color: AppColor.BoldText,
                      fontSize: 30,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}>
                    {'Kg'}
                  </Text>
                ) : (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      {
                        width: DeviceWidth * 0.2,
                        alignSelf: 'flex-end',
                        position: 'absolute',
                        left: 60,
                        bottom: 5,
                      },
                    ]}
                    placeholderStyle={[
                      styles.placeholderStyle,
                      {fontWeight: '600', fontSize: 18},
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      {fontWeight: '600'},
                    ]}
                    data={dropDownItems}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={Dvalue}
                    value={Dvalue}
                    onChange={item => {
                      setDValue(item.label);
                    }}
                    renderItem={renderDropItem}
                  />
                )}
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: DeviceWidth * 0.35,
                borderRadius: 8,
                alignSelf: 'center',
                marginTop: 20,
              }}
              onPress={() => {
                isNextClicked ? HandleSubmitBMI() : setNextClicked(true);
              }}>
              <LinearGradient
                colors={[AppColor.RED1, AppColor.RED1, AppColor.RED]}
                style={[styles.button_b, {padding: 5}]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 18,
                    fontWeight: '700',
                    color: AppColor.WHITE,
                  }}>
                  {isNextClicked ? 'Submit' : 'Next'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  const theme = useMemo(() => {
    return {
      backgroundColor: AppColor.WHITE,
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: AppColor.RED,
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: AppColor.RED,
      monthTextColor: AppColor.RED,
      indicatorColor: AppColor.RED,
      textMonthFontSize: 17,
      textDayFontFamily: 'Montserrat-SemiBold',
      textMonthFontFamily: 'Montserrat-SemiBold',
      dayTextColor: AppColor.BLACK,
    };
  }, []);
  const EmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const openMailApp = () => {
    Linking.openURL(
      'mailto:aessikarwar03@gmail.com?subject=Feedback&body=Hello%20there!',
    );
  };
  return (
    <SafeAreaView style={styles.Container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.box1}>
          <TouchableOpacity
            style={styles.Feedback_B}
            activeOpacity={0.5}
            onPress={() => {
              analytics().logEvent('CV_FITME_CLICKED_ON_FEEDBACK');
              openMailApp();
            }}>
            <Image
              source={localImage.Feedback}
              style={{width: 15, height: 15}}
              resizeMode="contain"
            />
            <Text
              style={{
                color: AppColor.RED,
                textAlign: 'center',
                fontSize: 12,
                marginLeft: 8,
                // fontFamily:'Poppins-Regular',
                fontWeight: '600',
              }}>
              {'Feedback'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileView}>
          {Object.keys(getUserDataDetails)?.length > 0 && (
            <>
              {isLoading && (
                <ShimmerPlaceholder
                  style={styles.loader}
                  ref={avatarRef}
                  autoRun
                />
              )}
              <Image
                source={
                  getUserDataDetails.image_path == null
                    ? localImage.avt
                    : {uri: getUserDataDetails.image_path}
                }
                style={styles.img}
                onLoad={() => setIsLoading(false)}
                resizeMode="cover"
              />
            </>
          )}
        </View>
        <Text
          style={{
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            textAlign: 'center',
            marginVertical: 20,
            fontFamily: 'Montserrat-SemiBold',
            color: AppColor.BLACK,
            fontSize: 22,
            fontWeight: '700',
          }}>
          {`Hi, ${
            getUserDataDetails?.name
              ? getUserDataDetails?.name.split(' ')[0]
              : 'Guest'
          }`}
        </Text>
        {getUserDataDetails?.workout_plans != 'CustomCreated' ? (
          <>
            <LineText
              Txt1={'Weight'}
              Txt2={'Weekly'}
              setGraphValue={setValue}
            />
            {getUserDataDetails?.weight ? (
              <View style={[styles.card, {}]}>
                <LineChart
                  style={{paddingRight: 30}}
                  data={data}
                  width={DeviceWidth * 0.85}
                  height={DeviceHeigth * 0.25}
                  chartConfig={chartConfig}
                  withInnerLines={false}
                  withOuterLines={true}
                  withDots={true}
                  bezier
                  segments={4}
                  renderDotContent={renderCustomPoint}
                  // onDataPointClick={data =>
                  //   console.log('PointData=====>', data.value)
                  // }
                  withShadow={false}
                  yAxisInterval={10}
                  fromZero={true}
                />
              </View>
            ) : (
              <EmptyComponent />
            )}
          </>
        ) : null}
        <LineText
          Txt1={'Monthly Achievement'}
          NavigationScrnName={'NewMonthlyAchievement'}
        />
        <View style={[styles.card, {flexDirection: 'column'}]}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 22,
              marginVertical: 8,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {dates.slice(0, 7).map((value, index) => (
              <Text
                key={index}
                style={{
                  color: AppColor.Gray5,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  textAlign: 'center',
                  width: 30,
                }}>
                {value.day}
              </Text>
            ))}
          </View>
          <Calendar
            onDayPress={day => {
              console.log(day);
              setDate(day.dateString);
            }}
            markingType="period"
            hideArrows
            enableSwipeMonths={false}
            hideExtraDays={true}
            hideDayNames={false}
            markedDates={{
              [getDate]: {
                startingDay: true,
                color: AppColor.RED,
                endingDay: true,
                textColor: AppColor.WHITE,
              },
            }}
            theme={theme}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            marginVertical: 20,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                textAlign: 'center',
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: 'bold',
                lineHeight: 19.5,
                fontSize: 18,
              }}>
              {'BMI: '}
            </Text>
            <Text
              style={{
                textAlign: 'center',

                fontFamily: 'Montserrat-SemiBold',
                fontWeight: 'bold',
                lineHeight: 19.5,
                fontSize: 18,
                color: '#00A930',
              }}>
              {getBmi ?? 'No data'}
            </Text>
          </View>
          <View />
        </View>
        <View
          style={[styles.card, {flexDirection: 'column', marginBottom: 10}]}>
          {Height ? (
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
                  borderRadius: 8,
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
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {'0'}
                </Text>
                <Text
                  style={{
                    color: AppColor.BLACK,
                    fontFamily: 'Poppins-SemiBold',
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
                    fontFamily: 'Poppins-SemiBold',
                    right: isFinite(getBmi) ? null : 28,
                    textAlign: 'center',
                  }}>
                  {isNaN(getBmi)
                    ? 'No data'
                    : getBmi < 18
                    ? (getBmi * 2 + 10).toFixed(0)
                    : getBmi > 18 && getBmi < 25
                    ? (getBmi * 2).toFixed(0)
                    : (getBmi * 2 - 8).toFixed(0)}
                </Text>
              </View>
            </>
          ) : null}
          <TouchableOpacity
            style={[styles.button_b, {marginVertical: 20}]}
            activeOpacity={0.5}
            onPress={() => {
              setModalVisible(true);
            }}>
            <LinearGradient
              colors={[AppColor.RED1, AppColor.RED1, AppColor.RED]}
              style={[styles.button_b, {padding: 5}]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 18,
                  color: AppColor.WHITE,
                }}>
                {'Calculate BMI'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BMImodal />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  box1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
    width: DeviceWidth * 0.95,
  },
  Feedback_B: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    borderColor: AppColor.RED,
    flexDirection: 'row',
  },
  img: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
  },
  profileView: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.95,
    borderRadius: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  Weekly_B: {
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: AppColor.RED,
    padding: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_b: {
    paddingHorizontal: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
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
  dropdown: {
    height: 30,
    width: DeviceWidth * 0.3,
    borderColor: 'red',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    backgroundColor: AppColor.WHITE,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: AppColor.BLACK,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: AppColor.BLACK,
  },
  placeholderStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColor.GRAY,
    // top: DeviceHeigth * 0.02,
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
  },
});
export default NewProgressScreen;
