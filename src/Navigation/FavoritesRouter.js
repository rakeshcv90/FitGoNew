import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavDiets from '../Component/FavDiets'
import FavWorkouts from '../Component/FavWorkouts'
const FavoritesRouter = () => {
    const Tabs = createMaterialTopTabNavigator()
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>

    )
}

export default FavoritesRouter