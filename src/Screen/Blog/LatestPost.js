import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Api, Appapi } from '../../Component/Config';
import axios from 'axios';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';
const LatestPost = () => {
    const [LatestPost, setLatestPost] = useState([]);
    const { defaultTheme } = useSelector((state) => state);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigation = useNavigation()
    useEffect(() => {
        getLatestpost();
    }, []);
    const getLatestpost = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.FeaturedPost}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setLatestPost(data.data);
            // console.log(data.data);
            setIsLoaded(true);
        } catch (error) { }
    };
    if (isLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
                <HeaderWithoutSearch Header={"Latest Post"} />
                <View style={{ flex:1 }}>
                    <FlatList
                        data={LatestPost}
                        renderItem={elements => (
                            <TouchableOpacity style={{ height: (DeviceHeigth * 10) / 100 }} onPress={() => {
                                navigation.navigate('BlogDetail', { data: elements.item })
                            }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 10,
                                        justifyContent: 'space-between',
                                        // borderWidth:1,

                                    }}>
                                    <Image
                                        source={{ uri: elements.item.image }}
                                        style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                                    />
                                    <View
                                        style={{
                                            // marginLeft: 10,
                                            flexDirection: 'row',
                                            width: (DeviceWidth * 65) / 100,
                                            alignItems: 'center',
                                            // borderWidth:1,
                                        }}>
                                        <View>
                                            <Text style={{ color: defaultTheme == true ? "#fff" : "#000", fontWeight: '500' }}>{elements.item.title}</Text>
                                            <Text style={{ color: '#941000', fontWeight: '500' }}>
                                                {/* {elements.item.price} */}
                                            </Text>
                                        </View>
                                    </View>
                                    <Icon name="chevron-right" size={20} color={defaultTheme == true ? "#fff" : "#000"} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        )
    }
    else {
        return (

            <Loader />

        )
    }
};
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    Image: {
        width: 60,
        height: 60,
        margin: 10,
        borderRadius: 60 / 2,
    },
    container3: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (DeviceWidth * 70) / 100,
        justifyContent: 'space-between',
    },
});
export default LatestPost;
