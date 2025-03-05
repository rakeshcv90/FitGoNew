import moment from 'moment';
import {Action} from 'redux';
import {setPurchaseHistory} from '../../Component/ThemeRedux/Actions';

type Data = {
  allow_usage: number;
  created_at: string;
  end_date: string;
  event_purchase_date: string;
  event_start_date_current: string;
  event_start_date_upcoming: string | null;
  id: number;
  plan: string;
  plan_status: string | null;
  plan_value: number;
  platform: string;
  product_id: string;
  transaction_id: string;
  updated_at: string;
  used_plan: number;
  user_id: number;
  upcoming_day_status: number;
  current_day_status: number;
  current_day: number;
  free_status: boolean;
};

export const EnteringEventFunction = (
  dispatch: React.Dispatch<Action>,
  data: Data,
  setEnteredCurrentEvent: any,
  setEnteredUpcomingEvent: any,
  setPlanType: any,
) => {
  if (data?.plan_value != null) {
    dispatch(setPurchaseHistory(data));
    dispatch(setPlanType(data?.plan_value));
    if (data?.current_day_status == 1) {
      dispatch(setEnteredCurrentEvent(true));
    } else {
      dispatch(setEnteredCurrentEvent(false));
    }
    if (data?.upcoming_day_status == 1) {
      dispatch(setEnteredUpcomingEvent(true));
    } else {
      dispatch(setEnteredUpcomingEvent(false));
    }
  } else {
    dispatch(setPlanType(-1));
    dispatch(setEnteredCurrentEvent(false));
    dispatch(setEnteredUpcomingEvent(false));
    dispatch(setPurchaseHistory({}));
  }
};

export const hasFreeEvent = (data: Data) => {
  if (data?.allow_usage == 1 && data?.free_status) {
    if (data?.current_day_status == 0 && data?.upcoming_day_status == 0) {
      return data?.free_status;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
