import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import {AppColor, Fonts} from '../Component/Color';
import NewHeader1 from '../Component/Headers/NewHeader1';
import Wrapper from './WorkoutCompleteScreen/Wrapper';
import AnimatedReanimated, {FadeInDown} from 'react-native-reanimated';
import FitIcon from '../Component/Utilities/FitIcon';
import LinearGradient from 'react-native-linear-gradient';

const TermaAndCondition = ({route, navigation}: any) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const {defaultTheme} = useSelector((state: any) => state);

  const pageTitle = route?.params?.title || 'Terms & Conditions';
  const webUri =
    pageTitle === 'Privacy Policy'
      ? 'https://thefitnessandworkout.com/privacy-policy/'
      : 'https://thefitnessandworkout.com/terms-condition/';

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Top Navigation Header */}
      <NewHeader1 header={pageTitle} backButton />

      {/* Document Subheader Badge */}
      <AnimatedReanimated.View
        entering={FadeInDown.duration(400).springify()}
        style={styles.subHeaderCard}>
        <View style={styles.subHeaderBadgeRow}>
          <View style={styles.subHeaderIconBox}>
            <FitIcon
              name="shield-check"
              type="MaterialCommunityIcons"
              size={18}
              color="#667EEA"
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.subHeaderTitle}>Official Legal Document</Text>
            <Text style={styles.subHeaderSub}>
              FitMe App Terms, User Privacy & Policies
            </Text>
          </View>
        </View>
      </AnimatedReanimated.View>

      {/* WebView Container */}
      <AnimatedReanimated.View
        entering={FadeInDown.delay(100).duration(400).springify()}
        style={styles.webViewWrapper}>
        
        {/* Custom Premium Loading Screen Overlay */}
        {isLoaded && (
          <View style={styles.loaderOverlay}>
            <View style={styles.loaderCard}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.loaderIconCircle}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.loaderText}>Loading Policy Document...</Text>
              <Text style={styles.loaderSub}>Connecting to secure server</Text>
            </View>
          </View>
        )}

        <WebView
          source={{uri: webUri}}
          style={styles.webView}
          onLoad={() => setIsLoaded(false)}
          onLoadStart={() => setIsLoaded(true)}
          showsVerticalScrollIndicator={false}
        />
      </AnimatedReanimated.View>
    </Wrapper>
  );
};

export default TermaAndCondition;

const styles = StyleSheet.create({
  subHeaderCard: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  subHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subHeaderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  subHeaderSub: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1,
  },

  webViewWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 250, 252, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  loaderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loaderText: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  loaderSub: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 2,
  },
});
