import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import FitText from '../../Component/Utilities/FitText';
import {QuestionsArray, QuestionsArrayType} from './QuestionsArray';
import {AppColor} from '../../Component/Color';
import {navigationRef} from '../../../App';
import FitIcon from '../../Component/Utilities/FitIcon';
import { AnalyticsConsole } from '../../Component/AnalyticsConsole';

const Questions = ({route, navigation}: any) => {
  const RenderItem = useMemo(
    () => (item: QuestionsArrayType, index: number) => {
      return (
        <>
          <TouchableOpacity
            key={index}
            onPress={() =>{
              AnalyticsConsole(`Q_${item?.id}`)
              navigation.navigate('ChatBot', {
                quesNo: item.id,
                screenName: route.params?.screenName,
              })
            }}
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              padding: 2,
              width: '95%',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 5
            }}>
            <View style={{width: '95%'}}>
              <FitText
                type="SubHeading"
                color="#707070"
                value={item.question}
                textAlign="justify"
              />
            </View>
            <View style={{width: '10%', alignItems: 'flex-end'}}>
              <FitIcon
                type="AntDesign"
                color="#D5191A"
                name="right"
                size={15}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              backgroundColor: '#DEDEDE',
              height: 1,
              marginBottom: 10,
            }}
          />
        </>
      );
    },
    [],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader header="Frequently Asked Questions" shadow />
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          marginBottom: 20,
        }}>
        <FlatList
          data={QuestionsArray}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: any) => RenderItem(item, index)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Questions;

const styles = StyleSheet.create({});
