import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useMemo, useState, useEffect, useRef} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import Loader from '../../Component/Loader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {BmiMeter, BMImodal} from '../../Component/BmiComponent';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {translate} from '../Translation/TranslationService';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import AnimatedReanimated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import FitIcon from '../../Component/Utilities/FitIcon';

const NewMonthlyAchievement = ({navigation}: any) => {
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const getUserDataDetails = useSelector(
    (state: any) => state?.getUserDataDetails,
  );
  const getBmi = useSelector((state: any) => state.getBmi);
  const [ApiData, setApiData] = useState([]);
  const [WokoutCalories, setWorkoutCalories] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    DateWiseData(moment.utc().format('YYYY-MM-DD'));
  }, []);

  const DateWiseData = async (Date1: string) => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('date', Date1);
    payload.append('version', VersionNumber.appVersion);
    try {
      const res = await axios({
        url: NewAppapi.DateWiseData,
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        data: payload,
      });
      if (res?.data?.msg === 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setIsLoaded(true);
      } else if (res) {
        setIsLoaded(true);
        setApiData(res.data.data);

        const Calories = res?.data?.data?.map((value: any) =>
          parseInt(value?.exercise_calories),
        );
        setWorkoutCalories(
          Calories?.reduce((acc: number, num: number) => acc + num, 0),
        );
        setIsLoaded(true);
      }
    } catch (error) {
      console.log('DateWiseDataError', error);
      setIsLoaded(true);
    }
  };

  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={1.5}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.35,
            height: DeviceHeigth * 0.13,
          }}
        />
        <Text style={styles.emptyText}>
          No workout activity logged for this date
        </Text>
      </View>
    );
  };

  const theme = useMemo(() => {
    return {
      calendarBackground: '#FFFFFF',
      selectedDayBackgroundColor: '#667EEA',
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: '#667EEA',
      arrowColor: '#667EEA',
      monthTextColor: '#0F172A',
      indicatorColor: '#667EEA',
      textMonthFontSize: 16,
      textDayFontFamily: Fonts.MONTSERRAT_BOLD,
      textMonthFontFamily: Fonts.MONTSERRAT_BOLD,
      dayTextColor: '#0F172A',
      textSectionTitleColor: '#64748B',
    };
  }, []);

  const bmiVal = parseFloat(getBmi?.Bmi || '0');
  const bmiCategory =
    bmiVal === 0
      ? 'Not Calculated'
      : bmiVal < 18.5
      ? 'Underweight'
      : bmiVal < 25
      ? 'Normal Weight'
      : bmiVal < 30
      ? 'Overweight'
      : 'Obese';

  const bmiCategoryColor =
    bmiVal < 18.5
      ? '#3B82F6'
      : bmiVal < 25
      ? '#10B981'
      : bmiVal < 30
      ? '#F59E0B'
      : '#EF4444';

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Top Header */}
      <NewHeader1 backButton header={translate('report')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 36}}>
        {/* Fitness Progress Hero Banner */}
        <AnimatedReanimated.View
          entering={FadeInDown.duration(400).springify()}
          style={styles.heroSection}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View>
                <Text style={styles.heroTitle}>Monthly Overview</Text>
                <Text style={styles.heroSubtitle}>
                  Track your health metrics & workout logs
                </Text>
              </View>

              <View style={styles.heroBadgeCircle}>
                <FitIcon
                  name="chart-timeline-variant"
                  type="MaterialCommunityIcons"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {/* Quick Hero Stat Chips */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{WokoutCalories}</Text>
                <Text style={styles.heroStatLabel}>Total Kcal</Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{ApiData?.length || 0}</Text>
                <Text style={styles.heroStatLabel}>Exercises</Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>
                  {getBmi?.Bmi ? parseFloat(getBmi.Bmi).toFixed(1) : '--'}
                </Text>
                <Text style={styles.heroStatLabel}>BMI Index</Text>
              </View>
            </View>
          </LinearGradient>
        </AnimatedReanimated.View>

        {/* BMI Section */}
        <AnimatedReanimated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <FitIcon
                name="human"
                type="MaterialCommunityIcons"
                size={20}
                color="#667EEA"
              />
              <Text style={styles.sectionTitle}>{translate('bmi')}</Text>
            </View>

            {getBmi?.Bmi ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                style={styles.editBtn}>
                <FitIcon
                  name="pencil"
                  type="MaterialCommunityIcons"
                  size={14}
                  color="#667EEA"
                />
                <Text style={styles.editBtnText}>{translate('edit')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.card}>
            {getBmi?.Bmi ? (
              <>
                <View style={styles.bmiHeaderRow}>
                  <View style={styles.bmiPillsGroup}>
                    <View style={styles.statPill}>
                      <Text style={styles.statPillLabel}>
                        {translate('weight')}:
                      </Text>
                      <Text style={styles.statPillValue}>
                        {getBmi?.userWeight}
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statPill}>
                      <Text style={styles.statPillLabel}>
                        {translate('height')}:
                      </Text>
                      <Text style={styles.statPillValue}>
                        {getBmi?.userHeight}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bmiMeterWrapper}>
                  <BmiMeter getBmi={getBmi?.Bmi} />
                </View>
              </>
            ) : (
              <View style={styles.bmiEmptyRow}>
                <Text style={styles.bmiEmptyText}>{translate('bmiUnit')}</Text>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => setModalVisible(true)}
                  style={styles.checkBmiBtnWrapper}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.checkBmiBtn}>
                    <Text style={styles.checkBmiBtnText}>
                      {translate('check')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </AnimatedReanimated.View>

        {/* Exercise History & Calendar Section */}
        <AnimatedReanimated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
          style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <FitIcon
                name="calendar-month"
                type="MaterialCommunityIcons"
                size={20}
                color="#667EEA"
              />
              <Text style={styles.sectionTitle}>
                {translate('exerciseHistory')}
              </Text>
            </View>

            <View style={styles.selectedDateBadge}>
              <Text style={styles.selectedDateBadgeText}>
                {moment(getDate).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Calendar
              onDayPress={day => {
                AnalyticsConsole(`${day.dateString.replaceAll('-', '_')}`);
                setDate(day.dateString);
                DateWiseData(day.dateString);
                setIsLoaded(false);
              }}
              allowSelectionOutOfRange={false}
              markingType="period"
              enableSwipeMonths
              hideExtraDays={true}
              hideDayNames={false}
              markedDates={{
                [getDate]: {
                  startingDay: true,
                  color: '#667EEA',
                  endingDay: true,
                  textColor: '#FFFFFF',
                },
                [moment().format('YYYY-MM-DD')]: {
                  marked: true,
                  startingDay: true,
                  selected: true,
                  color: '#E2E8F0',
                  endingDay: true,
                  textColor: '#0F172A',
                  selectedDotColor: '#667EEA',
                },
              }}
              style={styles.calendarStyle}
              theme={theme}
            />

            <View style={styles.calendarDivider} />

            <View style={{marginTop: 14}}>
              {ApiData.length === 0 ? (
                isLoaded ? (
                  <EmptyComponent />
                ) : (
                  <Loader />
                )
              ) : isLoaded ? (
                <>
                  <FlatList
                    data={ApiData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 4}}
                    renderItem={({item}: any) => {
                      return (
                        <View style={styles.exerciseCardItem}>
                          <Image
                            source={{uri: item.exercise_image_link}}
                            style={styles.exerciseImg}
                            resizeMode="contain"
                          />
                          <View style={styles.exerciseTitleBox}>
                            <Text
                              numberOfLines={1}
                              style={styles.exerciseTitleText}>
                              {item.exercise_title}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    keyExtractor={(_, index) => index.toString()}
                  />

                  {/* High-End Metric Cards */}
                  <View style={styles.metricsGridRow}>
                    <View style={styles.metricCard}>
                      <LinearGradient
                        colors={['#FF6B6B', '#FF8E53']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.metricIconBox}>
                        <FitIcon
                          name="fire"
                          type="MaterialCommunityIcons"
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.metricCardLabel}>Total Kcal</Text>
                        <Text style={styles.metricCardValue}>
                          {WokoutCalories}{' '}
                          <Text style={styles.metricCardUnit}>kcal</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metricCard}>
                      <LinearGradient
                        colors={['#667EEA', '#764BA2']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.metricIconBox}>
                        <FitIcon
                          name="dumbbell"
                          type="MaterialCommunityIcons"
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.metricCardLabel}>Exercises</Text>
                        <Text style={styles.metricCardValue}>
                          {ApiData?.length}{' '}
                          <Text style={styles.metricCardUnit}>completed</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <Loader />
              )}
            </View>
          </View>
        </AnimatedReanimated.View>
      </ScrollView>

      {/* BMI Edit Modal */}
      <BMImodal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        dispatch={dispatch}
      />
    </Wrapper>
  );
};

export default NewMonthlyAchievement;

const styles = StyleSheet.create({
  heroSection: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#E0E7FF',
    marginTop: 2,
  },
  heroBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#E0E7FF',
    marginTop: 1,
  },
  heroStatDivider: {
    height: 24,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
    fontWeight: '700',
  },
  selectedDateBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  selectedDateBadgeText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  // BMI Card Layout
  bmiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bmiPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: '100%',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statPillLabel: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
  },
  statPillValue: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#0F172A',
    fontWeight: '800',
  },
  statDivider: {
    height: 14,
    width: 1,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  bmiStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  bmiStatusText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },

  bmiMeterWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },

  bmiEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  bmiEmptyText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#0F172A',
  },
  checkBmiBtnWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  checkBmiBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  checkBmiBtnText: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Calendar
  calendarStyle: {
    borderRadius: 16,
    width: '100%',
  },
  calendarDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
  },

  // Exercise Items
  exerciseCardItem: {
    width: 95,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    overflow: 'hidden',
  },
  exerciseImg: {
    height: 65,
    width: 65,
    marginVertical: 6,
  },
  exerciseTitleBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  exerciseTitleText: {
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
  },

  // Metrics Grid
  metricsGridRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricCardLabel: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
  },
  metricCardValue: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#0F172A',
    fontWeight: '800',
    marginTop: 1,
  },
  metricCardUnit: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    fontWeight: '500',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 4,
  },
});
