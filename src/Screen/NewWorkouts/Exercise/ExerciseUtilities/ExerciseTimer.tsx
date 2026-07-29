import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {FadeIn, ZoomIn} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '../../../../Component/Color';

type ExerciseTimerProps = {
  seconds: number;
  currentSet: number;
  totalSets: number;
  exerciseTitle: string;
  restStart: boolean;
};

const ExerciseTimer = ({
  seconds,
  currentSet,
  totalSets,
  exerciseTitle,
  restStart,
}: ExerciseTimerProps) => {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  const formattedTime =
    remainingSeconds > 9
      ? `0${minutes}:${remainingSeconds}`
      : `0${minutes}:0${remainingSeconds}`;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {/* Large Pink Timer */}
      <Text style={styles.timerText}>{formattedTime}</Text>

      {/* Exercise Title */}
      <Text numberOfLines={1} style={styles.titleText}>
        {exerciseTitle}
      </Text>

      {/* Set Badge */}
      {totalSets > 0 && !restStart && (
        <Animated.View entering={ZoomIn.delay(200).duration(300)}>
          <View style={styles.setBadge}>
            <Icon name="layers-outline" size={13} color="#10B981" />
            <Text style={styles.setText}>
              Set {currentSet}/{totalSets}
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default ExerciseTimer;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 6,
  },
  timerText: {
    fontSize: 52,
    fontWeight: '800',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#E11D48',
    letterSpacing: -1,
    marginBottom: 2,
  },
  titleText: {
    color: '#6B7280',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 220,
    textAlign: 'center',
    marginBottom: 6,
  },
  setBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  setText: {
    color: '#059669',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12,
    fontWeight: '700',
  },
});
