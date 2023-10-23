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
import Header from '../../Component/Header';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import LevelRate from '../../Component/LevelRate';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
const DietCategory = () => {
    const navigation = useNavigation();
    const [isLoaded, setIsLoaded] = useState(false)
    const [Diets, setDiets] = useState([]);
    const route = useRoute;
    const Data = route.params;
    const { defaultTheme } = useSelector(state => state);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Diet_category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setDiets(data.data);
            setIsLoaded(true)
        } catch (error) { }
    };
    // const DietCat = Diets.filter(item => item.category == Data.title);
    if (isLoaded) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: defaultTheme ? '#000' : '#fff' },
                ]}>
                <HeaderWithoutSearch Header={"Categories"} />
                <View style={{ height: (DeviceHeigth * 90) / 100 }}>
                    <FlatList
                        data={Diets}
                        renderItem={elements => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("SingleCategory", { title: elements.item.title })
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
                                                <Text style={{ color: '#f39c1f' }}>{elements.item.total} Recipies</Text>
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
export default DietCategory