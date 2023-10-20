import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest'
import ColumnDrilldown from '../ColumnDrilldown'
import { api } from '../../api';

// NOTE: Use a delay to avoid diff with rendering animation
// https://github.com/highcharts/highcharts/issues/14328

const delay = 2000;

const mock_data = {
  "available_lts_releases": [
      8
  ],
  "available_releases": [
      8
  ],
  "most_recent_feature_release": 21,
  "most_recent_feature_version": 22,
  "most_recent_lts": 21,
  "tip_version": 22
}

const mock_data_api_8 = {
  "jdk8u302-b08": 3238608,
}

const mock_data_api_b08 = {
  "OpenJDK8U-debugimage_x64_linux_hotspot_8u302b08.tar.gz": 55,
  "OpenJDK8U-jdk_x64_linux_hotspot_8u302b08.tar.gz": 1890802,
  "OpenJDK8U-debugimage_x64_mac_hotspot_8u302b08.tar.gz": 20,
  "OpenJDK8U-jdk_x64_mac_hotspot_8u302b08.tar.gz": 133130,
  "OpenJDK8U-jdk_x64_mac_hotspot_8u302b08.pkg": 91371,
  "OpenJDK8U-debugimage_x64_windows_hotspot_8u302b08.zip": 126,
  "OpenJDK8U-jdk_x64_windows_hotspot_8u302b08.zip": 493036,
  "OpenJDK8U-jdk_x64_windows_hotspot_8u302b08.msi": 405081,
  "OpenJDK8U-debugimage_aarch64_linux_hotspot_8u302b08.tar.gz": 76,
  "OpenJDK8U-debugimage_ppc64le_linux_hotspot_8u302b08.tar.gz": 9,
  "OpenJDK8U-jdk_aarch64_linux_hotspot_8u302b08.tar.gz": 12284,
  "OpenJDK8U-jdk_ppc64le_linux_hotspot_8u302b08.tar.gz": 2951,
  "OpenJDK8U-debugimage_ppc64_aix_hotspot_8u302b08.tar.gz": 8,
  "OpenJDK8U-jdk_ppc64_aix_hotspot_8u302b08.tar.gz": 2594,
  "OpenJDK8U-jre_x64_linux_hotspot_8u302b08.tar.gz": 32727,
  "OpenJDK8U-jre_x64_windows_hotspot_8u302b08.zip": 306312,
  "OpenJDK8U-jre_x64_windows_hotspot_8u302b08.msi": 248381,
}

describe('ColumnDrilldown component', () => {
  test('renders correctly', async () => {
    api.availableReleases = vi.fn().mockImplementation(() => {
      return mock_data
    });

    api.downloads = vi.fn().mockImplementation((arg) => {
      if(arg === 8) return mock_data_api_8;
      else if (arg === '8/jdk8u302-b08') return mock_data_api_b08;
      return undefined
    });

    let getByText;

    await act(async () => {
      ({ getByText } = render(
        <ColumnDrilldown name='Github Release Downloads' />
      ));
      setTimeout(() => { }, delay)
    });

    expect(api.downloads).toBeCalledTimes(2);
    expect(getByText('JDK8')).toBeDefined()
  });
});
