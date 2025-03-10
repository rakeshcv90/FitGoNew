import {
    ColorValue,
    Modal,
    ModalProps,
    StyleSheet,
    Text,
    View,
    ViewStyle,
  } from 'react-native';
  import React, {ReactNode} from 'react';
import FitText, { FitTextProps } from './FitText';
import PredefinedStyles from './PredefineStyles';
import { AppColor } from '../Color';
import { DeviceWidth } from '../Config';
import FitIcon from './FitIcon';
  
  type ModalContainerProps = {
    openModal: boolean;
    handleModal: () => void;
    backDropStyle?: ViewStyle;
    mainViewStyle?: ViewStyle;
    headerContainerStyle?: ViewStyle;
    modalProps?: ModalProps;
    closeButton?: boolean;
    heading?: string;
    children: ReactNode;
    position?: 'top' | 'center' | 'bottom';
    headerTextDetails?: Partial<FitTextProps>;
    closeIconColor?: ColorValue
  };
  
  const ModalContainer = ({
    openModal,
    handleModal,
    backDropStyle,
    mainViewStyle,
    headerContainerStyle,
    modalProps,
    closeButton = true,
    heading = '',
    position = 'center',
    children,
    headerTextDetails,
    closeIconColor = AppColor.BLACK
  }: ModalContainerProps) => {
    return (
      <Modal
        visible={openModal}
        onRequestClose={handleModal}
        animationType="slide"
        transparent
        {...modalProps}>
        <View
          style={[
            PredefinedStyles.FlexCenter,
            {
              backgroundColor: '#00000099',
              justifyContent:
                position == 'top'
                  ? 'flex-start'
                  : position == 'center'
                  ? 'center'
                  : 'flex-end',
            },
            backDropStyle,
          ]}>
          <View
            style={[
              styles.whiteContainer,
              {
                width: DeviceWidth * 0.8,
                height: DeviceWidth * 0.8,
                // backgroundColor: BACKGROUND_THEME,
              },
              mainViewStyle,
            ]}>
            <View
              style={[
                PredefinedStyles.rowBetween,
                {justifyContent: 'space-between'},
                headerContainerStyle,
              ]}>
              <View style={{width: 20}} />
              <FitText type="Heading" value={heading} {...headerTextDetails} />
              {closeButton ? (
                <FitIcon
                  name="close"
                  size={20}
                  type="AntDesign"
                  color={closeIconColor}
                  onPress={handleModal}
                />
              ) : (
                <View style={{width: 20}} />
              )}
            </View>
            {children}
          </View>
        </View>
      </Modal>
    );
  };
  
  export default ModalContainer;
  
  const styles = StyleSheet.create({
    whiteContainer: {
      padding: 10,
      borderRadius: 10,
    },
  });