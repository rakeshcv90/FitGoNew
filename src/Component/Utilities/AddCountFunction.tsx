import moment from 'moment';
import {store} from '../ThemeRedux/Store';
import {setFitmeMealAdsCount} from '../ThemeRedux/Actions';

const countAds = (
  getFitmeMealAdsCount: number,
  dispatch: any,
  setFitmeMealAdsCount: any,
  count: number,
) => {
  if (getFitmeMealAdsCount < count) {
    dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
    return false;
  } else {
    dispatch(setFitmeMealAdsCount(0));
    return true;
  }
};
export const AddCountFunction = () => {
  const getPurchaseHistory: any = store.getState().getPurchaseHistory;
  const getFitmeMealAdsCount = store.getState().getFitmeMealAdsCount;
  const planType = store.getState().planType;
  const dispatch = store.dispatch;

  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  if (getPurchaseHistory?.plan != null) {
    if (getPurchaseHistory?.plan == 'premium' && isValid) {
      dispatch(setFitmeMealAdsCount(0));
      return false;
    } else {
      if (getPurchaseHistory?.plan == 'pro')
        countAds(getFitmeMealAdsCount, dispatch, setFitmeMealAdsCount, 6);
      else if (getPurchaseHistory?.plan == 'noob')
        countAds(getFitmeMealAdsCount, dispatch, setFitmeMealAdsCount, 3);
    }
  } else {
    countAds(getFitmeMealAdsCount, dispatch, setFitmeMealAdsCount, 3);
  }
};
