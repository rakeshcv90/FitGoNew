
import { setLogout } from './ThemeRedux/Actions';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import {persistor} from '../Component/ThemeRedux/Store'

const LogOut = async() => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    await AsyncStorage.clear();
    await persistor.purge();
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