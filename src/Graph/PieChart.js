import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class PieChart extends Component {
    render() {
        const { data, name } = this.props;
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
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.percentage.toFixed(2) + '% </b><br/>' +
                        this.y + ' downloads';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    //showInLegend: true
                }
            },
            series: [{
                name: name,
                colorByPoint: true,
                data
            }]
        }

        return <div style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.06)", marginBottom: 40 }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>;
    }
}