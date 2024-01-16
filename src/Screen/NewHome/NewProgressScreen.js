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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Svg, Circle, Line} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {setBmi} from '../../Component/ThemeRedux/Actions';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryDefs,
} from 'victory-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {dispatch, index, local} from 'd3';
import moment from 'moment';
import Button from '../../Component/Button';
import {showMessage} from 'react-native-flash-message';
const NewProgressScreen = ({navigation}) => {
  const {getUserDataDetails, getHealthData} = useSelector(state => state);
  console.log('=======>userDta', getUserDataDetails.weight, getHealthData);
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState('Weekly');
  const [array, setArray] = useState([]);
  const [getBmi, setBmi] = useState(
    (
      getUserDataDetails?.weight /
      (getUserDataDetails?.height * 0.3048) ** 2
    ).toFixed(2),
  );
  const CurrentWeight = getUserDataDetails?.weight;
  const arrayForData = [];
  useEffect(() => {
    userData();
    // dispatch(setBmi(getBmi))
  }, []);
  const userData = async () => {
    try {
      const res = await axios({
        url: NewAppapi.total_Calories,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: 111,
        },
      });
      if (res) {
        for (i = 1; i < 7; i++) {
          const dayWiseWeight = res.data.data.filter(
            value => value.user_day == i,
          );
          if (dayWiseWeight.length < 1) {
            // do nothing
          } else {
            const weight = dayWiseWeight.map(obj => parseInt(obj.calories));
            const currentWeight =
              getUserDataDetails?.weight -
              (weight.reduce((acc, res) => acc + res, 0) * 0.3) / 500;
            arrayForData.push(currentWeight);
          }
          console.log('sum=====>', arrayForData);
        }
        setArray(arrayForData);
      }
    } catch (error) {
      console.log('Calories Api Error', error);
    }
  };
  const textData = [{value: getBmi}];
  useEffect(() => {
    const currentDate = moment();
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = moment(currentDate).startOf('month');

    const dateArray = Array.from({length: daysInMonth}, (_, index) => {
      const date = moment(firstDayOfMonth).add(index, 'days');
      return {
        month: date.format('MMM'),
        year: date.format('YYYY'),
        date: date.format('DD'),
        day: date.format('dd'),
        isCurrent: date.isSame(moment(), 'day'), // Check if the date is the current date
      };
    });

    setDates(dateArray);
  }, []);
  const RenderCalender = ({minIndex, maxIndex}) => {

    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          justifyContent:
            dates.slice(minIndex, maxIndex).length < 7
              ? 'flex-start'
              : 'space-between',
          marginVertical: 6,
        }}>
        {dates?.slice(minIndex, maxIndex).map((value, index) => (
          <View
            key={index}
            style={{
              backgroundColor: value.isCurrent
                ? AppColor.RED
                : AppColor.BACKGROUNG,
              paddingVertical: value.isCurrent ? 1 : 2,
              paddingHorizontal: value.isCurrent ? 0 : 12,
              borderRadius: value.isCurrent ? 40 / 2 : 8,
              width: value.isCurrent ? 40 : undefined,
              height: value.isCurrent ? 40 : undefined,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: dates.slice(minIndex, maxIndex).length < 7 ? 6 : 0,
            }}>
            <Text
              style={{
                color: value.isCurrent ? AppColor.WHITE : AppColor.Gray5,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                alignSelf: 'center',
              }}>
              {value.date}
            </Text>
            <Text
              key={index}
              style={{
                color: value.isCurrent ? AppColor.WHITE : AppColor.Gray5,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 10,
                alignSelf: 'center',
              }}>
              {value.month}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  const Card_Data = [
    {
      id: 1,
      img: localImage.Fire1,
      txt1: '4',
      txt2: 'KCal',
    },
    {
      id: 2,
      img: localImage.Clock_p,
      txt1: '2',
      txt2: 'Min',
    },
    {
      id: 3,
      img: localImage.Biceps_p,
      txt1: '3',
      txt2: 'Actions',
    },
  ];
  const data2 = [
    {label: 'Weekly', value: '1'},
    {label: 'Daily', value: '2'},
  ];
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const LineText = ({Txt1, Txt2}) => {
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
              color: AppColor.BoldText,
              fontSize: 16,
              fontFamily: 'Poppins-SemiBold',
            }}>
            {Txt1}
          </Text>
        </View>
        {Txt2 ? (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data2}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={value}
            value={value}
            onChange={item => {
              setValue(item.value);
            }}
            renderItem={renderItem}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NewProgressScreen');
            }}>
            <Icons name={'chevron-right'} size={25} color={AppColor.BLACK} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  // console.log('array', array);
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [getUserDataDetails?.weight, ...array],
        color: () => AppColor.RED, // optional
      },
    ],
  };
  const emojiData = [
    {day: 'Sun', value: 2000},
    {day: 'Mon', value: 3500},
    {day: 'Tue', value: 2800},
    {day: 'Wed', value: 8000},
    {day: 'Thu', value: 9900},
    {day: 'Fri', value: 4300},
    {day: 'Sat', value: 6900},
  ];
  const Emojis = [
    {
      id: 1,
      emojis: (
        <Image
          source={localImage.face1}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 2,
      emojis: (
        <Image
          source={localImage.face2}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 3,
      emojis: (
        <Image
          source={localImage.face3}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 4,
      emojis: (
        <Image
          source={localImage.face4}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 5,
      emojis: (
        <Image
          source={localImage.face0}
          style={{height: 25, width: 25}}
          resizeMode="contain"
        />
      ),
    },
  ];
  const RenderEmojis = () => {
    return (
      <View style={{position: 'absolute', alignSelf: 'center', left: 18}}>
        {Emojis.map((value, index) => (
          <View key={index} style={{height: DeviceHeigth * 0.055}}>
            {value.emojis}
          </View>
        ))}
      </View>
    );
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
  const specificDataIndex = 1; // Index of the specific data point you want to emphasize

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
    const HandleSubmitBMI = () => {
      const BMI =
        (selected == '' ? getUserDataDetails?.weight : selected) /
        (getUserDataDetails?.height * 0.3048) ** 2;
      console.log('BMI>>>>>>>', BMI.toFixed(2));
      setBmi(BMI.toFixed(2));
      setModalVisible(false);
    };
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View style={[styles.modalContent, {backgroundColor: AppColor.WHITE}]}>
          <View>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins-SemiBold',
                textAlign: 'center',
                fontSize: 18,
              }}>
              {'Enter your current weight'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginVertical: 8,
              }}>
              <TextInput
                keyboardType="number-pad"
                value={selected}
                onChangeText={text => {
                  if (text == '.') {
                    showMessage({
                      message: 'Wrong Input',
                      type: 'danger',
                      animationDuration: 500,
                      floating: true,
                      icon: {icon: 'auto', position: 'left'},
                    });
                  } else setSelected(text);
                }}
                onFocus={setFocused}
                cursorColor={AppColor.RED}
                placeholder={focused ? selected : getUserDataDetails?.weight}
                placeholderTextColor={focused ? AppColor.RED : AppColor.GRAY1}
                maxLength={3}
                style={{
                  width: DeviceWidth * 0.15,
                  fontSize: 30,
                  fontFamily: 'Poppins-SemiBold',
                  color: AppColor.BLACK,

                  borderColor: focused ? AppColor.RED : AppColor.DARKGRAY,
                  borderBottomWidth: 1,
                  alignSelf: 'center',
                  paddingLeft: 4,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  color: AppColor.BoldText,
                  fontSize: 30,
                  textAlign: 'center',
                }}>
                {'Kg'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: DeviceWidth * 0.4,
              borderRadius: 8,
              alignSelf: 'center',
              marginTop: 20,
            }}
            onPress={() => {
              HandleSubmitBMI();
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
                {'Submit'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  console.log('.........>>>>>', getUserDataDetails);
  return (
    <SafeAreaView style={styles.Container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.box1}>
          <TouchableOpacity style={styles.Feedback_B} activeOpacity={0.5}>
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
                fontWeight:'600'
              }}>
              {'Feedback'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('Report');
            }}>
            <Image
              source={localImage.Settings_v}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileView}>
          <Image
            source={localImage.avt}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            textAlign: 'center',
            marginVertical: 20,
            fontFamily: 'Poppins-Bold',
            color: AppColor.BLACK,
            fontSize: 22,
          }}>
          {'Hi, Jane'}
        </Text>
        <View style={styles.card}>
          {Card_Data.map((value, index) => (
            <View key={index} style={{justifyContent: 'space-between'}}>
              <Image
                source={value?.img}
                style={{width: 40, height: 40}}
                resizeMode="contain"
              />
              <Text
                style={{
                  textAlign: 'center',
                  marginVertical: 15,
                  fontFamily: 'Poppins-SemiBold',
                  color: AppColor.RED,
                }}>
                {value.txt1}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  color: AppColor.DARKGRAY,
                }}>
                {value.txt2}
              </Text>
            </View>
          ))}
        </View>
        <LineText Txt1={'Weight'} Txt2={'Weekly'} />
        <View style={[styles.card,{}]}>
          <LineChart
          style={{paddingRight:30}}
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
            onDataPointClick={data =>
              console.log('PointData=====>', data.value)
            }
            withShadow={false}
            fromZero={true}
          />
        </View>
        <LineText Txt1={'Workout Duration'} Txt2={'Weekly'} />
        <View style={styles.card}>
          <RenderEmojis />

          {/* <BarChart
            data={data}
            width={DeviceWidth * 0.85}
            height={DeviceHeigth * 0.25}
            chartConfig={chartConfig1}
            withInnerLines={false}
            fromZero={true}
          /> */}
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
            width={DeviceWidth * 0.95}>
            <VictoryAxis
              tickValues={emojiData.map((dataPoint, index) => index + 1)}
              tickFormat={emojiData.map(dataPoint => dataPoint.day)}
            />
            <VictoryAxis dependentAxis tickFormat={x => ''} />
            <VictoryBar
              data={emojiData}
              x="day"
              y="value"
              style={{
                data: {
                  fill: AppColor.RED, // Reference to the linear gradient
                },
              }}
            />
          </VictoryChart>
        </View>

        <LineText Txt1={'Monthly Achievement'} />
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
          <RenderCalender minIndex={0} maxIndex={7} />
          <RenderCalender minIndex={7} maxIndex={14} />
          <RenderCalender minIndex={14} maxIndex={21} />
          <RenderCalender minIndex={21} maxIndex={28} />
          <RenderCalender minIndex={28} />
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
                fontFamily: 'Poppins-SemiBold',
                color: AppColor.BoldText,
              }}>
              {'BMI: '}
            </Text>
            <Text style={{fontFamily: 'Poppins-SemiBold', color: '#00A930'}}>
              {getBmi}
            </Text>
          </View>
          <View />
        </View>
        <View style={[styles.card, {flexDirection: 'column',marginBottom:10}]}>
          <View style={{width: DeviceWidth * 0.9, alignSelf: 'center'}}>
            <View
              style={{
                width: 100,
                marginLeft:
                  getBmi > 0 && getBmi <= 18
                    ? DeviceWidth * 0.1
                    : getBmi > 18 && getBmi < 25
                    ? DeviceWidth * 0.35
                    : DeviceWidth * 0.6,
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
                    : 'Over Weight'}
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
            {textData.map((value, index) => (
              <Text
                key={index}
                style={{
                  color: AppColor.BLACK,
                  fontFamily: 'Poppins-SemiBold',
                  width: 100,
                  textAlign: 'center',
                  marginLeft:
                    getBmi > 0 && getBmi <= 18
                      ? DeviceWidth * 0.1
                      : getBmi > 18 && getBmi < 25
                      ? DeviceWidth * 0.35
                      : DeviceWidth * 0.6,
                }}>
                {value.value}
              </Text>
            ))}
            <Text
              style={{color: AppColor.BLACK, fontFamily: 'Poppins-SemiBold'}}>
              {getBmi < 18
                ? (getBmi * 2 + 10).toFixed(0)
                : getBmi > 18 && getBmi < 25
                ? (getBmi * 2).toFixed(0)
                : (getBmi * 2 - 8).toFixed(0)}
            </Text>
          </View>
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
                {"Enter Today's weight"}
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
    padding:5 ,
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
    width: DeviceWidth * 0.6,
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
    marginVertical: 10,
    height: 30,
    width: DeviceWidth * 0.25,
    borderColor: AppColor.RED,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
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
});
export default NewProgressScreen;
