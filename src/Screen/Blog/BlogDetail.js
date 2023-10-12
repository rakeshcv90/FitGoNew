import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import LevelRate from '../../Component/LevelRate';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import HTMLRender from "react-native-render-html";
const BlogDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const Data = route.params;
    const ShownData = Data.data;
    //   console.log(Data.data);
    const regex = /(<([^>]+)>)/ig;
    // const result = data.description.replace(regex, '');
    const Description = Data.data.description;
    const DesData = [{ Description }]
    //   console.log(Description)
    const { defaultTheme } = useSelector(state => state);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff' }}>
          <StatusBar barStyle={"light-content"} translucent={true} backgroundColor={'transparent'}/>
            <View>
                <ImageBackground source={{ uri: Data.data.image }} style={styles.HomeImg}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
                        style={styles.LinearG}>
                        <View style={styles.Buttn}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Blog');
                                }}>
                                <Icons name="close" size={30} color={'white'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textView}>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    marginTop: 7,
                                    color: '#adadad'
                                }}>
                                {moment(Data.data.date).fromNow()}
                            </Text>
                            <Text style={{ color: 'white', paddingVertical: 8, fontSize: 16 }}>
                                {Data.data.title}
                            </Text>
                            <Text style={{ color: '#f39c1f' }}>{Data.data.tag}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </View>
            <View style={{ height: DeviceHeigth * 55 / 100, marginHorizontal: 20 }}>
                <FlatList data={DesData} renderItem={(elements) => (
                    <HTMLRender source={{ html: elements.item.Description }} contentWidth={DeviceWidth}/>
                )} />
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    HomeImg: {
        height: (DeviceHeigth * 40) / 100,
        width: DeviceWidth,
    },
    Buttn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: (DeviceHeigth * 7) / 100,
        marginHorizontal: (DeviceWidth * 4) / 100,
        // borderWidth:1
    },
    LinearG: {
        height: (DeviceHeigth * 40) / 100,
        width: DeviceWidth,
        justifyContent: 'space-between',
    },
    textView: {
        marginBottom: (DeviceHeigth * 3) / 100,
        alignItems: 'flex-start',
        // borderWidth:1,
        // justifyContent:'flex-end'
        margin: 20
    },
    levelGoalView: {
        width: DeviceWidth,
        height: (DeviceHeigth * 8) / 100,
        backgroundColor: '#f39c1f',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    Days: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: (DeviceWidth * 4) / 100,
        marginVertical: (DeviceHeigth * 2) / 100,
    },
});

export default BlogDetail