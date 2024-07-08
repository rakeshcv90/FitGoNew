import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useMemo} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';

const WorkoutDayData = ({navigation, route}) => {
  const renderItem = useMemo(
    () =>
      ({item}) => {
        return <></>;
      },
    [],
  );
  return (
    <>
      <NewHeader
        header={route?.params?.item?.workout_title}
        SearchButton={false}
        backButton={true}
      />
      <View style={styles.container}>
        <View style={[styles.meditionBox, {top: -20}]}>
          <FlatList
            data={Object.values(route.params.item?.days)}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  meditionBox: {
    backgroundColor: 'white',
  },
});
export default WorkoutDayData;
