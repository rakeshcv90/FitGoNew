import {Platform} from 'react-native';
import React from 'react';
import {PLATFORM_IOS} from '../../Component/Color';
import {setInappPurchase} from '../../Component/ThemeRedux/Actions';
import {store} from '../../Component/ThemeRedux/Store';
import * as RNIap from 'react-native-iap';

const products = PLATFORM_IOS
  ? ['fitme_noob', 'fitme_pro', 'fitme_legend']
  : ['fitme_monthly', 'a_monthly', 'fitme_legend'];

export const setupSubscription = () => {
  PLATFORM_IOS
    ? RNIap.initConnection()
        .catch(() => {
          console.log('error connecting to store');
        })
        .then(() => {
          RNIap.getProducts({skus: products})
            .catch(() => {
              console.log('error finding purchase');
            })
            .then(res => {
              store.dispatch(setInappPurchase(res));
            });
        })
    : RNIap.initConnection()
        .catch(() => {
          console.log('error connecting to store');
        })
        .then(() => {
          RNIap.getSubscriptions({skus: products})
            .catch(() => {
              console.log('error finding purchase');
            })
            .then(res => {
              store.dispatch(setInappPurchase(res));
            });
        });
};
