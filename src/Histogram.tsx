import { extent } from 'd3-array';
import { schemeSet3 } from 'd3-scale-chromatic';
import React, { FC } from 'react';
import { SpringConfig } from 'react-spring';

import { EChartDirection } from './BarChart';
import HistogramBars from './components/Bars/HistogramBars';
import Base from './components/Base';
import Grid from './components/Grid';
import { TLabelComponent } from './components/Label';
import { TTipFunc } from './components/ToolTip';
import XAxis from './components/XAxis';
import YAxis, {
  ELabelOrientation,
  TAxisLabelFormat,
} from './components/YAxis';
import { ISVGLineStyle } from './legacy/types';

export enum EGroupedBarLayout {
  GROUPED,
  STACKED,
  OVERLAID,
}

export interface IBarChartDataSet {
  borderColors?: string[];
  colors?: string[];
  label: string;
  data: number[];
}
export enum EColorManipulations {
  'negate' = 'negate',
  'lighten' = 'lighten',
  'darken' = 'darken',
  'saturate' = 'saturate',
  'desaturate' = 'desaturate',
  'whiten' = 'whiten',
  'blacken' = 'blacken',
  'fade' = 'fade',
  'opaquer' = 'opaquer',
  'rotate' = 'rotate',
};

export interface IGroupDataItem {
  label: string;
  groupLabel?: string;
  colorRef?: string; // String which can be used to return same colour value
  value: number;
  side?: 'left' | 'right'; // For Tornados
}

export interface IHistogramBar {
  // Padding for the inside of grouped datasets
  grouped: {
    paddingInner: number;
    paddingOuter: number;
  }
  // Padding for the outside of grouped datasets or single datasets
  paddingOuter: number;
  paddingInner: number;
  // @deprecated in 3.0
  hover?: Partial<Record<EColorManipulations, number>>,
  /**  
   * @description When bars are rendered as EGroupedBarLayout.OVERLAID (offset between the two overlaid bars)
   * If < 1 then use it as a percentage offset of the bar width otherwise use as a pixel offset
   */
  overlayMargin: number;
  rx?: number;
  ry?: number;
}

export interface IHistogramData {
  bins: [number, number][];
  counts: IBarChartDataSet[];
  colorScheme?: string[];
  title?: string;
}
export type IGroupData = IGroupDataItem[][];


export interface IBarChartData {
  bins: string[];
  counts: IBarChartDataSet[];
  colorScheme?: string[];
  title?: string;
}

// @TODO deprecate this interface in favour of <Grids /> actual props
export interface IGrid {
  x: {
    height: number;
    ticks: number;
    visible: boolean;
    style: ISVGLineStyle;
  };
  y: {
    style: ISVGLineStyle;
    ticks: number;
    visible: boolean;
  };
}

export interface IHistogramProps {
  animation?: SpringConfig;
  axisLabelFormat?: TAxisLabelFormat;
  colorScheme?: string[];
  data: IHistogramData;
  direction?: EChartDirection;
  id?: string;
  grid?: IGrid;
  height: number;
  LabelComponent?: TLabelComponent;
  hoverColorScheme?: string[];
  showLabels?: boolean[];
  tip?: TTipFunc;
  visible?: Record<string, boolean>;
  width: number;
  xAxisHeight?: number;
  xAxisLabelOrientation?: ELabelOrientation;
  yAxisWidth?: number;
  /** @description Chart <title /> */
  title?: string;
  description?: string;
  bars?: {
    rx?: number;
    ry?: number;
  }
}

/**
 * A Histogram renders continuous data and thus use a ScaleLinear x & y axis 
 */
const Histogram: FC<IHistogramProps> = ({
  animation,
  axisLabelFormat,
  colorScheme = schemeSet3,
  data,
  direction = EChartDirection.VERTICAL,
  id = '',
  grid,
  height,
  hoverColorScheme,
  LabelComponent,
  showLabels = [],
  tip,
  visible,
  width,
  xAxisHeight,
  xAxisLabelOrientation = ELabelOrientation.HORIZONTAL,
  yAxisWidth,
  title,
  description,
  bars,
}) => {
  if (!yAxisWidth) {
    yAxisWidth = direction === EChartDirection.VERTICAL ? 40 : 100;
  }
  if (!xAxisHeight) {
    xAxisHeight = direction === EChartDirection.VERTICAL ? 100 : 40;
  }

  if (width === 0) {
    return null;
  }

  const bins = data.bins.reduce((p, n) => p.concat(Array.isArray(n) ? n : [n]), [] as number[]);
  const continuousDomain = extent(bins) as [number, number];
  const domain = extent(data.counts.reduce((p, n) => p.concat(n.data), [] as number[])) as [number, number];

  return (
    <Base
      width={width + 30} // @TODO work out why without this the bars exceed the chart
      title={title}
      description={description}
      id={id}
      height={height}>

      {
        grid && <Grid
          left={yAxisWidth}
          height={height - xAxisHeight}
          svgProps={{ ...grid.x.style }}
          lines={{
            vertical: grid.y.ticks,
            horizontal: grid.x.ticks,
          }}
          width={width - yAxisWidth} />
      }

      <HistogramBars
        colorScheme={colorScheme}
        hoverColorScheme={hoverColorScheme}
        left={yAxisWidth}
        height={height - xAxisHeight}
        width={width - yAxisWidth}
        values={data.counts}
        config={animation}
        id={id}
        bins={data.bins}
        showLabels={showLabels}
        direction={direction}
        LabelComponent={LabelComponent}
        domain={domain}
        continuousDomain={continuousDomain}
        tip={tip}
        visible={visible}
        rx={bars?.rx ?? 0}
        ry={bars?.ry ?? 0}
      />

      <YAxis
        width={yAxisWidth}
        height={height - xAxisHeight}
        labelFormat={axisLabelFormat}
        scale="linear"
        domain={direction === EChartDirection.HORIZONTAL ? continuousDomain : domain}
        values={direction === EChartDirection.HORIZONTAL
          ? [
            continuousDomain[0],
            ((continuousDomain[1] - continuousDomain[0]) * 1) / 3,
            ((continuousDomain[1] - continuousDomain[0]) * 2) / 3,
            continuousDomain[1],
          ]
          : domain
        }
      />

      <XAxis
        width={width - yAxisWidth}
        height={xAxisHeight}
        top={height - xAxisHeight}
        left={yAxisWidth}
        labelFormat={axisLabelFormat}
        labelOrientation={xAxisLabelOrientation}
        scale="linear"
        domain={direction === EChartDirection.HORIZONTAL ? domain : continuousDomain}
        values={direction === EChartDirection.HORIZONTAL
          ? domain
          : [
            continuousDomain[0],
            ((continuousDomain[1] - continuousDomain[0]) * 1) / 3,
            ((continuousDomain[1] - continuousDomain[0]) * 2) / 3,
            continuousDomain[1],
          ]}
      />

    </Base>
  )

}

export default Histogram;
