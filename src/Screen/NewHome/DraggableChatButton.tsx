import React, {useRef} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from '../../Component/Color';
import FitIcon from '../../Component/Utilities/FitIcon';

type Props = {
  onPress: () => void;
};

const BUTTON_SIZE = 48;
const CONTAINER_SIZE = 60;
const INITIAL_RIGHT = 12;
const INITIAL_BOTTOM = 20;

const DraggableChatButton = ({onPress}: Props) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        isDragging.current = false;
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          isDragging.current = true;
        }
        pan.setValue({x: gestureState.dx, y: gestureState.dy});
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        if (!isDragging.current) {
          onPress();
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableContainer,
        {
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.touchableArea}
        onPress={() => {
          if (!isDragging.current) {
            onPress();
          }
        }}>
        <LinearGradient
          colors={[AppColor.RED, '#C2255C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientButton}>
          <FitIcon
            name="chat-processing"
            size={24}
            type="MaterialCommunityIcons"
            color={AppColor.WHITE}
          />
        </LinearGradient>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DraggableChatButton;

const styles = StyleSheet.create({
  draggableContainer: {
    position: 'absolute',
    bottom: INITIAL_BOTTOM,
    right: INITIAL_RIGHT,
    zIndex: 999,
  },
  touchableArea: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  aiBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: AppColor.RED,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aiBadgeText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 9,
    fontWeight: '800',
    color: AppColor.RED,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 11,
  },
});
