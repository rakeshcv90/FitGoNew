import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const ExerciseByBodyPart = () => {
    const route = useRoute();
    const Data = route.params;
    const [ApiData, setApiData] = useState([]);
    const navigation = useNavigation();
    const { defaultTheme } = useSelector((state) => state);
    const [isLoaded, setLoaded] = useState(false)
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Exercise}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setApiData(data.data)
            setLoaded(true)
        } catch (error) {
            console.log(error)
        }
    };
    const Abs = ApiData.filter(item => item.bodyparts.includes('Abs'));
    const Shoulders = ApiData.filter(item => item.bodyparts.includes('Shoulders'));
    const Triceps = ApiData.filter(item => item.bodyparts.includes('Triceps'));
    const Qauds = ApiData.filter(item => item.bodyparts.includes('Quads'));
    const Biceps = ApiData.filter(item => item.bodyparts.includes('Biceps'));
    const Back = ApiData.filter(item => item.bodyparts.includes('Back'));
    const Legs = ApiData.filter(item => item.bodyparts.includes('Legs'));
    const Chest = ApiData.filter(item => item.bodyparts.includes('Chest'));
    if (isLoaded && Data.title == 'Abs') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <View style={{flex:1}}>
                    <FlatList
                        data={Abs}
                        renderItem={elements => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title == 'Shoulders') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ flex:1}}>
                    <FlatList
                        data={Shoulders}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title == 'Triceps') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title}></HeaderWithoutSearch>
                <View style={{flex:1}}>
                    <FlatList
                        data={Triceps}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title === 'Quads') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title}></HeaderWithoutSearch>
                <View style={{ flex:1 }}>
                    <FlatList
                        data={Qauds}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title == 'Biceps') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{flex:1 }}>
                    <FlatList
                        data={Biceps}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>

                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                        <Text>{elements.item.days}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title == "Back") {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ flex:1}}>
                    <FlatList
                        data={Back}
                        renderItem={elements => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        )
    } else if (isLoaded && Data.title == "Legs") {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff', },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{flex:1}}>
                    <FlatList
                        data={Legs}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else if (isLoaded && Data.title == 'Chest') {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000000' : '#fff' },
                ]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ flex:1 }}>
                    <FlatList
                        data={Chest}
                        renderItem={elements => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ExerciseDetails", { elements })
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
                                                    {elements.item.title}
                                                </Text>
                                                <Text style={{ color: defaultTheme ? '#fff' : '#000' }}>
                                                    {elements.item.level}
                                                </Text>
                                            </View>
                                            <Icons name="chevron-right" size={20} color={'#C8170D'} />
                                        </View>
                                        <Text>{elements.item.days}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        );
    } else {
        return (

            <Loader />

        );
    }
};
const styles = StyleSheet.create({
    container: {
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
    flatListTitle: {
        fontSize: 16,
    },
});
export default ExerciseByBodyPart;
