import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HTMLRender from "react-native-render-html";
import { DeviceWidth, DeviceHeigth } from '../Component/Config';
import { Api, Appapi } from '../Component/Config';
import { localImage } from '../Component/Image';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Loader from '../Component/Loader';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';

const TermaAndCondition = () => {
  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const { defaultTheme } = useSelector(state => state)
  const [Terms, setTerms] = useState([])
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.Strings}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      console.log("Aboiutsygsyuw", data.data)
      setTerms(data.data)
      setIsLoaded(true);
    }

    catch (error) {
      console.log("eroror", error)
    }
  };
  if (isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
        <HeaderWithoutSearch Header={"Terms & Privacy"} />
        <View style={{ marginHorizontal: 20, height:DeviceHeigth*90/100}}>
          <FlatList data={Terms} showsVerticalScrollIndicator={false} renderItem={elements => {
            return (
              <View>
                <HTMLRender source={{ html: elements.item.st_termsofservice }} tagsStyles={customStyle = {
                  p: {
                    color: defaultTheme ? "#fff" : "#000"
                  },
                  strong: {
                    color: '#f39c1f',
                    fontSize: 20,
                  }
                }} contentWidth={width} />
                <HTMLRender source={{ html: elements.item.st_privacypolicy }} tagsStyles={customStyle = {
                  p: {
                    color: defaultTheme ? "#fff" : "#000"
                  },
                  strong: {
                    color: '#f39c1f',
                    fontSize: 20,
                  }
                }} contentWidth={width} />
              </View>)
          }} />
        </View>
      </SafeAreaView>
    )
  }
  else {
    return (
    
        <Loader />
    
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
export default TermaAndCondition