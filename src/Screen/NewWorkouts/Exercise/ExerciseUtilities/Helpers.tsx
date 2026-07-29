import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tts from 'react-native-tts';
import {AppColor, Fonts} from '../../../../Component/Color';
import {DeviceWidth} from '../../../../Component/Config';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {getCurrentLanguage, translate} from '../../../Translation/TranslationService';

const songs = [];

function resolveImportedAssetOrPath(pathOrAsset: any) {
  return pathOrAsset === undefined
    ? undefined
    : typeof pathOrAsset === 'string'
    ? pathOrAsset
    : resolveImportedAsset(pathOrAsset);
}

function resolveImportedAsset(id: number) {
  return id ? resolveAssetSource(id)?.uri ?? undefined : undefined;
}

const lang = getCurrentLanguage();

const initTts = async () => {
  const ttsStatus: any = await Tts.getInitStatus();
  if (!ttsStatus.isInitialized) {
    if (lang === 'en') {
      await Tts.setDefaultLanguage('en-IN');
    } else {
      await Tts.setDefaultLanguage('pt-BR');
    }
    await Tts.setDucking(true);
    await Tts.setIgnoreSilentSwitch(true);
    await Tts.addEventListener('tts-finish', event => {
      Tts.stop();
    });
  }
};

const handleExerciseChange = (exerciseName: string, getStoreVideoLoc: any) => {
  if (getStoreVideoLoc.hasOwnProperty(exerciseName)) {
    // setCurrentVideo(getStoreVideoLoc[exerciseName]);
  } else {
    console.error(`Exercise "${exerciseName}" video not found.`);
  }
};

const PauseModal = ({
  back,
  quitLoader,
  setBack,
  number,
  exerciseLength,
  quitFunction,
  resumeButton,
}: any) => {
  const percentFinished = ((number / exerciseLength) * 100).toFixed(0);
  const remaining = exerciseLength - number;

  return (
    <Modal
      visible={back}
      onRequestClose={() => setBack(false)}
      animationType="slide">
      <View style={styles.modalRoot}>
        {/* Card Container */}
        <View style={styles.cardContainer}>
          {/* Flame Motivator Badge */}
          <View style={styles.iconCircleWrap}>
            <LinearGradient
              colors={['#FFF1F2', '#FFE4E6']}
              style={styles.iconCircleGradient}>
              <Icon name="fire" size={44} color="#E11D48" />
            </LinearGradient>
          </View>

          {/* Motivational Headlines */}
          <Text style={styles.headlineTitle}>{translate('keepGoing')}</Text>
          <Text style={styles.headlineSub}>{translate('dontGiveUp')}</Text>

          {/* Stats Badges Row */}
          <View style={styles.statsCardRow}>
            <View style={styles.statPillRed}>
              <Icon name="chart-donut" size={16} color="#E11D48" />
              <Text style={styles.statPillRedText}>{percentFinished}% Finished</Text>
            </View>
            <View style={styles.statPillGray}>
              <Icon name="format-list-numbered" size={16} color="#374151" />
              <Text style={styles.statPillGrayText}>{remaining} Left</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionColumn}>
            {/* Resume Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={resumeButton}
              style={styles.resumeTouch}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.resumeGradient}>
                <Icon name="play" size={20} color="#FFFFFF" />
                <Text style={styles.resumeText}>{translate('resume')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={quitFunction}
              style={styles.quitBtn}>
              {quitLoader ? (
                <ActivityIndicator animating color="#E11D48" size="small" />
              ) : (
                <Text style={styles.quitBtnText}>{translate('quit')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: DeviceWidth * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconCircleWrap: {
    marginBottom: 20,
  },
  iconCircleGradient: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FECDD3',
  },
  headlineTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#E11D48',
    textAlign: 'center',
  },
  headlineSub: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#111827',
    textAlign: 'center',
    marginTop: 2,
  },
  statsCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 28,
  },
  statPillRed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statPillRedText: {
    color: '#E11D48',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '700',
  },
  statPillGray: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statPillGrayText: {
    color: '#374151',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '700',
  },
  actionColumn: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  resumeTouch: {
    width: '100%',
  },
  resumeGradient: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resumeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
  quitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quitBtnText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
});

export {
  initTts,
  handleExerciseChange,
  PauseModal,
  songs,
  resolveImportedAssetOrPath,
};
