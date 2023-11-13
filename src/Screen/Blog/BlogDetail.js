import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import HTMLRender from "react-native-render-html";
const BlogDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const Data = route.params;
    const ShownData = Data.data;
    const Description = Data.data.description;
    const DesData = [{ Description }]
    const { defaultTheme } = useSelector(state => state);
    return (
        <View style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff' }}>
          <StatusBar barStyle={defaultTheme?"light-content":'dark-content'} translucent={true} backgroundColor={'transparent'}/>
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
            <View style={{ flex:1, marginHorizontal: 20 }}>
                <FlatList data={DesData} showsVerticalScrollIndicator={false}
                 renderItem={(elements) => (
                    <HTMLRender source={{ html: elements.item.Description }} contentWidth={DeviceWidth} tagsStyles={{
                        p:{
                            color:defaultTheme?"#fff":"#000"
                        },
                        strong:{
                            color:'#f39c1f',
                            fontSize:20,
                        }
                        ,li:{
                            color:defaultTheme?"#fff":"#000"
                        },
                        ul:{
                            color:defaultTheme?"#fff":"#000"
                        },
                        ol:{
                            color:defaultTheme?"#fff":"#000"
                        }
                    }}/>
                )} />
            </View>
        </View>
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