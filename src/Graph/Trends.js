import React, { Component } from 'react';
import { api } from "../api";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import moment from 'moment';
import { Radio, Slider, Checkbox } from 'antd';
import './Trends.css';

export default class Trends extends Component {
    state = { 
        series: undefined,
        series2: undefined,
        monthlyData: undefined,
        categories: undefined,
        categories2: undefined,
        args: {
            visible: true,
            type: 'daily',
            source: undefined,
            feature_version: undefined,
            jvm_impl: undefined
        },
        args2: {
            visible: false,
            type: 'daily',
            source: undefined,
            feature_version: undefined,
            jvm_impl: undefined
        },
        days: 30,
        monthlyArgs: {
            type: 'monthly',
            source: undefined,
            feature_version: undefined,
            jvm_impl: undefined
        }
    };

    async componentDidMount() {
        await this.updateData(1, this.state.args);
        await this.updateData(2, this.state.args2);
        await this.updateMonthlyData(this.state.monthlyArgs);
    }

    async updateData(seriesID, args) {
        const data = await api.tracking(this.generateParams(args))

        switch(seriesID) {   
            case 1: this.setState({series: this.processData(seriesID, data, args.type, args.visible)}); break;
            case 2: this.setState({series2: this.processData(seriesID, data, args.type, args.visible)}); break;
        }

        if (data.length > 0) {
            const categories = data.map(({ date }) => moment(date).format('DD-MM-YYYY'));

            switch(seriesID) {   
                case 1: this.setState({categories: categories}); break;
                case 2: this.setState({categories2: categories}); break;
            }
        }
    }

    processData(seriesID, data, type, visible) {
        var typeData;
        switch(type) {
            case 'daily': typeData = data.map(({ daily }) => daily); break;
            case 'total': typeData = data.map(({ total }) => total); break;
        }

        const series = {
            name: "Series " + seriesID,
            data: typeData,
            visible: (data.length != 0) && visible
        };

        return series;
    }

    async updateMonthlyData(args) {
        const data = await api.monthly(this.generateParams(args))

        var monthlyData = {}
        data.forEach(data => monthlyData[this.parseMonth(data.month)] = data[args.type])

        this.setState({monthlyData})
    }

    generateParams(args) {
        let params = {}
        if(args.source) params.source = args.source
        if(args.feature_version) params.feature_version = args.feature_version
        if(args.jvm_impl) params.jvm_impl = args.jvm_impl
        params.days = this.state.days

        return params;
    }

    parseMonth(month) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var b = month.split("-")
        return monthNames[b[1] - 1] + " " + b[0]
    }

    renderFilters(args, updateFunc) {
        return <> 
            <div className="column">
                <div>Source</div>
                <Radio.Group name={"source"}
                    defaultValue={args.source}
                    onChange={e => {args.source = e.target.value; updateFunc()}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'Github', value: 'github' },
                        { label: 'Docker', value: 'dockerhub' }
                    ]}
                />
            </div>
            <div className="column">
                <div>Feature Version*</div>
                <Radio.Group name={"feature_version"}
                    defaultValue={args.feature_version}
                    onChange={e => {args.feature_version = e.target.value; updateFunc()}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'JDK 8', value: 8 },
                        { label: 'JDK 9', value: 9 },
                        { label: 'JDK 10', value: 10 },
                        { label: 'JDK 11', value: 11 },
                        { label: 'JDK 12', value: 12 },
                        { label: 'JDK 13', value: 13 },
                        { label: 'JDK 14', value: 14 },
                    ]}
                />
            </div>
            <div className="column">
                <div>JVM Impl*</div>
                <Radio.Group name={"jvm_impl"}
                    defaultValue={args.jvm_impl}
                    onChange={e => {args.jvm_impl = e.target.value; updateFunc()}}
                    options={[
                        { label: 'None', value: undefined },
                        { label: 'HotSpot', value: 'hotspot' },
                        { label: 'OpenJ9', value: 'openj9' }
                    ]}
                />
            </div>
        </>
    }

    renderTrackingFilters(args, updateFunc) {
        return <div className="filters">
            <div className="column">
                <div>Visible</div>
                <Checkbox defaultChecked={args.visible}
                    onChange={e => {args.visible = e.target.checked; updateFunc()}}
                />
            </div>
            <div className="column">
                <div>Type</div>
                <Radio.Group name={"type"}
                    defaultValue={args.type}
                    onChange={e => {args.type = e.target.value; updateFunc()}}
                    options={[
                        { label: 'Daily', value: 'daily' },
                        { label: 'Total', value: 'total' }
                    ]}
                />
            </div>
            {this.renderFilters(args, updateFunc)}
        </div>
    }

    renderMonthlyFilters(args, updateFunc) {
        return <div className="filters">
             <div className="column">
                <div>Type</div>
                <Radio.Group name={"type"}
                    defaultValue={args.type}
                    onChange={e => {args.type = e.target.value; updateFunc()}}
                    options={[
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Total', value: 'total' }
                    ]}
                />
            </div>
            {this.renderFilters(args, updateFunc)}
        </div>
    }

    createSeries(series, series2) {
        series.data.splice(0, series.data.lastIndexOf(null)+1)
        series2.data.splice(0, series2.data.lastIndexOf(null)+1)

        let diff = series.data.length - series2.data.length;
        let fullSeries = []

        if(diff>0) {
            fullSeries = [series, this.padArray(series2, diff)]

        } else if (diff<0) {
            fullSeries = [this.padArray(series, -diff), series2]

        } else {
            fullSeries = [series, series2]
        }

        return fullSeries
    }

    padArray(state, diff) {
        for (var i=0; i< diff; i++) {
            state.data.unshift(null)
        }

        return state
    }

    max(arr1, arr2) {
        if (arr1.length > arr2.length) {
            return arr1
        } else {
            return arr2
        }
    }

    render() {
        let state = this.state;
    
        if (!state.series || !state.series2 || !state.monthlyData) return null;

        return <>
            <LineChart series={this.createSeries(state.series, state.series2)} categories={this.max(state.categories, state.categories2)} name="Tracking Trends" />
            <div className="filters-box">
                {this.renderTrackingFilters(state.args, () => {this.updateData(1, state.args)} )}
                {this.renderTrackingFilters(state.args2, () => {this.updateData(2, state.args2)})}
                <div className="column days">
                    <div>Days</div>
                    <Slider 
                        defaultValue={state.days} 
                        max={180}
                        onAfterChange={value => {state.days = value; this.updateData(1, this.state.args); this.updateData(2, this.state.args2)}}
                    />
                </div>
            </div>
            <BarChart data={state.monthlyData} name="Monthly Trends" />
            <div className="filters-box">
                {this.renderMonthlyFilters(state.monthlyArgs, () => {this.updateMonthlyData(state.monthlyArgs)})}
            </div>
            <p>*Does not include results from the Official Docker Repo</p>
        </>
    }
}