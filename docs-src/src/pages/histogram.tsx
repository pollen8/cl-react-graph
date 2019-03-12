import merge from 'deepmerge';
import React, {
  useReducer,
  useState,
} from 'react';
import ReactDataSheet from 'react-datasheet';

import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';

import { HorizontalHistogram } from '../../../src';
import Histogram, {
  IAxes,
  IGrid,
  IHistogramData,
} from '../../../src/Histogram';
import Legend from '../../../src/Legend';
import { axis as defaultAxis } from '../../../src/utils/defaults';
import { DeepPartial } from '../../../src/utils/types';
import { GridOptionsFactory } from '../components/GridOptions';
import JSXToString from '../components/JSXToString';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { TabContainer } from '../components/TabContainer';
import {
  data,
  grid,
  theme,
} from '../data';

export const axis: DeepPartial<IAxes> = {
  x: {
    // ...defaultAxis.x,
    dateFormat: '%d-%b-%y',
    scale: 'TIME',
  },
  y: {
    // ...defaultAxis.y,
    ticks: 3,
  },
};

const tipContentFns = [
  (bins, i, d) =>
    bins[i] + '<br />HI THere ' + d.toFixed(2),
  (bins, i, d) =>
    bins[i] + '<br />Bookay ' + d.toFixed(2),
];

const now = new Date();
data.bins = data.bins.map((d, i) => new Date(new Date().setDate(now.getDate() + i)).toLocaleString());
const dataLegendData = {
  bins: data.counts.map((c) => c.label),
  counts: [{
    data: data.counts.map((c) => c.data.reduce((p, n) => p + n, 0)),
    label: '',
  }],
};

interface IInitialState {
  axis: DeepPartial<IAxes>;
  chartType: string;
  data: IHistogramData;
  delay: number;
  duration: number;
  grid: IGrid;
}
const initialSate: IInitialState = {
  axis,
  chartType: 'Histogram',
  data,
  delay: 0,
  duration: 400,
  grid,
};

export type GridActions = { type: 'setGridTicks', ticks: number, axis: 'x' | 'y' }
  | { type: 'setGridStroke', color: string, axis: 'x' | 'y' }
  | { type: 'setGridStrokeOpacity', opacity: number, axis: 'x' | 'y' };

type Actions = { type: 'setChartType'; chartType: string }
  | { type: 'setData', data: IHistogramData }
  | { type: 'setDuration', duration: number }
  | { type: 'setDelay', delay: number }
  | GridActions
  ;

export function gridReducer<S extends any, A extends any>(state: S, action: A): any {
  switch (action.type) {
    case 'setChartType':
      return { ...state, chartType: action.chartType };
    case 'setData':
      return { ...state, data: action.data };
    case 'setDuration':
      return { ...state, duration: action.duration };
    case 'setDelay':
      return { ...state, delay: action.delay };
    case 'setGridTicks':
      return merge(state, { grid: { [action.axis]: { ticks: action.ticks } } });
    case 'setGridStroke':
      return merge(state, { grid: { [action.axis]: { style: { stroke: action.color } } } });
    case 'setGridStrokeOpacity':
      return merge(state, { grid: { [action.axis]: { style: { 'stroke-opacity': action.opacity } } } });
    default:
      return state;
  }
}

function reducer(state: IInitialState, action: Actions) {
  state = gridReducer(state, action);
  switch (action.type) {
    case 'setChartType':
      return { ...state, chartType: action.chartType };
    case 'setData':
      return { ...state, data: action.data };
    case 'setDuration':
      return { ...state, duration: action.duration };
    case 'setDelay':
      return { ...state, delay: action.delay };
    case 'setGridTicks':
      return merge(state, { grid: { [action.axis]: { ticks: action.ticks } } });
    case 'setGridStroke':
      return merge(state, { grid: { [action.axis]: { style: { stroke: action.color } } } });
    case 'setGridStrokeOpacity':
      return merge(state, { grid: { [action.axis]: { style: { 'stroke-opacity': action.opacity } } } });
    default:
      return state;
  }
}

export const dataToSpreadSheet = (datum: IHistogramData): any => {
  const speadSheetData: any = [];

  datum.bins.forEach((b, i) => {
    if (!speadSheetData[i]) {
      speadSheetData[i] = [];
    }
    speadSheetData[i][0] = { value: b };
  });
  datum.counts.forEach((c, i) => {
    c.data.forEach((d, x) => {
      if (!speadSheetData[x]) {
        speadSheetData[x] = [];
      }
      speadSheetData[x][i + 1] = { value: d };
    });
  });
  return speadSheetData;
};
const GridOptions = GridOptionsFactory<(action: Actions) => void, IInitialState>();

const HistogramExample = () => {
  const [tab, setTab] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialSate);
  const [visible, setVisible] = useState({});
  const speadSheetData = dataToSpreadSheet(state.data);
  const Chart = state.chartType === 'Histogram' ? Histogram : HorizontalHistogram;
  const chart = <Chart data={state.data}
    axis={state.axis}
    grid={state.grid}
    width={'100%'}
    height={300}
    delay={state.delay}
    duration={state.duration}
    visible={visible}
    colorScheme={theme}
    tipContentFn={tipContentFns[0]}
  />;
  return (
    <Layout>
      <SEO title="Histogram" description="" />
      <Typography variant="h2">Histogram</Typography>
      <div>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                {chart}
                <Legend
                  theme={theme}
                  data={dataLegendData}
                  onSelect={(key) => {
                    setVisible({ ...visible, [key]: visible.hasOwnProperty(key) ? !visible[key] : false });
                  }}
                  visible={visible}
                />
              </CardContent>
            </Card>
            <br />
            <Card>
              <CardContent>
                <JSXToString component={chart} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                  <Tab label="Data" />
                  <Tab label="Styling" />
                  <Tab label="Animation" />
                  <Tab label="Grid" />
                </Tabs>
                {
                  tab === 0 && <TabContainer>
                    <ReactDataSheet<any, any> data={speadSheetData}
                      valueRenderer={(cell) => cell.value}
                      sheetRenderer={(props) => (
                        <table className={props.className + ' my-awesome-extra-class'}>
                          <thead>
                            <tr>
                              <th className="action-cell">Bin</th>
                              {
                                state.data.counts.map((count) => (<th key={count.label} className="action-cell">
                                  {count.label}
                                </th>))
                              }
                            </tr>
                          </thead>
                          <tbody>
                            {props.children}
                          </tbody>
                        </table>
                      )}
                      onCellsChanged={(changes) => {
                        changes.forEach(({ cell, row, col, value }) => {
                          if (col === 0) {
                            state.data.bins[row] = value;
                          } else {
                            state.data.counts[col - 1].data[row] = Number(value);
                          }
                        });
                        dispatch({ type: 'setData', data: state.data });
                      }} />
                  </TabContainer>
                }
                {
                  tab === 1 && <TabContainer>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <TextField
                          select
                          label="Chart direction"
                          value={state.chartType}
                          onChange={(e) => {
                            dispatch({ type: 'setChartType', chartType: e.target.value });
                          }}
                        >
                          <MenuItem value="Histogram">
                            Histogram
                            </MenuItem>
                          <MenuItem value="HorizontalHistogram">
                            HorizontalHistogram
                            </MenuItem>

                        </TextField>
                      </Grid>
                    </Grid>
                  </TabContainer>
                }
                {
                  tab === 2 && <TabContainer>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <TextField
                          id="animationDuration"
                          value={state.duration}
                          label="Duration"
                          onChange={(e) => dispatch({ type: 'setDuration', duration: Number(e.target.value) })}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="animationDelay"
                          value={state.delay}
                          label="Delay"
                          onChange={(e) => dispatch({ type: 'setDelay', delay: Number(e.target.value) })}
                        />
                      </Grid>
                    </Grid>
                  </TabContainer>
                }
                {
                  tab === 3 && <TabContainer>
                    <GridOptions
                      dispatch={dispatch}
                      state={state} />
                  </TabContainer>
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default HistogramExample;
