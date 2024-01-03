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

import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import {Easing, View, Pressable, Text, StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
export type DataPoint = {
  date: string;
  value: number;
};

const LineChart = ({resultData, zeroData}: any) => {
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
  const GRAPH_WIDTH = 360;
  const [late, setLate] = useState(false);
  const [circles, setCircle] = useState([]);
  const t = Array(resultData.length).fill(0);

  const makeGraph = (data: DataPoint[]): GraphData => {
    const max = Math.max(...data.map((val: any) => val.weight));
    const min = Math.min(...data.map((val: any) => val.weight));
    const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 150]);

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
  const max = Math.max(...resultData.map((val: any) => val.weight));

  const transitionStart = (end: number) => {
    state.current = {
      current: end,
      next: state.current.current,
    };
    transition.current = 0;
    runTiming(transition, 1, {
      duration: 750,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const graphData = [makeGraph(zeroData), makeGraph(resultData)];

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve;
    const end = graphData[state.current.next].curve;
    const result = start.interpolate(end, transition.current);
    return result?.toSVGString() ?? '0';
  }, [state, transition]);

  const final = path.current
    .split(' ')
    .map(item => parseFloat(item.match(/-?\d+(\.\d+)?/)?.[0]))
    .filter(num => !isNaN(num));
  const test =
    '  M15 275L24.306 275C33.611 275 52.222 275 70.833 275C89.444 275 108.056 275 126.667 275C145.278 275 163.889 275 182.5 275C201.111 275 219.722 275 238.333 275C256.944 275 275.556 275 294.167 275C312.778 275 331.389 275 340.694 275L350 275';
  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
        }}>
        <Line
          p1={vec(10, 130)}
          p2={vec(400, 130)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 250)}
          p2={vec(400, 250)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(10, 370)}
          p2={vec(400, 370)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        {/* <Path style="stroke" path={test} strokeWidth={4} color="blue" /> */}
        <Path style="stroke" path={path} strokeWidth={4} color="red" />
        {late &&
          resultData.map((dataPoint, index: number) => {
            const xValue = scaleTime()
              .domain([
                new Date(resultData[0].date),
                new Date(resultData[resultData.length - 1].date),
              ])
              .range([15, GRAPH_WIDTH - 10])(new Date(dataPoint.date));

            const yValue = scaleLinear()
              .domain([0, max])
              .range([GRAPH_HEIGHT, 150])(dataPoint.weight);
            // console.log('xValue', dataPoint?.weight, yValue);
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
                    color={'red'}
                  />
                  {/* <RoundedRect
                x={xValue-10}
                y={yValue+40}
                width={80}
                height={50}
                r={10}
                color={AppColor.RED}
              > */}
                  {(resultData[resultData.length - 1].weight ==
                    dataPoint?.weight ||
                    resultData[0].weight == dataPoint?.weight) && (
                    <SkiaText
                      x={
                        resultData[resultData.length - 1].weight ==
                        dataPoint?.weight
                          ? xValue - 30
                          : xValue - 10
                      }
                      y={yValue + 40}
                      text={dataPoint?.weight}
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
