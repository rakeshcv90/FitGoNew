import React, {useEffect} from 'react';

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


const LineChart = ({resultData, zeroData}: any) => {
  const transition = useValue(1);
  const state = useValue({
    current: 0,
    next: 1,
  });
  useEffect(() => {
    transitionStart(0);
    setTimeout(() => {
      transitionStart(1);
    }, 2000); 
  }, []);
  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = 360;

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
    
    console.log(max, min, curvedLine)
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
  const graphData = [makeGraph(zeroData), makeGraph(resultData)];

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve;
    const end = graphData[state.current.next].curve;
    const result = start.interpolate(end, transition.current);

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
        {/* {resultData.map((dataPoint, index) => {
          const xValue = scaleTime()
          .domain([new Date(resultData[0].date), new Date(resultData[resultData.length - 1].date)])
            .range([15, GRAPH_WIDTH - 10])(new Date(dataPoint.date));

          const yValue = scaleLinear()
            .domain([0, graphData[state.current.current].max])
            .range([GRAPH_HEIGHT, 150])(dataPoint.value);
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
        })} */}
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
