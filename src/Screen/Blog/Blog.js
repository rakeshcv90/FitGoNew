import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image
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
import moment from 'moment';
const Blog = () => {
    const [featuredBlog, setfeaturedBlog] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigation = useNavigation();
    const [LatestPost, setLatestPost] = useState([]);
    const { defaultTheme } = useSelector((state) => state);
    useEffect(() => {
        getData();
        getTags();
        getLatestpost();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.FeaturedPost}?featured=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setfeaturedBlog(data.data);
            console.log(data.data);
            setIsLoaded(true);
        } catch (error) { }
    };
    const getTags = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Tags}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setTags(data.data);
            console.log(data.data);
            setIsLoaded(true);
        } catch (error) { }
    };
    const getLatestpost = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.FeaturedPost}?limit=6`, {
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
        <SafeAreaView style={[styles.conatainer, { backgroundColor: defaultTheme ? '#000' : '#fff' }]}>
            <HeaderWithoutSearch Header={"Blog"} />
            <View>
                {isLoaded ? (
                    <>
                        <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            data={featuredBlog}
                            renderItem={elements => (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('BlogDetail', { data: elements.item })
                                }}>
                                    <ImageBackground
                                        source={{ uri: elements.item.image }}
                                        style={styles.Image}>
                                        <View style={[styles.gradientView]}>
                                            <View style={styles.Tag}>
                                                <Text style={{ color: "#fff" }}>{elements.item.tag}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.text}>{elements.item.title}</Text>
                                                <Text
                                                    style={{
                                                        color: '#f39c1f',
                                                        fontWeight: '500',
                                                        marginTop: 7,
                                                    }}>
                                                    {moment(elements.item.date).fromNow()}
                                                </Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                ) : (
                    <>
                        <View>
                            <Loader />
                        </View>
                    </>
                )}
            </View>
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
                        color: defaultTheme == true ? '#fff' : '#000',
                        fontWeight: '500',
                    }}>
                    Tags
                </Text>
                <TouchableOpacity>
                    <Icon
                        name="chevron-right"
                        size={25}
                        color={defaultTheme == true ? '#fff' : '#000'}
                    />
                </TouchableOpacity>
            </View>
            <View>
                {isLoaded ? (
                    <>
                        <FlatList
                            horizontal={true}
                            data={tags}
                            showsHorizontalScrollIndicator={false}
                            renderItem={elements => (
                                <TouchableOpacity style={styles.categories}
                                    onPress={() => {
                                        navigation.navigate("BlogTags", { data: elements.item })
                                    }}>
                                    <Icon
                                        name="tag"
                                        size={15}
                                        style={{ margin: 7 }}
                                        color="#adadad"
                                    />
                                    <Text
                                        style={{
                                            marginRight: 10,
                                            color: defaultTheme == true ? '#fff' : '#000',
                                        }}>
                                        {elements.item.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                ) : (
                    <>
                        <View>
                            <Loader />
                        </View>
                    </>
                )}
            </View>
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
                        color: defaultTheme == true ? '#fff' : '#000',
                        fontWeight: '500',
                    }}>
                    Latest Posts
                </Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("LatestPosts")
                }}>
                    <Icon
                        name="chevron-right"
                        size={25}
                        color={defaultTheme == true ? '#fff' : '#000'}
                    />
                </TouchableOpacity>
            </View>
            {isLoaded ? (
                <>
                    <View style={{ height: (DeviceHeigth * 45) / 100,}}>
                        <FlatList
                            data={LatestPost}
                            renderItem={elements => (
                                <TouchableOpacity style={{ height: (DeviceHeigth * 10) / 100 }} onPress={() => {
                                    navigation.navigate("BlogDetail", { data: elements.item })
                                }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: 15,
                                            // width: (DeviceWidth * 78) / 100,
                                            // borderWidth: 2,
                                            // borderColor: 'red'
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
                                                width: (DeviceWidth * 74) / 100,
                                                alignItems: 'center',
                                                padding:5,
                                                // borderWidth:2,
                                                // borderColor:"yellow"
                                            }}>
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
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color={defaultTheme == true ? '#fff' : '#000'}
                                            />
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
    )
}
const styles = StyleSheet.create({
    conatainer: {
        flex: 1,
    },
    gradientView: {
        height: (DeviceHeigth * 25) / 100,
        width: (DeviceWidth * 75) / 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
        padding: 16,
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
    Tag: {
        width: 75,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
        justifyContent: 'center',
    },
});
export default Blog