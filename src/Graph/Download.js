import React, { Component } from 'react';
import { api } from "../api";
import BarChart from "./BarChart.js";
import PieChart from "./PieChart.js";
import ColumnDrilldown from "./ColumnDrilldown.js";

export default class DownloadTotal extends Component {
    state = { data: undefined };
    async componentDidMount() {
        await this.updateData();
    }

    async updateData() {
        const data = await api.downloads();

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
        console.log(jdk8Data);
        console.log(pieChartData);
        this.setState({ data, pieChartData });

    }

    render() {
        if (!this.state.data) return null;
        return <>
            <BarChart data={this.state.data.docker_pulls} name="Docker Pulls" />
            <div style={{display:"flex"}}>
            <BarChart data={this.state.data.total_downloads} name="Total Downloads" startCaseKeys/>
            <PieChart data={this.state.pieChartData} name="jdk8u222-b10 Downloads" />
            </div>
            <ColumnDrilldown data={this.state.data.github_downloads} name="Github Downloads"/>
        </>
    }
}