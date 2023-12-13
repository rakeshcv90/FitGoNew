import { View, Text } from 'react-native'
import React from 'react'

const WorkoutArea = ({route, navigation}) => {
    const [screen, setScreen] = useState(nextScreen);
    const {nextScreen} = route.params;
    const {getLaterButtonData} = useSelector(state => state);
  return (

    <View>
      <Text>WorkoutArea</Text>
    </View>
  )
}

export default WorkoutArea