import React, { FC } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './Graph.css'

interface LineChartProps {
  series?: Highcharts.SeriesOptionsType[];
  categories?: string[];
  name?: string;
}

const LineChart: FC<LineChartProps> = ({ series, categories, name }) => {
  if (!series) return null;

  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: name,
    },
    subtitle: {
      text: 'Data is from: <a href="https://api.adoptium.net/v3/stats/downloads/tracking" target="_blank" rel="noopener noreferrer">api.adoptium.net/v3/stats/downloads/tracking</a>',
      useHTML: true,
    },
    xAxis: {
      categories,
    },
    yAxis: {
      title: {
        text: 'Downloads',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series,
  };

  return (
    <div className="chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChart;
