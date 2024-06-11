import moment from 'moment';
import {Action} from 'redux';

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
};

export const EnteringEventFunction = (
  dispatch: React.Dispatch<Action>,
  data: Data,
  setEnteredCurrentEvent: any,
  setEnteredUpcomingEvent: any,
  setPlanType: any,
) => {
  if (data?.plan_value != null) {
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
    // if (data?.event_start_date_upcoming == null) {
    //   //console.log(data?.event_start_date_current, 'PLANSSSSS');
    //   if (
    //     moment(data?.event_start_date_current).diff(
    //       moment().format('YYYY-MM-DD'),
    //       'days',
    //     ) >= 1
    //   ) {
    //     dispatch(setEnteredUpcomingEvent(true));
    //     dispatch(setEnteredCurrentEvent(false));
    //   } else {
    //     dispatch(setEnteredCurrentEvent(true));
    //     dispatch(setEnteredUpcomingEvent(false));
    //   }
    //   // console.log(
    //   //     data,
    //   //     'PLANSSSSS',
    //   //     moment(data?.event_start_date_current).diff(
    //   //       moment().format('YYYY-MM-DD'),
    //   //       'days',
    //   //     ) >= 1
    //   //       ? 'Upcoming'
    //   //       : 'Current',
    //   //   );
    // } else {
    //   console.log(
    //     data?.event_start_date_current,
    //     'upcoming',
    //     data.event_start_date_upcoming,
    //     moment(data?.event_start_date_current).diff(
    //       moment().format('YYYY-MM-DD'),
    //       'days',
    //     ) <= 0,
    //   );
    //   if (
    //     moment(data?.event_start_date_upcoming).diff(
    //       moment().format('YYYY-MM-DD'),
    //       'days',
    //     ) >= 1
    //   ) {
    //     dispatch(setEnteredUpcomingEvent(true));
    //     //   dispatch(setEnteredCurrentEvent(false));
    //   }
    //   if (
    //     moment(data?.event_start_date_current).diff(
    //       moment().format('YYYY-MM-DD'),
    //       'days',
    //     ) <= 0
    //   ) {
    //     dispatch(setEnteredCurrentEvent(true));
    //     //   dispatch(setEnteredUpcomingEvent(false));
    //   }
    //   // console.log(
    //   //     data,
    //   //     'upcoming',
    //   //     moment(data?.event_start_date_upcoming).diff(
    //   //       moment().format('YYYY-MM-DD'),
    //   //       'days',
    //   //     ) >= 1
    //   //       ? 'Upcoming'
    //   //       : 'Current',
    //   //     data?.event_start_date_current,
    //   //     'current',
    //   //     moment(data?.event_start_date_current).diff(
    //   //       moment().format('YYYY-MM-DD'),
    //   //       'days',
    //   //     ) >= 1
    //   //       ? 'Upcoming'
    //   //       : 'Current',
    //   //   );
    // }
  } else {
    dispatch(setPlanType(-1));
    dispatch(setEnteredCurrentEvent(false));
    dispatch(setEnteredUpcomingEvent(false));
  }
};
