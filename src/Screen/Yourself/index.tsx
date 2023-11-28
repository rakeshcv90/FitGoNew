import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const index = () => {
  const {defaultTheme} = useSelector((state: any) => state);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: defaultTheme ? 'black' : 'white'}}>
      <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
        <Text
          style={{
            color: !defaultTheme ? 'black' : 'white',
            fontSize: 20,
            fontFamily: '',
            fontWeight: 'bold',
            lineHeight: 30,
          }}>
          Tell us about yourself!
        </Text>
        <Text
          style={{
            color: !defaultTheme ? 'black' : 'white',
            marginTop: 5,
            fontSize: 14,
            fontFamily: '',
            fontWeight: '400',
            lineHeight: 16,
            width: '65%',
            textAlign: 'center'
          }}>
          To give you a better experience we need to know your gender
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
