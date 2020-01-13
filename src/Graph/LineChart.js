import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class LineChart extends Component {
    render() {
        const { series, categories, name } = this.props;
        if (!series) return null;

        const options = {
            chart: {
                type: 'line'
            },
            title: {
                text: name
            },
            subtitle: {
                text: 'Data is from : <a href="https://api.adoptopenjdk.net/" target="_blank" rel="noopener noreferrer">api.adoptopenjdk.net</a>',
                useHTML: true,
            },
            xAxis: {
                categories
            },
            yAxis: {
                title: {
                    text: 'Downloads'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false,
                }
            },
            series
        }

        return <div style={{boxShadow: "0px 2px 4px rgba(0,0,0,0.06)", marginBottom: 40}}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>;
    }
}