import {View, Text, StyleSheet, Platform, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import FitIcon from '../../Component/Utilities/FitIcon';

const AVATAR_BG_COLORS = ['#FFE4E6', '#EDE9FE', '#D1FAE5', '#DBEAFE'];
const AVATAR_TEXT_COLORS = [AppColor.RED, '#7C3AED', '#059669', '#2563EB'];

const PastWinnersComponent = ({pastWinners}: {pastWinners: any}) => {
  const handleButtonPress = () => {
    navigate('PastWinner', {
      pastWinners: pastWinners,
    });
  };

  if (!pastWinners || pastWinners?.length <= 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatarStack}>
          {pastWinners?.slice(0, 4)?.map((item: any, index: number) => {
            const isOverflowBadge = index === 3;
            const bg = AVATAR_BG_COLORS[index % AVATAR_BG_COLORS.length];
            const textColor = AVATAR_TEXT_COLORS[index % AVATAR_TEXT_COLORS.length];

            return (
              <View
                key={item?.id ?? index}
                style={[styles.avatarCircle, {left: index * 24, backgroundColor: bg}]}>
                {isOverflowBadge ? (
                  <Text style={[styles.badgeText, {color: AppColor.RED}]}>
                    +{pastWinners?.length - 3}
                  </Text>
                ) : item?.image != null ? (
                  <Image
                    source={{uri: item?.image}}
                    style={styles.avatarImg}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[styles.badgeText, {color: textColor}]}>
                    {item?.name ? item.name.substring(0, 1).toUpperCase() : 'W'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleButtonPress}
        style={styles.winnersBtn}>
        <FitIcon
          type="MaterialCommunityIcons"
          name="trophy-outline"
          size={16}
          color={AppColor.RED}
        />
        <Text style={styles.winnersBtnText}>Past Winners</Text>
        <FitIcon
          type="MaterialCommunityIcons"
          name="chevron-right"
          size={16}
          color={AppColor.RED}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PastWinnersComponent;

const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    height: 40,
    width: 112,
    position: 'relative',
  },
  avatarCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: AppColor.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  badgeText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '800',
  },
  winnersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  winnersBtnText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12,
    fontWeight: '700',
    color: AppColor.RED,
  },
});
