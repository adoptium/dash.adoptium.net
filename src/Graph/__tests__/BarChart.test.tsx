import React from 'react';
import { act, render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import BarChart from '../BarChart'
import Highcharts from 'highcharts'

// NOTE: Use a delay to avoid diff with rendering animation
// https://github.com/highcharts/highcharts/issues/14328

const delay = 2000;

const mock_data = {
  "jdk8u302-b08": 3238608,
  "jdk8u302-b08.1": 513472,
  "jdk8u312-b07": 5815865,
  "jdk8u322-b06": 4010319,
  "jdk8u332-b09": 6751030,
  "jdk8u342-b07": 629406,
  "jdk8u342-b07.1": 61770,
  "jdk8u345-b01": 3035189,
  "jdk8u352-b08": 2791698,
  "jdk8u362-b09": 3866298,
  "jdk8u372-b07": 3210329,
  "jdk8u382-b05": 1929984
}

beforeAll(async () => {
  Highcharts.useSerialIds(true);
})

afterAll(async () => {
  Highcharts.useSerialIds(false);
})

describe('BarChart component', () => {
  test('renders correctly', async () => {
    let container;

    await act(async () => {
      ({ container } = render(
        <BarChart
          data={mock_data}
          name={'Downloads'}
        />
      ));
      setTimeout(() => { }, delay)
    });

    expect(container).toMatchSnapshot();
  });
});
