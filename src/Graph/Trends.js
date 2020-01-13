import React, { Component } from 'react';
import { api } from "../api";
import LineChart from "./LineChart.js";

export default class Trends extends Component {
    state = { series: undefined };
    async componentDidMount() {
        await this.updateData();
    }

    async updateData() {
        const data = await api.tracking({});
        if (data) {
            const daily = data.map(({ daily }) => daily);
            const total = data.map(({ total }) => total);
            const categories = data.map(({ date }) => date);

            const series = [{
                name: "daily",
                data: daily,
                visible: false,
            }, {
                name: "total",
                data: total
            }];
            this.setState({ series, categories });
        }

    }

    render() {
        if (!this.state.series) return null;
        return <>
            <LineChart series={this.state.series} categories={this.state.categories} name="Tracking Trends" />
        </>
    }
}