
import * as d3 from 'd3';

export const grid = {
  x: {
    style: {
      'stroke': '#eeAA00',
      'stroke-opacity': 0.4,
    },
    ticks: 5,
  },
  y: {
    height: 20,
    style: {
      'stroke-opacity': 0.4,
    },
    ticks: 5,
  },
};

export const data = {
  bins: ['Data 1', 'Data 6', 'Data 3', 'Dat 4'],
  counts: [
    {
      borderColors: d3.schemeCategory20,
      colors: d3.schemeCategory20,
      data: [1, 2, 3, 4],
      label: 'Data 1',
    },
    {
      borderColors: d3.schemeCategory20,
      colors: d3.schemeCategory20b,
      data: [13, 2, 1, 5],
      label: 'Data 2',
    },
  ],
  grid,
};

export const data2 = {
  bins: ['bin 1', 'bin 2', 'bin 3', 'bin 4', 'bin 5', 'bin 6', 'bin 7'],
  counts: [
    {
      borderColors: ['red'],
      data: [1, 2, 3, 4, 5, 6, 7],
      label: 'Data 1',
    },
  ],
};

export const data3 = {
  bins: ['bin 1', 'bin 2', 'bin 3'],
  counts: [
    {
      borderColors: ['red'],
      data: [100, 50, 40],
      label: 'Data 1',
    },
    {
      borderColors: ['red'],
      data: [32, 1, 5, 0],
      label: 'Data 2',
    },
  ],
};

export const axis = {
  x: {
    label: 'X Axis',
    text: {
      style: {
        'dy': '.35em',
        'text-anchor': 'start',
        'transform': 'rotate(45)',
        'x': 4,
        'y': 0,
      },
    },
    tickSize: 0,
  },
  y: {
    label: 'Y Axis!',
    style: {
      fill: 'none',
      stroke: '#eeAA00',
    },
    text: {
      style: {
        fill: '#eeAA00',
      },
    },
    tickSize: 20,
    ticks: 3,
    width: 50,
  },
};