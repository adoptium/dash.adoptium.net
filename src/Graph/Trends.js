import React, { Component } from 'react';
import { api } from "../api";
import LineChart from "./LineChart.js";
import moment from 'moment';

export default class Trends extends Component {
    state = { series: undefined };
    async componentDidMount() {
        await this.updateData();
    }

    async updateData() {
        const data = await api.tracking({});
        const dockerhubData = await api.tracking({ source: "dockerhub" });
        const githubData = await api.tracking({ source: "github" });
        if (data && dockerhubData && githubData) {
            const categories = data.map(({ date }) => moment(date).format('DD-MM-YYYY'));

            let series = this.processData(data, "Overall Download", true);
            Array.prototype.push.apply(series, this.processData(dockerhubData, "Dockerhub"));
            Array.prototype.push.apply(series, this.processData(githubData, "Github"));

            this.setState({ series, categories });
        }

    }

    processData(data, name, visibleTatal = false) {
        const daily = data.map(({ daily }) => daily);
        const total = data.map(({ total }) => total);


        const series = [{
            name: name + " Daily",
            data: daily,
            visible: false,
        }, {
            name: name + " Total",
            data: total,
            visible: visibleTatal,
        }];
        return series;
    }

    render() {
        if (!this.state.series) return null;
        return <>
            <LineChart series={this.state.series} categories={this.state.categories} name="Tracking Trends" />
        </>
    }
}