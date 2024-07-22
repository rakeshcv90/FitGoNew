import {setUpdateAvailable} from '../ThemeRedux/Actions';
export const UpdateAvailable = dispatch => {
  dispatch(setUpdateAvailable(true));
};
export const UpdateAvailable1 = dispatch => {
  dispatch(setUpdateAvailable(false));
};
