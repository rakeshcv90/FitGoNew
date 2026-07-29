import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '../../../../Component/Color';
import {DeviceWidth} from '../../../../Component/Config';

type RestButtonsProps = {
  seconds: number;
  setRestSet: Function;
  setSeconds: Function;
  reset: Function;
};

const RestButtons = ({
  setRestSet,
  setSeconds,
  reset,
  seconds,
}: RestButtonsProps) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleAddFive = () => {
    if (!isButtonClicked) {
      setIsButtonClicked(true);
      setSeconds(seconds + 5);
    }
  };

  const handleSkip = () => {
    setRestSet(false);
    reset();
  };

  return (
    <View style={styles.container}>
      {/* +5 sec Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isButtonClicked}
        onPress={handleAddFive}
        style={[
          styles.outlineBtn,
          isButtonClicked && styles.outlineBtnDisabled,
        ]}>
        <Icon
          name="plus-circle-outline"
          size={16}
          color={isButtonClicked ? '#9CA3AF' : '#E11D48'}
        />
        <Text
          style={[
            styles.outlineBtnText,
            isButtonClicked && styles.outlineBtnTextDisabled,
          ]}>
          +5 sec
        </Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleSkip}
        style={styles.skipTouch}>
        <LinearGradient
          colors={['#FF2A54', '#E11D48']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.skipGradient}>
          <Icon name="skip-next" size={16} color="#FFFFFF" />
          <Text style={styles.skipText}>Skip</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default RestButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginVertical: 18,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    gap: 6,
    minWidth: DeviceWidth * 0.28,
  },
  outlineBtnDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  outlineBtnText: {
    color: '#E11D48',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineBtnTextDisabled: {
    color: '#9CA3AF',
  },
  skipTouch: {
    minWidth: DeviceWidth * 0.28,
  },
  skipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  skipText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
  },
});
