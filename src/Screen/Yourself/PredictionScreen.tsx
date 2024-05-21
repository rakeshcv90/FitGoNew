import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {StatusBar} from 'react-native';
import Bulb from '../Yourself/Bulb';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomBarChart from '../../Component/CustomBarChart';
import {
  Stop,
  Svg,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';

const GradientText = ({item, fontWeight, fontSize, width}: any) => {
  const gradientColors = ['#D5191A', '#941000'];

  return (
    <View style={{marginTop: 10}}>
      <Svg height="40" width={width ? width : item?.length * 10}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Poppins"
          fontWeight={fontWeight ? fontWeight : '600'}
          fontSize={fontSize ? fontSize : '16'}
          fill="url(#grad)"
          x="10"
          y="25">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};
const PredictionScreen = ({navigation, route}: any) => {
  const Av_Cal_Per_KG = 4000; // normally 7500
  const Av_Cal_Per_2_Workout = 250; // Assuming

  const {getLaterButtonData} = useSelector((state: any) => state);
  const [finalDate, setFinalDate] = useState('');
  const [weightHistory, setWeightHistory] = useState<[]>([]);
  const [zeroData, setZeroData] = useState<[]>([]);
  const [currentWeight, setCurrentWeight] = useState(-1);
  const [TargetWeight, setTargetWeight] = useState(-1);

  const mergedObject = Object.assign({}, ...getLaterButtonData);
  useEffect(() => {
    const currentW =
      mergedObject.type === 'kg'
        ? mergedObject.currentWeight
        : mergedObject.currentWeight * 2.2;
    const targetW =
      mergedObject.type === 'kg'
        ? mergedObject.targetWeight
        : mergedObject.targetWeight * 2.2;
    CalculateWeight(currentW, targetW);
    setCurrentWeight(currentW);
    setTargetWeight(targetW);
  }, []);

  const CalculateWeight = (currentWeight: number, TargetWeight: number) => {
    let TotalW = 0;
    let t = 0;

    if (currentWeight > TargetWeight) {
      TotalW = currentWeight - TargetWeight;
    } else {
      TotalW = TargetWeight - currentWeight;
    }

    const totalW_Cal = TotalW * Av_Cal_Per_KG;
    const Result_Number_Of_Days = totalW_Cal / Av_Cal_Per_2_Workout;
    let constantWeightArray = [];
    let weightHistoryArray = [];
    let currentDate = moment();

    let No_Of_Points = 0;
    if (Result_Number_Of_Days <= 30) {
      No_Of_Points = 5;
    } else if (Result_Number_Of_Days > 30 && Result_Number_Of_Days <= 90) {
      No_Of_Points = 15;
    } else if (Result_Number_Of_Days > 90 && Result_Number_Of_Days <= 180) {
      No_Of_Points = 30;
    } else if (Result_Number_Of_Days > 180 && Result_Number_Of_Days <= 365) {
      No_Of_Points = 60;
    } else if (Result_Number_Of_Days > 365 && Result_Number_Of_Days <= 750) {
      No_Of_Points = 120;
    } else {
      No_Of_Points = 240;
    }
    if (currentWeight > TargetWeight) {
      for (let i = Result_Number_Of_Days; i > 0; i -= No_Of_Points) {
        const weight15 =
          ((Result_Number_Of_Days - i) * Av_Cal_Per_2_Workout) / Av_Cal_Per_KG;
        const decWeight = currentWeight - weight15;

        const formattedDate = currentDate.format('YYYY-MM-DD');

        weightHistoryArray.push({
          weight: decWeight.toFixed(2),

          date: formattedDate,
        });
        constantWeightArray.push({weight: 0, date: formattedDate});

        currentDate = currentDate.add(No_Of_Points, 'days');
      }
    } else {
      for (let i = Result_Number_Of_Days; i > 0; i -= No_Of_Points) {
        const weight15 =
          ((Result_Number_Of_Days - i) * Av_Cal_Per_2_Workout) / Av_Cal_Per_KG;
        const decWeight = currentWeight + weight15;
        console.log(weight15, decWeight);
        const formattedDate = currentDate.format('YYYY-MM-DD');

        weightHistoryArray.push({
          weight: decWeight.toFixed(2),

          date: formattedDate,
        });
        constantWeightArray.push({weight: 0, date: formattedDate});

        currentDate = currentDate.add(No_Of_Points, 'days');
      }
    }

    setZeroData(constantWeightArray);
    setWeightHistory(weightHistoryArray);

    weightHistoryArray[weightHistoryArray.length - 1]?.date &&
      setFinalDate(weightHistoryArray[weightHistoryArray.length - 1]?.date);
  };

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={{alignItems: 'center', marginTop: DeviceHeigth * 0.1}}>
        <Text style={styles.t}>
          We predict that you’ll{' '}
          {currentWeight > TargetWeight ? 'lose' : 'gain'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: DeviceWidth,
            marginBottom: -30,
          }}>
          <Text
            style={[
              styles.t,
              {color: AppColor.RED, fontFamily: Fonts.MONTSERRAT_BOLD},
            ]}>
            {currentWeight > TargetWeight
              ? (currentWeight - TargetWeight).toFixed(0)
              : (TargetWeight - currentWeight).toFixed(0)}
          </Text>
          <Text style={styles.t}>Kg by</Text>
          <Text
            style={[
              styles.t,
              {color: AppColor.RED, fontFamily: Fonts.MONTSERRAT_BOLD},
            ]}>
            {finalDate ? moment(finalDate).format('DD MMM YYYY') : ''}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: DeviceHeigth * 0.01,
        }}>
        <Bulb
          header={
            'We have predicted this by analyzing the details shared by you. Start your fitness routine today to achieve your fitness goals with our workout plans.'
          }
        />
        {weightHistory.length != 0 && zeroData.length != 0 && (
          // <View></View>
          <CustomBarChart
            data={weightHistory}
            barWidth={15}
            barColor={'transparent'}
            barSpacing={DeviceWidth * 0.08}
          />
          // <Graph
          //   resultData={weightHistory}
          //   zeroData={zeroData}
          //   home={true}
          //   currentW={currentWeight}
          //   targetW={TargetWeight}
          // />
        )}
      </View>
      {/* <Image
        source={{
          uri: 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/25357fb6-c174-4a3d-995c-77641d9ea900/public',
        }}
        style={[
          styles.Image,
          {
            alignSelf: currentWeight < TargetWeight ? 'flex-start' : 'flex-end',
          },
        ]}
        resizeMode="contain"
      /> */}
      <View
        style={{
          marginTop: 30,
          alignItems: 'center',
          width: DeviceWidth,
        }}>
        <Text style={[styles.t, {fontFamily: Fonts.MONTSERRAT_MEDIUM}]}>
          You can do it!
        </Text>
        <Text style={[styles.t, {fontSize: 16}]}>Keep going</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // toNextScreen()
            navigation.navigate('LoadData');
          }}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: AppColor.BLACK,
  },
  text1: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: '#424242',
  },
  text2: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 35,
    fontFamily: 'Poppins',
    color: 'rgb(197, 23, 20)',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
  },
  t: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 30,
    color: AppColor.BLACK,
    marginTop: 5,
    marginRight: 7,
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.5,
    marginRight: DeviceWidth * 0.05,
  },
});
export default PredictionScreen;
