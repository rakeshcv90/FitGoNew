import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import { translate } from '../Translation/TranslationService';

const adjustArray = [
  {
    image: localImage.Workout,
    text: translate('withEquipment'),
  },
  {
    image: require('../../Icon/Images/NewHome/WithoutEquipment.png'),
    text: translate('withoutEquipment'),
  },
];

type Props = {
  bottomSheetRef: React.Ref<any>;
  getEquipmentExercise: number;
  filterExercises: (value: number) => void
};

const AdjustCard = ({
  item,
  isSelected,
  onPress,
}: {
  item: {image: any; text: string};
  isSelected: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.03, {damping: 12, stiffness: 240});
      imageScale.value = withSpring(1.08, {damping: 12, stiffness: 240});
      badgeScale.value = withSequence(
        withTiming(1.3, {duration: 100}),
        withSpring(1, {damping: 10, stiffness: 260}),
      );
    } else {
      scale.value = withSpring(1, {damping: 12, stiffness: 240});
      imageScale.value = withSpring(1, {damping: 12, stiffness: 240});
    }
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{scale: badgeScale.value}],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{scale: imageScale.value}],
  }));

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={{flex: 1}}>
      <Animated.View style={[styles.filterCard, cardStyle]}>
        {isSelected ? (
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.filterCardInner}>
            <Animated.View style={[styles.filterCardBadge, badgeStyle]}>
              <FitIcon
                type="MaterialCommunityIcons"
                name="check-bold"
                size={12}
                color="#E11D48"
              />
            </Animated.View>
            <Animated.View style={[styles.filterCardImageCircle, imageStyle]}>
              <Image
                source={item.image}
                style={styles.filterCardImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.filterCardTitleActive} numberOfLines={1}>
              {item.text}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.filterCardInactive}>
            <Animated.View style={[styles.filterCardImageCircle, imageStyle]}>
              <Image
                source={item.image}
                tintColor={AppColor.SecondaryTextColor}
                style={styles.filterCardImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.filterCardTitleInactive} numberOfLines={1}>
              {item.text}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const BottomSheetContent: FC<Props> = ({
  bottomSheetRef,
  getEquipmentExercise,
  filterExercises,
}) => {
  const [adjustSelected, setAdjustSelelcted] = useState(getEquipmentExercise);
  const isFilterChanged = adjustSelected !== getEquipmentExercise; // extra condition for adjust change detection
  return (
    <View style={styles.sheetMainContainer}>
      <View style={styles.sheetHeaderRow}>
        <View style={{width: 32}} />
        <Text style={styles.sheetFilterTitle}>
          {translate('adjustTitle')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            AnalyticsConsole('CL_BS_FW');
            bottomSheetRef.current?.closeSheet();
          }}
          style={styles.sheetCloseBtn}>
          <FitIcon
            type="MaterialCommunityIcons"
            name={'close'}
            size={20}
            color="#374151"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sheetHeaderDivider} />

      <View style={styles.sheetCardsRow}>
        {adjustArray.map((item, index) => (
          <AdjustCard
            key={index}
            item={item}
            isSelected={adjustSelected == index}
            onPress={() => setAdjustSelelcted(index)}
          />
        ))}
      </View>

      <View style={styles.sheetHeaderDivider} />

      <View style={styles.sheetFooterRow}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!isFilterChanged}
          onPress={() => {
            filterExercises(adjustSelected);
          }}>
          <LinearGradient
            colors={[AppColor.RED, '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[
              styles.showResultGradientBtn,
              !isFilterChanged && {opacity: 0.5},
            ]}>
            <Text style={styles.showResultBtnText}>
              {translate('showResult')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomSheetContent;

const styles = StyleSheet.create({
  sheetMainContainer: {
    width: DeviceWidth,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  sheetFilterTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  sheetCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  filterCard: {
    width: '100%',
    height: 84,
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterCardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterCardInactive: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1.5,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  filterCardBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCardImageCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterCardImage: {
    width: 24,
    height: 24,
  },
  filterCardTitleActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  filterCardTitleInactive: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#374151',
  },
  sheetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 4,
  },
  showResultGradientBtn: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  showResultBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
});
