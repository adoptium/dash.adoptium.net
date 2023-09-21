import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import startCase from 'lodash/startCase'
import './Graph.css'

interface BarChartProps {
  data?: { [key: string]: number };
  name: string;
  startCaseKeys?: boolean;
}

export default class BarChart extends Component<BarChartProps> {
  render () {
    const { data, name, startCaseKeys } = this.props
    if (!data) return null

    const options = {
      accessibility: {
        enabled: false,
      },
      chart: {
        type: 'column'
      },
      title: {
        text: name
      },
      subtitle: {
        text: 'Data is from: <a href="https://api.adoptium.net/v3/stats/downloads/total" target="_blank" rel="noopener noreferrer">api.adoptium.net/v3/stats/downloads/total</a>',
        useHTML: true
      },
      xAxis: {
        categories: Object.keys(data).map(v => startCaseKeys ? startCase(v) : v),
        crosshair: true
      },
      yAxis: {
        title: {
          text: 'Downloads'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (!this || !this.y) return ''
              return Highcharts.numberFormat(this.y, 0, '.', ' ')
            }
          },
          pointPadding: 0.2,
          borderWidth: 0,
          minPointLength: 10,
          shadow: true
        }
      },
      series: [{
        name,
        data: Object.values(data)
      }]
    }

    return (
      <div className='chart'>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  }
}
