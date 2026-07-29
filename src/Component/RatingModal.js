import {
  View,
  Text,
  StyleSheet,
  Modal,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import AnimatedReanimated, {
  ZoomIn,
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import {AppColor, Fonts} from './Color';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from './Config';
import {localImage} from './Image';
import Octicons from 'react-native-vector-icons/Octicons';
import {APP_STORE_LINK, PLAY_STORE_LINK} from './ReviewApp';
import {useDispatch, useSelector} from 'react-redux';
import {setRatingTrack} from './ThemeRedux/Actions';
import LinearGradient from 'react-native-linear-gradient';
import FitIcon from './Utilities/FitIcon';

const RatingModal = ({getVisibility, setModalVisibilty}: any) => {
  const [rating, setRating] = useState(5);
  const getRatingStatus = useSelector((state: any) => state?.getRatingStatus);
  const [visibiltity, setVisibility] = useState(getRatingStatus);
  const dispatch = useDispatch();

  // Floating continuous loop animation for illustration
  const floatAnim = useRef(new Animated.Value(0)).current;
  const starScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const dataArray = [
    {
      id: 0,
      img: localImage.Rating1,
      txt2: 'Disappointed 😔',
      color: '#EF4444',
      startCount: 1,
    },
    {
      id: 1,
      img: localImage.Rating2,
      txt2: 'Unhappy 🙁',
      color: '#F97316',
      startCount: 2,
    },
    {
      id: 2,
      img: localImage.Rating3,
      txt2: 'Cool 😊',
      color: '#3B82F6',
      startCount: 3,
    },
    {
      id: 3,
      img: localImage.Rating4,
      txt2: 'Great Progress! 👍',
      color: '#10B981',
      startCount: 4,
    },
    {
      id: 4,
      img: localImage.Rating5,
      txt2: 'Awesome Experience! 🌟',
      color: '#F59E0B',
      startCount: 5,
    },
  ];

  const [getImage, setImage] = useState(dataArray[4]?.img);
  const [getTxt2, setTxt2] = useState(dataArray[4]?.txt2);
  const [activeColor, setActiveColor] = useState(dataArray[4]?.color);
  const star = [1, 2, 3, 4, 5];

  const handleRating = (index: number) => {
    setRating(index + 1);
    setTxt2(dataArray[index]?.txt2);
    setImage(dataArray[index]?.img);
    setActiveColor(dataArray[index]?.color);

    Animated.sequence([
      Animated.timing(starScaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(starScaleAnim, {
        toValue: 1.0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openPlayStoreForRating = () => {
    const storeUrl = Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK;
    Linking.openURL(storeUrl)
      .then(() => {
        setModalVisibilty
          ? setModalVisibilty(false)
          : dispatch(setRatingTrack(true));
        setVisibility(true);
      })
      .catch(err => {
        console.error('Error opening Store:', err);
      });
  };

  const isVisible = getVisibility ? getVisibility : !visibiltity;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => {
        setModalVisibilty ? setModalVisibilty(false) : setVisibility(true);
      }}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(15, 23, 42, 0.65)" />

      <View style={styles.modalBackdrop}>
        <AnimatedReanimated.View
          entering={ZoomIn.duration(350).springify()}
          layout={Layout.springify()}
          style={styles.modalCard}>
          
          {/* Top Close Circle */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setModalVisibilty
                ? setModalVisibilty(false)
                : setVisibility(true);
            }}
            style={styles.closeCircleBtn}>
            <MaterialIcons name="close" size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Dynamic Floating Illustration */}
          <Animated.View
            style={[
              styles.illustrationBox,
              {
                transform: [
                  {translateY: floatAnim},
                  {scale: starScaleAnim},
                ],
              },
            ]}>
            <Image
              source={getImage}
              style={styles.ratingImg}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Rating Header */}
          <Text style={styles.ratingTitle}>Enjoying FitMe App?</Text>
          <Text style={styles.ratingSubtitle}>
            Rate your experience to help us improve & keep you motivated!
          </Text>

          {/* Dynamic Emotion Status Pill */}
          <AnimatedReanimated.View
            layout={Layout.springify()}
            style={[
              styles.emotionBadge,
              {backgroundColor: activeColor + '1E', borderColor: activeColor + '40'},
            ]}>
            <Text style={[styles.emotionBadgeText, {color: activeColor}]}>
              {getTxt2}
            </Text>
          </AnimatedReanimated.View>

          {/* Interactive Star Rating Bar */}
          <View style={styles.starsRow}>
            {star.map((value, index) => {
              const isFilled = value <= rating;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => handleRating(index)}
                  style={styles.starTouch}>
                  <Octicons
                    name={isFilled ? 'star-fill' : 'star'}
                    color={isFilled ? '#F59E0B' : '#CBD5E1'}
                    size={28}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={openPlayStoreForRating}
            style={styles.submitBtnWrapper}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit & Rate App</Text>
              <FitIcon
                name="arrow-forward"
                type="Ionicons"
                size={16}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedReanimated.View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  closeCircleBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },

  illustrationBox: {
    width: DeviceWidth * 0.45,
    height: DeviceHeigth * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  ratingImg: {
    width: '100%',
    height: '100%',
  },

  ratingTitle: {
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  ratingSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 10,
  },

  emotionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 12,
    marginBottom: 4,
  },
  emotionBadgeText: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 8,
  },
  starTouch: {
    padding: 4,
  },

  submitBtnWrapper: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 14,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
