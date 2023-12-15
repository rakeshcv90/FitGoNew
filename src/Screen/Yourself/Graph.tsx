import React from 'react';

import {
  Canvas,
  Circle,
  Line,
  Path,
  runTiming,
  Skia,
  SkPath,
  useComputedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';

import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import {Easing, View, Pressable, Text, StyleSheet} from 'react-native';

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
export type DataPoint = {
  date: string;
  value: number;
};

export const originalData: DataPoint[] = [
  {date: '2000-02-01T05:00:00.000Z', value: 0},
  {date: '2000-02-12T05:00:00.000Z', value: 0},
  {date: '2000-03-03T05:00:00.000Z', value: 0},
  {date: '2000-04-14T05:00:00.000Z', value: 0},
  {date: '2000-05-05T05:00:00.000Z', value: 0},
  {date: '2000-06-05T05:00:00.000Z', value: 0},
  {date: '2000-06-07T05:00:00.000Z', value: 0},
  {date: '2000-02-08T05:00:00.000Z', value: 0},
  {date: '2000-02-09T05:00:00.000Z', value: 0},
  {date: '2000-02-10T05:00:00.000Z', value: 0},
  {date: '2000-02-11T05:00:00.000Z', value: 0},
  {date: '2000-02-12T05:00:00.000Z', value: 0},
  {date: '2000-02-13T05:00:00.000Z', value: 0},
  {date: '2000-02-14T05:00:00.000Z', value: 0},
  {date: '2000-02-15T05:00:00.000Z', value: 0},
];

export const animatedData: DataPoint[] = [
  {date: '2000-02-01T05:00:00.000Z', value: 500},
  {date: '2000-02-02T05:00:00.000Z', value: 400.0},
  {date: '2000-02-03T05:00:00.000Z', value: 300.0},
  {date: '2000-02-04T05:00:00.000Z', value: 400.0},
  {date: '2000-02-05T05:00:00.000Z', value: 500.0},
  {date: '2000-02-06T05:00:00.000Z', value: 1000.98},
  {date: '2000-02-07T05:00:00.000Z', value: 500.0},
  {date: '2000-02-08T05:00:00.000Z', value: 200.0},
  {date: '2000-02-09T05:00:00.000Z', value: 1300.75},
  {date: '2000-02-10T05:00:00.000Z', value: 400.0},
  {date: '2000-02-11T05:00:00.000Z', value: 500.0},
  {date: '2000-02-12T05:00:00.000Z', value: 900.98},
  {date: '2000-02-13T05:00:00.000Z', value: 600.0},
  {date: '2000-02-14T05:00:00.000Z', value: 250.0},
  {date: '2000-02-15T05:00:00.000Z', value: 330.67},
];

export const animatedData2: DataPoint[] = [
  {date: '2000-02-01T05:00:00.000Z', value: 70},
  {date: '2000-02-12T05:00:00.000Z', value: 68.0},
  {date: '2000-03-03T05:00:00.000Z', value: 65.0},
  {date: '2000-04-14T05:00:00.000Z', value: 61.0},
  {date: '2000-05-05T05:00:00.000Z', value: 59.0},
  {date: '2000-06-05T05:00:00.000Z', value: 56.0},
  {date: '2000-06-07T05:00:00.000Z', value: 56.0},
];

const LineChart = () => {
  const transition = useValue(1);
  const state = useValue({
    current: 0,
    next: 1,
  });

  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = 360;

  const makeGraph = (data: DataPoint[]): GraphData => {
    const max = Math.max(...data.map(val => val.value));
    const min = Math.min(...data.map(val => val.value));
    const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

    const x = scaleTime()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<DataPoint>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
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
      duration: 750,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const graphData = [makeGraph(animatedData), makeGraph(originalData)];

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve;
    const end = graphData[state.current.next].curve;
    const result = start.interpolate(end, transition.current);
    console.log(
      result?.contains(20.625, 259.69632904093794),
      result?.toSVGString().includes(44.910714285714285),
    );
    // const length = result?.le;
    // const pointOnPath = result?.point(length);

    // Check if the x and y values match the point on the path
    // const isMatchingPoint =
    //   Math.abs(pointOnPath.x - 20.625) < 1 &&
    //   Math.abs(pointOnPath.y - 259.69632904093794) < 1;
    //   console.log(isMatchingPoint)

    return result?.toSVGString() ?? '0';
  }, [state, transition]);

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
        <Path style="stroke" path={path} strokeWidth={4} color="red" />
        {animatedData.map((dataPoint, index) => {
          const xValue = scaleTime()
            .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
            .range([10, GRAPH_WIDTH - 10])(new Date(dataPoint.date));

          const yValue = scaleLinear()
            .domain([0, graphData[state.current.current].max])
            .range([GRAPH_HEIGHT, 35])(dataPoint.value);
          const final = path.current.split(' ').filter(item => {
            xValue == item;
          });
          // console.log(final);
          // if (path.current.includes(xValue)) {
          return (
            //     <Canvas key={index}>
            //         <Line
            //   p1={vec(10, 370)}
            //   p2={vec(400, 370)}
            //   color="lightgrey"
            //   style="stroke"
            //   strokeWidth={1}
            // />
            <Circle cx={xValue} cy={yValue} r={3} color={'red'} />
            // </Canvas>
          );
        })}
      </Canvas>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            transitionStart(0);
            setTimeout(() => {
              transitionStart(1);
            }, 2000);
          }}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Graph 1</Text>
        </Pressable>
        <Pressable
          onPress={() => transitionStart(1)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Graph 2</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default LineChart;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // backgroundColor: 'white',
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
