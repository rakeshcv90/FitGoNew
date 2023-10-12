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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff' }}>
            <HeaderWithoutSearch Header={"Blog"} />
            {isLoaded ? (
                <>
                    <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
                        <FlatList
                            data={LatestPost}
                            renderItem={elements => (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("BlogDetail", { data: elements.item })
                                }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            margin: 10,
                                            alignItems: 'center',
                                        }}>
                                        <Image
                                            source={{ uri: elements.item.image }}
                                            style={styles.Image}
                                        />
                                        <View>
                                            <View style={styles.container3}>
                                                <View>
                                                    <Text
                                                        style={[
                                                            styles.flatListTitle,
                                                            { color: defaultTheme == true ? '#fff' : '#000' },
                                                        ]}>
                                                        {elements.item.title}</Text>
                                                    <Text
                                                        style={{
                                                            color: '#f39c1f',
                                                            fontWeight: '500',
                                                            marginTop: 7,
                                                        }}>
                                                        {moment(elements.item.date).fromNow()}
                                                    </Text></View>
                                                <Icons name="chevron-right" size={20} color={'grey'} />
                                            </View>
                                            <Text>{elements.item.days}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </>
            ) : (
                <>
                    <View>
                        <Loader />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
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
