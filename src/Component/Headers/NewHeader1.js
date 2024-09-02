import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {AppColor, Fonts} from '../Color';
import {ArrowLeft} from '../Utilities/Arrows/Arrow';
import {localImage} from '../Image';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const NewHeader1 = ({
  header,
  backButton,
  onBackPress,
  icon,
  iconType,
  iconSource,
  onIconPress,
  materialIconName,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {backButton && (
        <TouchableOpacity
          style={styles.backButtonStyle}
          onPress={
            onBackPress ??
            (() => {
              navigation.goBack();
            })
          }>
          <ArrowLeft />
        </TouchableOpacity>
      )}
      {header && <Text style={styles.headerStyle}>{header}</Text>}
      {icon && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconStyle}>
          {iconType == 'icon' ? (
            <MaterialIcon name={materialIconName} size={25} />
          ) : (
            <Image
              source={iconSource}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    color: AppColor.BLACK,
    fontFamily: Fonts.HELVETICA_BOLD,
    fontSize: 20,
  },
  backButtonStyle: {
    position: 'absolute',
    left: 16,
    padding:3
  },
  iconStyle: {
    position: 'absolute',
    right: 12,
  },
});
export default NewHeader1;
