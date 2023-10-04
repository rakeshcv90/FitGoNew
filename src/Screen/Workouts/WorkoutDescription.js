import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    FlatList,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
  import {useNavigation, useRoute} from '@react-navigation/native';
  import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
  import LinearGradient from 'react-native-linear-gradient';
  import {useSelector} from 'react-redux'
  import LevelRate from '../../Component/LevelRate';
const WorkoutDescription = () => {
    const navigation = useNavigation();
  const [HomeCardioData, setHomeCardioData] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const route = useRoute();
  const {defaultTheme}=useSelector(state=>state)
  const [Days, setDays] = useState([
    {
        id: 1,
        days: 'Day 1',
      },
      {
        id: 2,
        days: 'Day 2',
      },
      {
        id: 3,
        days: 'Day 3',
      },
      {
        id: 4,
        days: 'Day 4',
      },
      {
        id: 5,
        days: 'Day 5',
      },
      {
        id: 6,
        days: 'Day 6',
      },
      {
        id: 7,
        days: 'Day 7',
      },
    ]);
    const getData = () => {
        try {
          const Data = route.params;
          setHomeCardioData(Data.elements.item);
        //   console.log(Data.elements.item);
        } catch (error) {}
      };
      useEffect(() => {
        getData();
      }, []);
  return (
    
    <SafeAreaView style={{flex:1,backgroundColor:defaultTheme==true?"#000":"#fff"}}>
    <StatusBar backgroundColor="transparent" translucent={true} />
    <ImageBackground
      source={{uri: HomeCardioData.image}}
      style={styles.HomeImg}>
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
        style={styles.LinearG}>
        <View style={styles.Buttn}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icons name="close" size={30} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? (
              <>
                <Icons name="heart-outline" size={30} color={'white'} />
              </>
            ) : (
              <>
                <Icons name="heart" size={30} color={'red'} />
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.textView}>
          <Text style={{color: 'white', padding: 8, fontSize: 16}}>
            {HomeCardioData.title}
          </Text>
          <Text style={{color: '#f39c1f'}}>{HomeCardioData.duration}</Text>
          <View style={styles.rating}>
            <LevelRate level={HomeCardioData.level}/>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
    <View style={styles.levelGoalView}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black', fontSize: 17}}>Level</Text>
        <Text style={{color: 'black'}}>{HomeCardioData.level}</Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black', fontSize: 17}}>Goal</Text>
        <Text style={{color: 'black'}}>{HomeCardioData.goal}</Text>
      </View>
    </View>
    <View style={{width: DeviceWidth,height:DeviceHeigth*95/100}}>
      <FlatList
        data={Days}
        renderItem={elements => (
          <TouchableOpacity style={styles.Days}>
            <Text style={{fontSize: 17,color:defaultTheme==true?"#fff":"#000"}}>{elements.item.days}</Text>
            <Icons name="chevron-right" size={20} color={'#f39c1f'}/>
          </TouchableOpacity>
        )}
      />
    </View>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    HomeImg: {
      height: (DeviceHeigth * 40) / 100,
      width: DeviceWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Buttn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: (DeviceHeigth * 7) / 100,
      marginHorizontal: (DeviceWidth * 4) / 100,
    },
    LinearG: {
      height: (DeviceHeigth * 40) / 100,
      width: DeviceWidth,
      justifyContent: 'space-between',
    },
    textView: {
      marginBottom: (DeviceHeigth * 13) / 100,
      alignItems: 'center',
    },
    levelGoalView: {
      width: DeviceWidth,
      height: (DeviceHeigth * 8) / 100,
      backgroundColor: '#f39c1f',
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center',
    },
    Days: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: (DeviceWidth * 4) / 100,
      marginVertical: (DeviceHeigth * 2) / 100,
    },
    rating:{
      flexDirection:'row',
      padding:4
    }
  });
export default WorkoutDescription