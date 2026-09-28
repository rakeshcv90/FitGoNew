
import { setLogout } from './ThemeRedux/Actions';
import {CommonActions} from '@react-navigation/native';
import { navigationRef } from './Utilities/NavigationUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LogOut = async(dispatch) => {
    try {
      // Preserve the app language setting across logout
      const savedLang = await AsyncStorage.getItem('app_language');

      await AsyncStorage.clear();

      // Restore language preference after clearing storage
      if (savedLang) {
        await AsyncStorage.setItem('app_language', savedLang);
      }

      // Reset Redux state to initial values
      dispatch(setLogout());

      // Navigate to splash screen safely
      if (navigationRef.isReady()) {
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
    } catch (error) {
      console.error('LogOut error:', error);
      // Ensure Redux is still reset even if something else fails
      try {
        dispatch(setLogout());
      } catch (e) {}
    }
}

// export default LogOut