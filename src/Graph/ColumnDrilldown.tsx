import React, { Component, createRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown';
import './Graph.css';
import { api } from '../api';
import {splitDrilldownSeriesByArtifacts} from '../utils'

drilldown(Highcharts);

interface ColumnDrilldownProps {
  name: string;
}

interface ColumnDrilldownState {
  seriesData?: { name: string; y: number; drilldown: string }[];
  drilldownSeries?: {
    name: string;
    id: string;
    data: { name: string; y: number; drilldown?: string }[];
  }[];
}

interface DrilldownData {
  name: string;
  y: any;
  drilldown: string;
}

interface DrilldownSeries {
  name: string;
  id: string;
  data: DrilldownData[];
}

interface DrilldownItem {
  name: string;
  id: string;
  data: DrilldownData[];
}

export default class ColumnDrilldown extends Component<ColumnDrilldownProps, ColumnDrilldownState> {
  allowChartUpdate: boolean = true;
  state: ColumnDrilldownState = {
    seriesData: [],
    drilldownSeries: [],
  };

  chartComponentRef = createRef<HighchartsReact.RefObject>();

  async componentDidMount() {
    await this.updateData();
  }

  categoryClicked(e: Highcharts.PointClickEventObject): void {
    this.allowChartUpdate = false;
  }

  async updateData() {
    const availableReleases = await api.availableReleases();

    if (availableReleases.available_releases) {
      const drilldownSeries: DrilldownItem[] = [];
      const archLevelDrilldownSeries: DrilldownSeries[] = [];

      // this step loops over all versions (e.g. "8":41425474,"11":50446738...)
      const seriesDataPromises: Promise<DrilldownData | null>[] = availableReleases.available_releases.map(async key => {
        // then call download data of key (e.g. https://api.adoptium.net/v3/stats/downloads/total/21)
        const apiData = await api.downloads(key);
        if (!apiData) return null;

        // loop over all elements
        const drilldownDataPromises: Promise<DrilldownData>[] = Object.keys(apiData).map(async apiDataKey => {
          // get data (e.g. https://api.adoptium.net/v3/stats/downloads/total/21/jdk-21+35)
          const secondLevelApiData = await api.downloads(`${key}/${apiDataKey}`);

          // this returns data of each element (e.g. OpenJDK20U-jdk_x64_windows_hotspot_20.0.2_9.zip)
          const secondLevelDrilldownSeriesData: DrilldownData[] = Object.keys(secondLevelApiData).map(secondLevelApiKey => {
            return {
              name: secondLevelApiKey,
              y: secondLevelApiData[secondLevelApiKey],
              drilldown: secondLevelApiKey,
            };
          });

          // this step will allocate element by level
          const r = splitDrilldownSeriesByArtifacts(secondLevelDrilldownSeriesData);
          archLevelDrilldownSeries.push({
            name: apiDataKey,
            id: apiDataKey,
            data: Object.keys(r.artifacts).sort((a, b) => a.localeCompare(b)).map(val => {
              return {
                name: val,
                // count number of value per level
                y: r.artifacts[val].data.reduce((a, b) => a + b.y || 0, 0),
                drilldown: `${apiDataKey}-${val}`
              }
            })
          });

          Object.keys(r.artifacts).forEach(val => {
            archLevelDrilldownSeries.push({
              name: `${apiDataKey}-${val}`,
              id: `${apiDataKey}-${val}`,
              // count number of value per level
              data: r.artifacts[val].data.sort((a, b) => a.name.localeCompare(b.name))
            });
          });

          return {
            name: apiDataKey,
            y: secondLevelDrilldownSeriesData.reduce((a, b) => a + b.y || 0, 0),
            drilldown: apiDataKey,
          };
        });

        // this get all primary level keys: JDK21, JDK20...
        const drilldownSeriesData = await Promise.all(drilldownDataPromises);

        drilldownSeries.push({
          name: `JDK${key}`,
          id: key,
          data: drilldownSeriesData,
        });
      
        return {
          name: `JDK${key}`,
          y: drilldownSeriesData.reduce((a, b) => a + b.y || 0, 0),
          drilldown: key,
        };
      });
      
      const seriesData = (await Promise.all(seriesDataPromises)).filter(Boolean) as DrilldownData[];

      drilldownSeries.push(...archLevelDrilldownSeries)
      this.setState({
        seriesData,
        drilldownSeries: [...drilldownSeries, ...archLevelDrilldownSeries],
      });
    }
  }

  render() {
    const { seriesData, drilldownSeries } = this.state;
    if (!seriesData || !drilldownSeries) return null;

    const { name } = this.props;
    const options = {
      colors: [
        "#2caffe"
      ],
      chart: {
        type: 'column'
      },
      title: {
        text: name
      },
      subtitle: {
        text: 'Click the columns to view the version specific data. Data is from: <a href="https://api.adoptium.net/" target="_blank" rel="noopener noreferrer">api.adoptium.net</a>',
        useHTML: true
      },
      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-10, -20, -30, -45]
        }
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
            formatter: function () {
              if (!this || !this.y) return ''
              return Highcharts.numberFormat(this.y, 0, '.', ' ')
            }
          },
          pointPadding: 0.2,
          borderWidth: 0,
          minPointLength: 10,
          shadow: true
        }
      },
      series: [
        {
          events: {
            click: e => {
              this.categoryClicked(e)
            }
          },
          name: 'JDK Versions',
          data: seriesData
        }
      ],
      drilldown: {
        series: drilldownSeries
      }
    }
    return (
      <div className='chart'>
        <HighchartsReact
          allowChartUpdate={this.allowChartUpdate}
          ref={this.chartComponentRef}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }
}
