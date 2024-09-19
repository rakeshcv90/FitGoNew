import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {TextInput} from 'react-native-paper';
import {DeviceWidth} from './Config';
import {localImage} from './Image';
import {AppColor} from './Color';

const NewInputText = ({errors, touched, colorText, ...props}) => {
  const [isEditable, setEditable] = useState(false);
  const inputRef = useRef(null);

  // const handleIconPress = () => {
  //   setEditable(prev => {
  //     const newEditableState = !prev;
  //     if (!prev) {
  //       setTimeout(() => {
  //         inputRef.current?.focus();
  //       }, 0);
  //     }
  //     return newEditableState;
  //   });
  // };

  const handleIconPress=()=>{
    setEditable(true);
          setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
  }
  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <View>
          <TextInput
            ref={inputRef}
            multiline={false}
            mode="outlined"
            dense={true}
            activeOutlineColor="#707070"
            outlineStyle={{borderRadius: 15}}
            contentStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            style={{
              backgroundColor: '#F8F9F9',
              width: DeviceWidth * 0.9,
              alignSelf: 'center',
              height: 55,
              fontFamily: 'Poppins',
            }}
            editable={isEditable}
            {...props}
            right={
              <TextInput.Icon
                icon={() => (
                  <TouchableOpacity onPress={handleIconPress}>
                    <Image
                      source={localImage.Pen_p}
                      tintColor={AppColor.BoldText}
                      style={{width: 18, height: 18}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
                style={{marginTop: 14}}
              />
            }
          />
        </View>
      </View>
      {errors && touched && (
        <Text
          style={{
            color: colorText ? 'green' : 'red',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 5,
          }}>
          {errors}
        </Text>
      )}
    </View>
  );
};

const styles = {
  container: {
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  input: {
    width: DeviceWidth * 0.9,
    //backgroundColor: '#F8F9F9',
    height: 55,

    justifyContent: 'center',
  },
};

export default NewInputText;
