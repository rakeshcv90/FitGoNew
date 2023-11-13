import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    Linking,
    StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-paper';
import CustomStatusBar from '../../Component/CustomStatusBar';
const Store = () => {
    const [ApiData, setApiData] = useState([]);
    const [Categories, setCategories] = useState([])
    const [getLatestprdct, setLatestprdct] = useState([])
    const [isLoaded, setIsLoaded] = useState(false);
    const navigation = useNavigation();
    const [Isempty, setEmpty] = useState(false)
    const { defaultTheme } = useSelector(state => state)
    useEffect(() => {
        getData();
        getCategories();
        getLatestProducts()
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Products}?featured=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            if (data.data.length > 0) {
                setApiData(data.data);
                setIsLoaded(true);
                setEmpty(false)
            }
            else {
                setEmpty(true)
                setIsLoaded(true)
            }
        } catch (error) { }
    };
    const getCategories = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Categories}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
                setCategories(data.data);
                setIsLoaded(true)
        } catch (error) {
        }
    };
    const getLatestProducts = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Products}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            if (data.data.length > 0) {
                setLatestprdct(data.data);
                setIsLoaded(true);
                setEmpty(false)
            }
            else {
                setEmpty(true);
                setIsLoaded(true)
            }
        } catch (error) { }
    }
    if (isLoaded && !Isempty) {
        return (
            <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={"Store"} />
                <Text
                    style={{ margin: 15, fontSize: 20, color: defaultTheme == true ? "#fff" : "#000", fontWeight: '500' }}>
                    Special Offers
                </Text>
                <View style={styles.containerF}>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                        data={ApiData}
                        renderItem={elements => (
                            <TouchableOpacity onPress={() => {
                                Linking.openURL(elements.item.link)
                            }}>
                                <ImageBackground
                                    source={{ uri: elements.item.image }}
                                    style={styles.Image}>
                                    <View style={styles.gradientView}>
                                        <Text style={styles.text}>{elements.item.title}</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {/* <Divider bold/> */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: 25,
                    }}>
                    <Text
                        style={{
                            margin: 15,
                            fontSize: 20,
                            color: defaultTheme == true ? "#fff" : "#000",
                            fontWeight: '500',
                        }}>
                        Categories
                    </Text>
                </View>
                <View>
                    <FlatList
                        horizontal={true}
                        data={Categories}
                        showsHorizontalScrollIndicator={false}
                        renderItem={elements => (
                            <TouchableOpacity style={styles.categories}
                                onPress={() => {
                                    navigation.navigate("StoreCategories", { data: elements.item })
                                }}>
                                <Icon name="tag" size={15} style={{ margin: 7 }} color='#adadad' />
                                <Text style={{ marginRight: 10, color: defaultTheme == true ? "#fff" : "#000" }}>
                                    {elements.item.title}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {/* <Divider bold/> */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: 25,
                    }}>
                    <Text
                        style={{
                            margin: 15,
                            fontSize: 20,
                            color: defaultTheme == true ? "#fff" : "#000",
                            fontWeight: '500',
                        }}>
                        Latest Products
                    </Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("LatestProducts")
                    }}>
                        <Icon name="chevron-right" size={25} color={defaultTheme == true ? "#fff" : "#000"} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex:1}}>
                    <FlatList
                        data={getLatestprdct}
                        renderItem={elements => (
                            <TouchableOpacity style={{ height: (DeviceHeigth * 10) / 100 }}
                                onPress={() => {
                                    Linking.openURL(elements.item.link)
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}>
                                    <Image
                                        source={{ uri: elements.item.image }}
                                        style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                                    />
                                    <View
                                        style={{
                                            justifyContent: 'space-between',
                                            marginLeft: 10,
                                            flexDirection: 'row',
                                            width: (DeviceWidth * 76) / 100,
                                            alignItems: 'center',
                                        }}>
                                        <View>
                                            <Text style={{ color: defaultTheme == true ? "#fff" : "#000", fontWeight: '500' }}>{elements.item.title}</Text>
                                            {/* <Text style={{ color: '#f39c1f', fontWeight: '500' }}>
                                                {elements.item.price}
                                            </Text> */}
                                        </View>
                                        <Icon name="chevron-right" size={20} color={defaultTheme == true ? "#fff" : "#000"} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        )
    }
    else if(isLoaded && Isempty){
return(
    <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff", justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#f39c1f', fontSize: 20, fontWeight: 'bold' }}>No Data Available</Text></View>
)
    }
    else {
       return(
        <Loader/>
       )
    }
}
const styles = StyleSheet.create({
    containerF: {
        width: DeviceWidth,
    },
    Touchable: {
        width: DeviceWidth,
    },
    Image: {
        height: (DeviceHeigth * 25) / 100,
        width: (DeviceWidth * 75) / 100,
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: (DeviceWidth * 2) / 100,
        marginRight: (DeviceWidth * 2) / 100,
        marginVertical: (DeviceHeigth * 1) / 100,
    },
    text: {
        color: 'white',
        fontWeight: '500',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#adadad',
    },
    gradientView: {
        height: (DeviceHeigth * 25) / 100,
        width: (DeviceWidth * 75) / 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        padding: 16,
    },
});
export default Store