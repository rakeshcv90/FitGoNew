import { View, Text } from 'react-native'
import React from 'react'

const Report = ({ route }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile!</Text>
    <Text>
      {route?.params?.owner ? `${route.params.owner}'s Profile` : ''}
    </Text>
  </View>
  )
}

export default Report