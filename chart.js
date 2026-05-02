// Developed by CR Prince
// Advanced TradingView-style Chart Engine via ApexCharts

import { getIndiaData, getStatesData, getSectorData } from './data.js';

let mainChartInstance = null;
let sectorChartInstance = null;

const darkTheme = {
  mode: 'dark',
  palette: 'palette1',
  monochrome: { enabled: false }
};

export function initCharts(viewMode = 'current') {
  renderMainChart(viewMode);
  renderSectorChart();
}

export function updateCharts(viewMode) {
  if (mainChartInstance) {
    mainChartInstance.destroy();
  }
  renderMainChart(viewMode);
}

function renderMainChart(viewMode) {
  const indiaData = getIndiaData();
  const categories = indiaData.map(d => d.year);
  
  let seriesData = [];
  let colors = [];
  let yaxisTitle = '';

  if (viewMode === 'current') {
    seriesData = [{ name: 'India GDP', data: indiaData.map(d => d.value) }];
    colors = ['#2962FF'];
    yaxisTitle = 'USD Billions';
  } else if (viewMode === 'prev') {
    seriesData = [
      { name: 'Current Year', data: indiaData.map(d => d.value) },
      { name: 'Previous Year', data: indiaData.map(d => d.prevValue) }
    ];
    colors = ['#2962FF', '#AA00FF'];
    yaxisTitle = 'USD Billions';
  } else if (viewMode === 'yoy') {
    seriesData = [{ name: 'YoY Growth %', data: indiaData.map(d => d.pctChange) }];
    colors = ['#00E676'];
    yaxisTitle = 'Growth Percentage (%)';
  }

  const options = {
    series: seriesData,
    chart: {
      type: viewMode === 'yoy' ? 'bar' : 'area',
      height: '100%',
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      toolbar: { show: true, tools: { download: false, selection: true, zoom: true, pan: true } }
    },
    colors: colors,
    fill: {
      type: viewMode === 'yoy' ? 'solid' : 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#8E95A5' } },
      tooltip: { enabled: false } // Custom crosshair handling
    },
    yaxis: {
      title: { text: yaxisTitle, style: { color: '#8E95A5', fontWeight: 500 } },
      labels: { style: { colors: '#8E95A5' }, formatter: (val) => val.toFixed(1) }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    theme: darkTheme,
    tooltip: {
      theme: 'dark',
      x: { show: true },
      y: { formatter: (val) => val.toFixed(2) }
    }
  };

  mainChartInstance = new ApexCharts(document.querySelector("#main-chart"), options);
  mainChartInstance.render();
}

function renderSectorChart() {
  const sectorData = getSectorData();
  const options = {
    series: sectorData.map(d => d.value),
    chart: { type: 'donut', height: '100%', fontFamily: 'Inter, sans-serif', background: 'transparent' },
    labels: sectorData.map(d => d.name),
    colors: ['#2962FF', '#AA00FF', '#00E676'],
    stroke: { show: true, colors: ['#11141D'], width: 2 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: { donut: { size: '75%', labels: { show: true, name: { color: '#8E95A5' }, value: { color: '#FFF' } } } }
    },
    theme: darkTheme,
    legend: { position: 'right', labels: { colors: '#8E95A5' } }
  };

  sectorChartInstance = new ApexCharts(document.querySelector("#sector-chart"), options);
  sectorChartInstance.render();
}
