import { View, Text, SafeAreaView ,StatusBar} from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavDiets from '../Component/FavDiets'
import FavWorkouts from '../Component/FavWorkouts'
import CustomStatusBar from '../Component/CustomStatusBar'
import { useSelector } from 'react-redux'
const FavoritesRouter = () => {
    const Tabs = createMaterialTopTabNavigator()
    const {defaultTheme}=useSelector(state=>state)
    return (
        <View style={{ flex: 1 }}>
              {Platform.OS=='android'?<><StatusBar barStyle={defaultTheme?'light-content':'dark-content'} backgroundColor={'#f39c1f'}/></>:<><CustomStatusBar/></>}
            <HeaderWithoutSearch Header={"Favorites"} />
            <Tabs.Navigator initialRouteName='FavWorkouts' screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: "#fff",textTransform:'none' },
                tabBarStyle: { backgroundColor: "#f39c1f" },
                tabBarIndicatorStyle: {
                    backgroundColor: '#fff', height: 3
                }
            }}>
                <Tabs.Screen name="FavWorkouts" component={FavWorkouts} options={{ title: "Workouts", }} />
                <Tabs.Screen name="FavDiets" component={FavDiets} options={{ title: "Diets", }} />
            </Tabs.Navigator>
        </View>

    )
}
export default FavoritesRouter