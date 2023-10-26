import { View, Text } from 'react-native'
import React from 'react'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
const LevelRate = ({level}) => {
{
    if(level=='Beginner'){
        return(
        <>
            <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'white'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'white'}
          />
        </>
   
   ) }
     else if(level=="Intermediate"){
        return(
        <>
         <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'white'}
          />
        </>
     )}
      else if(level=="Advanced"){
        return(
        <>
         <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
        </>
     )}
     else if(level=="Elite"){
        return(
        <>
         <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
          <Icons
            name="lightning-bolt"
            size={17}
            mode="contained"
            color={'orange'}
          />
        </>
     )}
     else{
        null
     }
}
}

export default LevelRate