import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import startCase from 'lodash/startCase';

export default class BarChart extends Component {
    render() {
        const { data, name, startCaseKeys } = this.props;
        if (!data) return null;
        const options = {
            chart: {
                type: 'column'
            },
            title: {
                text: name
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
                    pointPadding: 0.2,
                    borderWidth: 0,
                    minPointLength: 10,
                    shadow: true
                },
            },
            series: [{
                name,
                data: Object.values(data),
            }]
        }

        return <div style={{boxShadow: "0px 2px 4px rgba(0,0,0,0.06)", marginBottom: 40}}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>;
    }
}