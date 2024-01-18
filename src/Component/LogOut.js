import { View, Text } from 'react-native'
import React from 'react'
import { setLogout } from './ThemeRedux/Actions';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

const LogOut = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    dispatch(setLogout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'LogSignUp',
          },
        ],
      }),
    );
}

export default LogOut