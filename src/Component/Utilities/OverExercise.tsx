import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {store} from '../ThemeRedux/Store';
import moment from 'moment';

const OverExercise = () => {
  const getExerciseInTime: any = store.getState().getExerciseInTime;
  const getExerciseOutTime = store.getState().getExerciseOutTime;

  const dispatch = store.dispatch;
  console.log(moment().format('hh:mm:ss'),"INTIME");

  return null
};

export default OverExercise;

const styles = StyleSheet.create({});
