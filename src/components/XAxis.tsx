import { extent } from 'd3-array';
import {
  ScaleBand,
  scaleBand,
  scaleLinear,
  scalePoint,
} from 'd3-scale';
import React, { FC } from 'react';

import {
  paddingInner,
  paddingOuter,
} from '../utils/bars';
import { isOfType } from '../utils/isOfType';
import { AnyScale } from '../utils/scales';
import {
  defaultPath,
  defaultTickFormat,
  ELabelOrientation,
  IAxis,
  TAxisValue,
} from './YAxis';

const positionTick = (value: TAxisValue, scale: any, i: number) => {
  const offset = isOfType<ScaleBand<any>>(scale, 'paddingInner')
    ? scale.bandwidth() / 2
    : 0;

  const v = isOfType<ScaleBand<any>>(scale, 'paddingInner')
    ? Number(scale(String(i))) + offset
    : scale(value);
  return `(${v}, 0)`
}

const XAxis: FC<IAxis> = ({
  labelFormat,
  values = [],
  tickSize = 2,
  width,
  height,
  path,
  top = 0,
  left = 0,
  scale = 'band',
  domain,
  padding,
  tickFormat = defaultTickFormat,
  labelOrientation = ELabelOrientation.HORIZONTAL,
}) => {
  if (scale === 'linear' && values.length > 0 && typeof values[0] === 'string') {
    throw new Error('Linear axis can not accept string values');
  }
  if (scale === 'band' && !padding) {
    console.warn('band scale provided without padding settings');
  }

  let Scale: AnyScale;
  switch (scale) {
    case 'linear':
      Scale = scaleLinear()
        .domain(extent(domain ? [0, ...domain as number[]] : values as number[]) as any)
        .rangeRound([0, width]);
      break;
    case 'band':
      const steps = new Array(values.length).fill('').map((_, i) => String(i))
      Scale = scaleBand().domain(steps)
        .paddingInner(padding ? paddingInner(padding) : 0.1)
        .paddingOuter(padding ? paddingOuter(padding) : 0.2)
        .align(0.5)
        .rangeRound([0, width]);

      break;
    case 'point':
      Scale = scalePoint()
        .range([Number(width) / 4, Number(width) * (3 / 4)])
        .domain(values as string[]);
      break;
  }

  const transform = `${left}, ${top}`;

  const pathD = `M0,0 L${width},0`;
  const axisPath = { ...defaultPath, ...(path ?? {}) };
  const { fill, opacity, stroke, strokeOpacity, strokeWidth } = axisPath;

  const ticks: any[] = (values.length === 0 && scale === 'linear')
    ? Scale.domain()
    : values;

  return (
    <g className="x-axis"
      transform={`translate(${transform})`}
      fill="none"
      fontSize="10"
      fontFamily="sans-serif"
      textAnchor="middle">
      <path className="domain"
        stroke={stroke}
        d={pathD}
        fill={fill}
        opacity={opacity}
        shapeRendering="auto"
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
      ></path>

      {
        ticks.map((v, i) => {
          const tickOffset = positionTick(v, Scale, i);
          const label = scale === 'band' ? String(values[i]) : String(v);
          const thisFormat = typeof tickFormat === 'function' ? tickFormat(label, i) : tickFormat;
          return (
            <g
              aria-hidden={scale !== 'band'}
              role={scale === 'band' ? 'row' : ''}
              key={`x-axis-${v}.${label}.${i}`}
              className="tick"
              opacity="1"
              textAnchor="middle"
              transform={`translate${tickOffset}`}>
              <line stroke={stroke}
                x1={0}
                y2={`${tickSize}`}
                fill="none"
                opacity={opacity}
                shapeRendering="auto"
                strokeOpacity="1"
                strokeWidth="1">
              </line>

              <text
                role={scale === 'band' ? 'columnheader' : ''}
                fill={thisFormat.stroke}
                fontSize={thisFormat.fontSize}
                textAnchor={labelOrientation === ELabelOrientation.HORIZONTAL ? 'middle' : 'start'}
                writingMode={labelOrientation === ELabelOrientation.HORIZONTAL ? 'horizontal-tb' : 'vertical-lr'}
                height={height}
                dy={labelOrientation === ELabelOrientation.HORIZONTAL ? '1em' : '20'}>
                {labelFormat ? labelFormat('x', label, i) : label}
              </text>
            </g>
          )
        })
      }
    </g>
  )
}

export default XAxis;
