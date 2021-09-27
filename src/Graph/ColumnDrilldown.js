import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from "highcharts/modules/drilldown.js";
import './Graph.css';
import { api } from "../api";

drilldown(Highcharts);

export default class ColumnDrilldown extends Component {
    allowChartUpdate = true;
    state = {
        seriesData: undefined,
        drilldownSeries: undefined,
    };

    async componentDidMount() {
        await this.updateData();
    }

    categoryClicked() {
        this.allowChartUpdate = false;
    }

    async updateData() {
        const { data } = this.props;
        if (data) {
            const drilldownSeries = [];
            const secondLevelDrilldownSeries = [];
            const seriesData = await Promise.all(Object.keys(data).map(async key => {
                const apiData = await api.downloads(key);
                const drilldownSeriesData = await Promise.all(Object.keys(apiData).map(async apiDataKey => {
                    //second level drilldown
                    const secondLevelApiData = await api.downloads(`${key}/${apiDataKey}`);
                    const secondLevelDrilldownSeriesData = Object.keys(secondLevelApiData).map(secondLevelApiKey => {
                        return [secondLevelApiKey, secondLevelApiData[secondLevelApiKey]];
                    });
                    secondLevelDrilldownSeries.push({
                        name: apiDataKey,
                        id: apiDataKey,
                        data: secondLevelDrilldownSeriesData

                    });
                    return {
                        name: apiDataKey,
                        y: apiData[apiDataKey],
                        drilldown: apiDataKey
                    }
                }));

                drilldownSeries.push({
                    name: `JDK${key}`,
                    id: key,
                    data: drilldownSeriesData,
                });

                return {
                    name: `JDK${key}`,
                    y: data[key],
                    drilldown: key
                }
            }));
            drilldownSeries.push(...secondLevelDrilldownSeries);
            this.setState({ seriesData, drilldownSeries });
        }

    }

    render() {
        const { seriesData, drilldownSeries } = this.state;
        if (!seriesData || !drilldownSeries) return null;

        const { name } = this.props;
        const options = {
            chart: {
                type: "column",
            },
            title: {
                text: name
            },
            subtitle: {
                text: 'Click the columns to view the version specific data. Data is from: <a href="https://api.adoptium.net/" target="_blank" rel="noopener noreferrer">api.adoptium.net</a>',
                useHTML: true,
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Downloads'
                }
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    },
                    pointPadding: 0.2,
                    borderWidth: 0,
                    minPointLength: 10,
                    shadow: true
                },
            },
            series: [
                {
                    events: {
                        click: e => {
                            this.categoryClicked(e);
                        }
                    },
                    name: "JDK Versions",
                    data: seriesData
                }
            ],
            drilldown: {
                series: drilldownSeries
            }
        };
        return <div className="chart">
            <HighchartsReact
                allowChartUpdate={this.allowChartUpdate}
                ref={"chartComponent"}
                highcharts={Highcharts}
                options={options}
            />
        </div>;
    }
}