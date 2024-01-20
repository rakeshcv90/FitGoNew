
import { setLogout } from './ThemeRedux/Actions';
import {CommonActions} from '@react-navigation/native';
import { navigationRef } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LogOut = async(dispatch) => {
    await AsyncStorage.clear();
    dispatch(setLogout());
    // await persistor.purge();
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'SplaceScreen',
          },
        ],
      }),
    );
}

// export default LogOut