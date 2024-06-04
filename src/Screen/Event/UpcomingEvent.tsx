import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import ShadowCard from '../../Component/Utilities/ShadowCard';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {useDispatch, useSelector} from 'react-redux';

const UpcomingEvent = ({navigationn}: any) => {
  const dispatch = useDispatch();
  const getInAppPurchase = useSelector((state: any) => state.getInAppPurchase);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader header="Upcoming Contest" shadow />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: 20, flex: 1}}>
        <ShadowCard
          shadow
          mV={DeviceHeigth * 0.05}
          justifyContent={'space-between'}>
          <View style={styles.row}>
            <FitText
              value={`Hi ${getUserDataDetails?.name}`}
              type="SubHeading"
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#A937371A',
                padding: 5,
                paddingVertical: 2,
                borderRadius: 5,
              }}>
              <FitText
                type="SubHeading"
                value="Active"
                color={AppColor.NEW_DARK_RED}
                fontSize={14}
                lineHeight={18}
                fontWeight="600"
              />
            </View>
          </View>
        </ShadowCard>
        <FitText value="Your Plan" type="SubHeading" />
        <ShadowCard shadow mV={DeviceHeigth * 0.05}>
          <Text>UpcomingEvent</Text>
        </ShadowCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
