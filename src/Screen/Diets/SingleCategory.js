import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
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
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const SingleCategory = () => {
    const navigation = useNavigation();
    const [isLoaded, setIsLoaded] = useState(false)
    const [Diets, setDiets] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false)
    const route = useRoute();
    const Data = route.params;
    const { defaultTheme } = useSelector(state => state);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Diets}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            if (data.data.length > 0) {
                setDiets(data.data);
                setIsLoaded(true)
                setIsEmpty(false)
            } else {
                setIsEmpty(true)
                setIsLoaded(true)
            }

        } catch (error) { }
    };
    const DietCat = Diets.filter(item => item.category == Data.title);
    if (isLoaded && DietCat != null) {
        return (
            <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
                {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#941000'} /></> : <><CustomStatusBar /></>}
                <HeaderWithoutSearch Header={Data.title} />
                <View
                    style={{
                        height: (DeviceHeigth * 90) / 100,
                        width: DeviceWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <FlatList
                        data={DietCat}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("DietDetail", { data: item })
                                }}>
                                <ImageBackground
                                    source={{ uri: item.image }}
                                    style={styles.imageBackground}>
                                    <View style={styles.text}>
                                        <Text
                                            style={{
                                                color: '#941000',
                                                marginLeft: 10,
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                            }}>
                                            {item.category}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                marginTop: 5,
                                                marginLeft: 10,
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                            }}>
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#adadad',
                                                margin: 10,
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                            }}>
                                            {item.calories} Kcal | Servings: {item.servings}
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        )
    }
    else if (isLoaded && isEmpty) {
        return (
            <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff",justifyContent:'center',alignItems:'center' }}>
            <Text style={{color:'#941000',fontSize:20,fontWeight:'bold'}}>No Data Available</Text></View>
        )
    }
    else{
        return(
            <Loader/>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageBackground: {
        width: (DeviceWidth * 95.5) / 100,
        height: (DeviceHeigth * 20) / 100,
        margin: 10,
        resizeMode: 'contain',
        borderRadius: 8,
        overflow: 'hidden',
    },
    text: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: (DeviceHeigth * 20) / 100,
        justifyContent: 'flex-end',
        paddingBottom: 4,
    },
});
export default SingleCategory