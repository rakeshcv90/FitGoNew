import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Fonts} from '../../../../Component/Color';

type ExerciseTimerProps = {
  seconds: number;
  currentSet: number;
  totalSets: number;
  exerciseTitle: string;
  restStart: boolean
};

const ExerciseTimer = ({
  seconds,
  currentSet,
  totalSets,
  exerciseTitle,
  restStart
}: ExerciseTimerProps) => {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return (
    <View
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: '600',
          fontFamily: Fonts.HELVETICA_BOLD,
          lineHeight: 54,
          color: '#1F2937',
        }}>
        {remainingSeconds > 9
          ? `0${minutes}:${remainingSeconds}`
          : `0${minutes}:0${remainingSeconds}`}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: '#1F2937',
            fontFamily: Fonts.HELVETICA_REGULAR,
            fontSize: 16,
            lineHeight: 25,
            fontWeight: '600',
          }}>
          {exerciseTitle}
        </Text>
        {totalSets > 0 && !restStart && (
          <>
            <Text
              style={{
                color: '#1F2937',
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 16,
                lineHeight: 25,
                fontWeight: '600',
              }}>
              {' · '}
            </Text>
            <View
              style={{
                padding: 2,
                paddingHorizontal: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#EBEDF0',
              }}>
              <Text
                style={{
                  color: '#6B7280',
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: '600',
                }}>
                {currentSet}/{totalSets}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ExerciseTimer;

const styles = StyleSheet.create({});
