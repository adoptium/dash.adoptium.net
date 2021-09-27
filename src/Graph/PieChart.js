import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Graph.css';

export default class PieChart extends Component {
    render() {
        const { data, name, showInLegend = false, dataLabels = false, colors = undefined } = this.props;
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
                useHTML: true,
            },
            tooltip: {
                formatter: function () {
                    return this.point.name + '<b> ' + this.point.percentage.toFixed(2) + '% </b><br/><b> ' + this.y + '</b> downloads';
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
        }
        return <div className="chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>;
    }
}