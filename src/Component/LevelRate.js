import { View, Text } from 'react-native'
import React from 'react'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppColor } from './Color'
const LevelRate = ({level}) => {
{
    if(level=='Beginner'){
        return(
        <>
            <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.LIGHTNING_PINK}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.LIGHTNING_PINK}
          />
        </>
   
   ) }
     else if(level=="Intermediate"){
        return(
        <>
         <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.LIGHTNING_PINK}
          />
        </>
     )}
      else if(level=="Advanced"){
        return(
        <>
         <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
          <Icons
            name="lightning-bolt"
            size={25}
            mode="contained"
            color={AppColor.RED}
          />
        </>
     )}
     else{
        null
     }
}
}

export default LevelRate