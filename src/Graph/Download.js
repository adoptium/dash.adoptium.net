import React, { Component } from 'react';
import { Divider, Icon } from 'antd';
import { api } from "../api";
import { formatNum } from "../utils";
import BarChart from "./BarChart.js";
import PieChart from "./PieChart.js";
import ColumnDrilldown from "./ColumnDrilldown.js";
import startCase from 'lodash/startCase';
import { CloudDownloadOutlined, LineChartOutlined } from '@ant-design/icons';

export default class DownloadTotal extends Component {
    state = { data: undefined };
    async componentDidMount() {
        await this.updateData();
    }

    async updateData() {
        const data = await api.downloads();
        let totalPieChartData = [];
        if (data && data.total_downloads) {
            totalPieChartData = Object.keys(data.total_downloads).map(key => {
                if (key != "total") {
                    return {
                        name: startCase(key),
                        y: data.total_downloads[key],
                    }
                }

            });
        }
        const jdk8Data = await api.downloads("8/jdk8u222-b10");
        let pieChartData = [];
        if (jdk8Data) {
            pieChartData = Object.keys(jdk8Data).map(key => {
                return {
                    name: key,
                    y: jdk8Data[key],
                }
            });
        }
        this.setState({ data, totalPieChartData, pieChartData });

    }

    render() {
        const { data, totalPieChartData, pieChartData } = this.state;
        if (!data) return null;
        const total = formatNum(data.total_downloads.total);

        return <>
            <div style={{ textAlign: "center" }}>
                <div ><p style={{ fontSize: 20, color: "rgb(107,164,231)" }}>Adoptium Download Stats</p></div>
                <div ><CloudDownloadOutlined style={{ fontSize: 20, color: "rgb(48,135,255)" }}/><h2 >{total}</h2><p >Total Downloads/Docker pulls Ever</p></div>
            </div>
            <Divider />
            <div style={{ display: "flex" }}>
                <BarChart data={data.total_downloads} name="Total Downloads" startCaseKeys />
                <PieChart data={totalPieChartData} name="Total Downloads" showInLegend={true} dataLabels={true} colors={['rgb(108,109,227)', 'rgb(254,174,98)']} />
                {/* <PieChart data={pieChartData} name="jdk8u222-b10 Downloads" /> */}
            </div>
            <ColumnDrilldown data={data.github_downloads} name="Github Downloads" />
            <BarChart data={data.docker_pulls} name="Docker Pulls" />
        </>
    }
}