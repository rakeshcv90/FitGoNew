import {
  FlatList,
  Image,
  ImageStyle,
  Modal,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../Color';
import FitText from './FitText';
import FitIcon from './FitIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {DeviceHeigth} from '../Config';
import {Platform} from 'react-native';

type FitDropdownProps<T> = {
  data: Array<T>;
  dropdownContainerStyle?: ViewStyle;
  listContainerStyle?: ViewStyle;
  selectedTextStyle?: TextStyle;
  itemStyle?: TextStyle;
  imageStyle?: ImageStyle;
  floatingTextStyle?: TextStyle;
  containerWidth?: number;
  mV?: number;
  padding?: number;
  selectedValue: string;
  onChange: (item: any) => void;
  CustomArrow?: () => React.ReactNode;
  floatingText: string;
  textDisplayKey: keyof T;
  imageDisplayKey: keyof T;
  showItemIcons?: boolean;
  listContainerHeight?: number;
  floatingTextAnimation?: boolean;
  multiSelect?: boolean;
  showLabelsOnMultiSelect?: boolean;
};

type RenderItemProps<T> = {
  item: T;
  index: number;
  onSelect: (item: T) => void;
  textDisplayKey: keyof T;
  imageDisplayKey: keyof T;
  itemStyle?: TextStyle;
  imageStyle?: ImageStyle;
  showItemIcons?: boolean;
  isSelected: boolean;
};

const RenderItem = <T extends object>({
  item,
  onSelect,
  textDisplayKey,
  imageDisplayKey,
  showItemIcons,
  itemStyle,
  imageStyle,
  isSelected,
  index,
}: RenderItemProps<T>) => {
  const img = item[imageDisplayKey];
  const uriORlocal = typeof img === 'number';

  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      style={[
        itemStyle,
        {
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isSelected ? AppColor.GRAY1 : AppColor.WHITE,
        },
      ]}>
      {showItemIcons && (
        <Image
          source={uriORlocal ? img : {uri: String(img)}}
          style={[imageStyle, {width: 20, height: 20, marginRight: 10}]}
        />
      )}
      <FitText type="normal" value={String(item[textDisplayKey])} />
    </TouchableOpacity>
  );
};

const FitDropdown = <T extends object>({
  data,
  dropdownContainerStyle,
  listContainerStyle,
  selectedTextStyle,
  floatingTextStyle,
  itemStyle,
  imageStyle,
  containerWidth,
  mV,
  padding = 20,
  onChange,
  selectedValue,
  CustomArrow,
  floatingText,
  imageDisplayKey,
  textDisplayKey,
  showItemIcons,
  listContainerHeight = DeviceHeigth * 0.15,
  floatingTextAnimation = false,
  multiSelect = false,
  showLabelsOnMultiSelect = false, // New prop
}: FitDropdownProps<T>) => {
  const width = containerWidth ?? '90%';
  const floatingTextPosX = useSharedValue(0);
  const floatingTextPosY = useSharedValue(0);

  const [open, setOpen] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [viewPositionY, setViewPositionY] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[] | T[]>(
    multiSelect ? [] : [selectedValue],
  );

  const remainingBelowSpace = DeviceHeigth - viewPositionY;

  const handlePress = () => setOpen(!open);

  const handleSelect = (item: T) => {
    if (multiSelect) {
      setSelectedItems(prevItems => {
        const alreadySelected = prevItems.find(
          selectedItem => selectedItem === item,
        );
        let newSelectedItems;
        if (alreadySelected) {
          // If item is already selected, remove it
          newSelectedItems = prevItems.filter(
            selectedItem => selectedItem !== item,
          );
        } else {
          // Otherwise, add the new item
          newSelectedItems = [...prevItems, item];
        }
        onChange(newSelectedItems);
        return newSelectedItems;
      });
    } else {
      onChange(item);
      setSelectedItems([item]);
      setOpen(false);
    }
  };

  useEffect(() => {
    const posY = open ? -padding * 1.8 : -padding + 15;
    const posX = open ? 0 : 2.5;

    floatingTextPosY.value = withTiming(posY, {duration: 500});
    floatingTextPosX.value = withTiming(posX, {duration: 500});
  }, [open, padding]);

  const floatingAnimation = useAnimatedStyle(() => ({
    transform: [
      {translateX: floatingTextPosX.value},
      {translateY: floatingTextPosY.value},
    ],
  }));

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <RenderItem
      key={index}
      index={index}
      item={item}
      onSelect={handleSelect}
      textDisplayKey={textDisplayKey}
      showItemIcons={showItemIcons}
      imageDisplayKey={imageDisplayKey}
      itemStyle={itemStyle}
      imageStyle={imageStyle}
      //   isSelected={item?.goal_title === selectedValue}
      isSelected={selectedItems.some(
        selectedItem => selectedItem[textDisplayKey] === item[textDisplayKey],
      )}
    />
  );

  // Display selected items count or names based on `showLabelsOnMultiSelect` prop
  const selectedText = multiSelect
    ? showLabelsOnMultiSelect
      ? selectedItems.map(item => item[textDisplayKey]).join(', ')
      : `${selectedItems.length} selected`
    : selectedItems[0]?.[textDisplayKey] || floatingText;

  return (
    <View
      onLayout={({nativeEvent}) => {
        setViewHeight(nativeEvent.layout.height);
        setViewPositionY(nativeEvent.layout.y);
      }}
      style={[
        dropdownContainerStyle,
        styles.containerStyle,
        {width: width, marginVertical: mV ?? 10, padding: padding},
      ]}>
      <Animated.Text
        style={[
          floatingTextStyle,
          floatingTextAnimation && floatingAnimation,
          {
            position: 'absolute',
            bottom: floatingTextAnimation ? 10 : viewHeight - padding + 2.5,
            color: AppColor.BLACK,
            left: padding - 10 > 10 ? padding - 10 : 10,
            backgroundColor: AppColor.WHITE,
            padding: 5,
          },
        ]}>
        {floatingTextAnimation
          ? open
            ? floatingText
            : selectedValue
          : floatingText}
      </Animated.Text>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.dropdownHeader}>
          <View>
            <FitText
              style={selectedTextStyle}
              type="SubHeading"
              value={floatingTextAnimation ? '' : selectedText}
              fontSize={14}
              color={AppColor.BLACK}
            />
          </View>
          {CustomArrow ? (
            <CustomArrow />
          ) : (
            <FitIcon
              name={open ? 'up' : 'down'}
              size={12}
              type="AntDesign"
              color={AppColor.DARKGRAY}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handlePress}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View
            style={[
              styles.modalOverlay,
              {
                justifyContent: 'center', // Adjust for top/bottom alignment if needed
              },
            ]}>
            <View
              style={[
                listContainerStyle,
                styles.listContainer,
                {
                  width: width,
                  padding: 10,
                  height: listContainerHeight,
                  backgroundColor: AppColor.WHITE,
                  position: 'absolute',
                  top:
                    remainingBelowSpace - listContainerHeight > 0
                      ? viewPositionY + viewHeight + padding * 3
                      : viewPositionY - listContainerHeight + viewHeight / 1.5,
                },
                styles.shadow,
              ]}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FitDropdown;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: AppColor.DARKGRAY,
    backgroundColor: AppColor.WHITE,
    alignSelf: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  listContainer: {
    borderRadius: 5,
    backgroundColor: AppColor.WHITE,
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: 'black',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
