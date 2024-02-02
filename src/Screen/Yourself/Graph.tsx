import React, {useEffect, useState} from 'react';

import {
  Canvas,
  Circle,
  Line,
  Path,
  Rect,
  RoundedRect,
  runTiming,
  Skia,
  SkPath,
  useComputedValue,
  useValue,
  vec,
  Text as SkiaText,
} from '@shopify/react-native-skia';

import {curveBasis, line, scaleLinear, scaleSequential, scaleTime} from 'd3';
import {Easing, View, Pressable, Text, StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import moment from 'moment';

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
export type DataPoint = {
  date: string;
  weight: number;
};

const LineChart = ({resultData, zeroData, home, currentW, targetW}: any) => {
  const transition = useValue(1);
  const state = useValue({
    current: 0,
    next: 1,
  });
  useEffect(() => {
    transitionStart(0);
    // setCircle(t);
    setTimeout(() => {
      transitionStart(1);
    }, 2000);
    setTimeout(() => {
      setLate(true);
    }, 3000);
  }, []);
  // useEffect(() => {
  //   setTimeout(() => {
  //     const x = circles.fill(circles[circles.length-1], circles[circles.length-1] - 1, circles[circles.length-1]);
  //     console.log(x);
  //     setCircle(x);
  //   }, 500);
  // }, []);
  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = DeviceWidth * 0.9;
  const [late, setLate] = useState(false);
  const maxWeight = Math.max(
    ...resultData.map((dataPoint: DataPoint) => dataPoint.weight),
  );
  const minWeight = Math.min(
    ...resultData.map((dataPoint: DataPoint) => dataPoint.weight),
  );

  const makeGraph = (data: DataPoint[]): GraphData => {
    const max = Math.max(...data.map((val: any) => val.weight));
    const min = Math.min(...data.map((val: any) => val.weight));
    const y = scaleLinear().domain([0, max]).range([300, 150]);

    const x = scaleTime()
      .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
      .range([15, GRAPH_WIDTH - 10]);
    const curvedLine = line<DataPoint>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.weight))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
      max,
      min,
      curve: skPath!,
    };
  };

  const transitionStart = (end: number) => {
    state.current = {
      current: end,
      next: state.current.current,
    };
    transition.current = 0;
    runTiming(transition, 1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const graphData = [makeGraph(zeroData), makeGraph(resultData)];
  const uniformValues = Array.from({length: 7}, (_, index) => {
    const factor = index / 7; // Linear interpolation factor
    return minWeight + factor * (maxWeight - minWeight);
  });

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve;
    const end = graphData[state.current.next].curve;
    const result = start.interpolate(end, transition.current);
    return result?.toSVGString() ?? '0';
  }, [state, transition]);

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
          marginTop: -DeviceHeigth * 0.04,
        }}>
        <Line
          p1={vec(10, 80)}
          p2={vec(400, 80)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 200)}
          p2={vec(400, 200)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 320)}
          p2={vec(400, 320)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        {/* <Line
          p1={vec(0, 0)}
          p2={vec(360, 350)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        /> */}
        {!home &&
          uniformValues.map((item: any, index: number) => {
            return (
              <SkiaText
                x={0}
                y={item}
                text={item.toFixed()}
                color={AppColor.BLACK}
              />
            );
          })}
        {/* <Path style="stroke" path={test} strokeWidth={4} color="blue" /> */}
        <Path
          style="stroke"
          path={path}
          strokeWidth={4}
          color={'rgba(208, 24, 24, 0.6)'}
        />
        {late &&
          home &&
          resultData.map((dataPoint: DataPoint, index: number) => {
            const xValue1 = scaleTime()
              .domain([
                new Date(resultData[0].date),
                new Date(resultData[resultData.length - 1].date),
              ])
              .range([5, GRAPH_WIDTH - 45])(new Date(dataPoint.date));
            const xValue = scaleTime()
              .domain([
                new Date(resultData[0].date),
                new Date(resultData[resultData.length - 1].date),
              ])
              .range([15, GRAPH_WIDTH - 10])(new Date(dataPoint.date));

            const yValue = scaleLinear()
              .domain([0, maxWeight])
              .range([300, 150])(dataPoint.weight);
            //console.log('xValue', dataPoint?.weight, yValue);
            // function isApproximatelyEqual(value, array, tolerance) {
            //   return array.some(item => Math.abs(value - item) <= tolerance);
            // }
            // if (isApproximatelyEqual(xValue,final, 2)) {
            return (
              //     <Canvas key={index}>
              //         <Line
              //   p1={vec(10, 370)}
              //   p2={vec(400, 370)}
              //   color="lightgrey"
              //   style="stroke"
              //   strokeWidth={1}
              // />
              late && (
                <>
                  <Circle
                    cx={xValue}
                    cy={
                      yValue
                      // resultData[resultData.length - 1].weight ==
                      //   dataPoint?.weight ||
                      // resultData[0].weight == dataPoint?.weight
                      //   ? yValue
                      //   : index % 2 == 0
                      //   ? yValue + 0
                      //   : yValue - 0
                    }
                    r={5}
                    color={AppColor.RED}
                  />

                  <SkiaText
                    x={xValue1}
                    y={335}
                    text={moment(dataPoint?.date).format('DD')}
                    color={AppColor.BLACK}
                  />
                  <SkiaText
                    x={xValue1 - 5}
                    y={350}
                    text={moment(dataPoint?.date).format('MMM')}
                    color={AppColor.BLACK}
                  />
                  <SkiaText
                    x={xValue1}
                    y={365}
                    text={moment(dataPoint?.date).format('YY')}
                    color={AppColor.BLACK}
                  />
                  {resultData[resultData.length - 1].weight ==
                    dataPoint?.weight && (
                    <SkiaText
                      x={
                        resultData[resultData.length - 1].weight ==
                        dataPoint?.weight
                          ? xValue - 30
                          : xValue - 10
                      }
                      y={yValue + 40}
                      text={`${targetW} kg`}
                      color={AppColor.RED}
                    />
                  )}
                  {resultData[0].weight == dataPoint?.weight && (
                    <SkiaText
                      x={ xValue - 10
                      }
                      y={yValue + 40}
                      text={`${currentW} kg`}
                      color={AppColor.RED}
                    />
                  )}
                  {/* </RoundedRect> */}
                </>
              )
              // </Canvas>
            );
            // }
          })}
      </Canvas>
    </View>
  );
};
export default LineChart;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    alignSelf: 'center',
    // justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonStyle: {
    marginRight: 20,
    backgroundColor: '#6231ff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 20,
  },
});
