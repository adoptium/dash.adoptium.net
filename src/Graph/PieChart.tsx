import React, { FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Graph.css';

interface PieChartProps {
  data?: any;
  name?: string;
  showInLegend?: boolean;
  dataLabels?: boolean;
  colors?: string[] | undefined;
}

const PieChart: FC<PieChartProps> = ({ data, name, showInLegend = false, dataLabels = false, colors = undefined }) => {
  if (!data) return null;

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: name
    },
    subtitle: {
      text: 'Data is from: <a href="https://api.adoptium.net/v3/stats/downloads/total" target="_blank" rel="noopener noreferrer">api.adoptium.net/v3/stats/downloads/total</a>',
      useHTML: true
    },
    tooltip: {
      formatter: function() {
        if (!this || !this.y) return '';
        const nbDownloads = Highcharts.numberFormat(this.y, 0, '.', ' ');
        return this.point.name + '<b> ' + this.point.percentage.toFixed(2) + '% </b><br/><b> ' + nbDownloads + '</b> downloads';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: dataLabels,
          format: '<b>{point.name}</b>: {point.percentage:.2f} %'
        },
        colors,
        shadow: true,
        showInLegend
      }
    },
    series: [{
      name,
      colorByPoint: true,
      data
    }]
  };

  return (
    <div className="chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
