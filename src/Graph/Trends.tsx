import React, { Component } from 'react';
import { api } from '../api';
import LineChart from './LineChart';
import BarChart from './BarChart';
import moment from 'moment';
import { Radio, Slider, Checkbox, Spin } from 'antd';
import './Trends.css';

type ArgsType = {
  visible: boolean;
  type: 'daily' | 'total';
  source?: string;
  feature_version?: number;
  jvm_impl?: string;
};

type MonthlyArgsType = {
  type: 'monthly' | 'total';
  source?: string;
  feature_version?: number;
  jvm_impl?: string;
};

type State = {
  series?: SeriesType;
  series2?: SeriesType;
  monthlyData?: Record<string, any>;
  categories?: string[];
  categories2?: string[];
  args: ArgsType;
  args2: ArgsType;
  days: number;
  monthlyArgs: MonthlyArgsType;
  versions?: number[];
};

type SeriesType = {
  type?: any;
  name: string;
  data: (number | null)[];
  visible: boolean;
};

type TypeFilterProps = {
  defaultValue: string;
  onChange: (e: any) => void;
  options: { label: string; value: string }[];
};

interface ApiParams {
  [x: string]: any;
  source: any;
  feature_version: any;
  jvm_impl: any;
  days: number;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ defaultValue, onChange, options }) => (
  <div className='column'>
    <div>Type</div>
    <Radio.Group
      name='type'
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
    />
  </div>
);

export default class Trends extends Component<{}, State> {
  state: State = {
    series: undefined,
    series2: undefined,
    monthlyData: undefined,
    categories: undefined,
    categories2: undefined,
    args: {
      visible: true,
      type: 'daily',
    },
    args2: {
      visible: false,
      type: 'daily',
    },
    days: 30,
    monthlyArgs: {
      type: 'monthly',
    },
    versions: undefined,
  };

  async componentDidMount() {
    await this.updateData(1, this.state.args);
    await this.updateData(2, this.state.args2);
    await this.updateMonthlyData(this.state.monthlyArgs);
    this.setState({
      versions: (await api.availableReleases()).available_releases,
    });
  }

  async updateData(seriesID: number, args: ArgsType) {
    const data = await api.tracking(this.generateParams(args));

    switch (seriesID) {
      case 1:
        this.setState({ series: this.processData(seriesID, data, args.type, args.visible) });
        break;
      case 2:
        this.setState({ series2: this.processData(seriesID, data, args.type, args.visible) });
        break;
    }

    if (data.length > 0) {
      const categories = data.map(({ date }) => moment(date).format('DD-MM-YYYY'));

      switch (seriesID) {
        case 1:
          this.setState({ categories });
          break;
        case 2:
          this.setState({ categories2: categories });
          break;
      }
    }
  }

  processData(seriesID: number, data: any[], type: 'daily' | 'total', visible: boolean): SeriesType {
    let typeData: number[] = [];
    switch (type) {
      case 'daily':
        typeData = data.map(({ daily }) => daily);
        break;
      case 'total':
        typeData = data.map(({ total }) => total);
        break;
    }

    return {
      name: 'Series ' + seriesID,
      data: typeData,
      visible: data.length !== 0 && visible,
    };
  }

  async updateMonthlyData(args: MonthlyArgsType) {
    const data = await api.monthly(this.generateParams(args));

    const monthlyData: Record<string, number> = {};
    data.forEach(data => {
      monthlyData[this.parseMonth(data.month)] = data[args.type];
    });

    this.setState({ monthlyData });
  }

  generateParams(args: ArgsType | MonthlyArgsType): ApiParams {
    const params: ApiParams = {
      source: args.source || undefined,
      feature_version: args.feature_version || undefined,
      jvm_impl: args.jvm_impl || undefined,
      days: this.state.days
    };

    if (args.source) params.source = args.source;
    if (args.feature_version) params.feature_version = args.feature_version;
    if (args.jvm_impl) params.jvm_impl = args.jvm_impl;
    params.days = this.state.days;

    return params;
  }

  parseMonth(month: string): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const b = month.split('-');
    return monthNames[Number(b[1]) - 1] + ' ' + b[0];
  }

  renderFilters (args, updateFunc) {
    return (
      <>
        <div className='column'>
          <div>Source</div>
          <Radio.Group
            name='source'
            defaultValue={args.source}
            onChange={e => { args.source = e.target.value; updateFunc() }}
            options={[
              { label: 'All', value: undefined as any },
              { label: 'Github', value: 'github' },
              { label: 'Docker', value: 'dockerhub' }
            ]}
          />
        </div>
        <div className='column'>
          <div>Feature Version*</div>
          <Radio.Group
            name='feature_version'
            defaultValue={args.feature_version}
            onChange={e => { args.feature_version = e.target.value; updateFunc() }}
            options={this.generateVersions()}
          />
        </div>
      </>
    )
  }

  renderTrackingFilters (args, updateFunc) {
    return (
      <div className='filters'>
        <div className='column'>
          <div>Visible</div>
          <Checkbox
            defaultChecked={args.visible}
            onChange={e => { args.visible = e.target.checked; updateFunc() }}
          />
        </div>
        <TypeFilter
          defaultValue={args.type}
          onChange={e => { args.type = e.target.value; updateFunc() }}
          options={[
            { label: 'Daily', value: 'daily' },
            { label: 'Total', value: 'total' }
          ]}
        />
        {this.renderFilters(args, updateFunc)}
      </div>
    )
  }

  renderMonthlyFilters (args, updateFunc) {
    return (
      <div className='filters'>
        <TypeFilter
          defaultValue={args.type}
          onChange={e => { args.type = e.target.value; updateFunc() }}
          options={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Total', value: 'total' }
          ]}
        />
        {this.renderFilters(args, updateFunc)}
      </div>
    )
  }

  generateVersions () {
    const versionOpts = [{ label: 'All', value: undefined as any }]
    const versions = this.state.versions

    if (versions) {
      for (const version of versions) {
        versionOpts.push({ label: 'JDK ' + version, value: version })
      }
    }

    return versionOpts
  }

  createSeries(series: SeriesType, series2: SeriesType): SeriesType[] {
    series.data.splice(0, series.data.lastIndexOf(null) + 1)
    series2.data.splice(0, series2.data.lastIndexOf(null) + 1)

    const diff = series.data.length - series2.data.length
    let fullSeries: SeriesType[] = [];

    if (diff > 0) {
      fullSeries = [series, this.padArray(series2, diff)]
    } else if (diff < 0) {
      fullSeries = [this.padArray(series, -diff), series2]
    } else {
      fullSeries = [series, series2]
    }

    return fullSeries
  }

  padArray(state: SeriesType, diff: number): SeriesType {
    for (let i = 0; i < diff; i++) {
      state.data.unshift(null)
    }

    return state
  }

  max (arr1, arr2) {
    if (arr1.length > arr2.length) {
      return arr1
    } else {
      return arr2
    }
  }

  render() {
    const state = this.state;

    if (!state.series || !state.series2 || !state.monthlyData) {
      return (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      );
    }

    return (
      <>
        <LineChart
          series={this.createSeries(state.series, state.series2)}
          categories={this.max(state.categories, state.categories2)}
          name="Tracking Trends"
        />
        <div className="filters-box">
          {this.renderTrackingFilters(state.args, () => {
            this.updateData(1, state.args);
          })}
          {this.renderTrackingFilters(state.args2, () => {
            this.updateData(2, state.args2);
          })}
          <div className="column days">
            <div>Days</div>
            <Slider
              defaultValue={state.days}
              max={180}
              onAfterChange={(value) => {
                state.days = value;
                this.updateData(1, this.state.args);
                this.updateData(2, this.state.args2);
              }}
            />
          </div>
        </div>
        <BarChart data={state.monthlyData} name="Monthly Trends" />
        <div className="filters-box">
          {this.renderMonthlyFilters(state.monthlyArgs, () => {
            this.updateMonthlyData(state.monthlyArgs);
          })}
        </div>
        <p>*Does not include results from the Official Docker Repo</p>
      </>
    );
  }
}
