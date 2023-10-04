import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
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
const ExerciseByBodyPart = () => {
    const route = useRoute();
    const Data = route.params;
    console.log(" title", Data.title)
    const [ApiData, setApiData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigation = useNavigation();
    const { defaultTheme } = useSelector((state) => state);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.workhouts}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setApiData(data.data);
            setIsLoaded(true);
            console.log('example', data.data[0].bodypart);
        } catch (error) { }
    };
    const Abs = ApiData.filter(item => item.bodypart.includes('Abs'));
    const Shoulders = ApiData.filter(item => item.bodypart.includes('Shoulders'));
    const Triceps = ApiData.filter(item => item.bodypart.includes('Triceps'));
    const Qauds = ApiData.filter(item => item.bodypart.includes('Quads'));
    const Biceps = ApiData.filter(item => item.bodypart.includes('Biceps'));
    const Back = ApiData.filter(item => item.bodypart.includes('Back'));
    const Forearms = ApiData.filter(item => item.bodypart.includes('Forearms'));
    const Chest = ApiData.filter(item => item.bodypart.includes('Chest'));
    console.log('filterData', Abs);
    if (isLoaded && Data.title == 'Abs') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Abs}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Shoulders') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Shoulders}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Triceps') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <WithoutSearchHeader Header={"Forearms"} Screenname={"Exercises"}></WithoutSearchHeader>
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Triceps}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Quads') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <WithoutSearchHeader Header={"Forearms"} Screenname={"Exercises"}></WithoutSearchHeader>
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Qauds}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Biceps') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Biceps}
                        renderItem={elements => (
                            <TouchableOpacity>
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

                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                        <Text>{elements.item.days}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Back') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Back}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Forearms') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Forearms}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else if (isLoaded && Data.title == 'Chest') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={Data.title} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Chest}
                        renderItem={elements => (
                            <TouchableOpacity>
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
                                            <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                        </View>
                                        <Text>{elements.item.days}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <View>
                <Loader />
            </View>
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
