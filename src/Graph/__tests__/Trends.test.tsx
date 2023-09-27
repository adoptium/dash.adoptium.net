import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest'
import Trends from '../Trends'
import { api } from '../../api'

// NOTE: Use a delay to avoid diff with rendering animation
// https://github.com/highcharts/highcharts/issues/14328

const delay = 2000;

const mock_tracking_data = 
    [
        {
            "daily": 391783,
            "date": "2023-09-23T22:31:18Z",
            "total": 232137708
        },
        {
            "daily": 357992,
            "date": "2023-09-24T23:29:09Z",
            "total": 232509871
        },
        {
            "daily": 622526,
            "date": "2023-09-25T23:56:17Z",
            "total": 233144070
        },
        {
            "daily": 604188,
            "date": "2023-09-27T00:50:24Z",
            "total": 233770916
        }
    ];

const mock_monthly_data = [
    {
        "month": "2023-03",
        "monthly": 12979542,
        "total": 141309172
    },
    {
        "month": "2023-04",
        "monthly": 13901768,
        "total": 155210940
    },
    {
        "month": "2023-05",
        "monthly": 14989924,
        "total": 170200864
    },
    {
        "month": "2023-06",
        "monthly": 13907241,
        "total": 184108105
    },
    {
        "month": "2023-07",
        "monthly": 18093361,
        "total": 202201466
    },
    {
        "month": "2023-08",
        "monthly": 16954788,
        "total": 219156254
    }
]

api.tracking = vi.fn().mockImplementation(() => {
    return mock_tracking_data;
});
api.monthly = vi.fn().mockImplementation(() => {
    return mock_monthly_data;
});

describe('Trends component', () => {
    test('renders correctly', async () => {
        let queryAllByText;

        await act(async () => {
            ({ queryAllByText } = render(
                <Trends />
            ));
            setTimeout(() => { }, delay)
        });

        expect(queryAllByText('Tracking Trends', {selector: 'text'}).length).toBe(1);
        expect(queryAllByText('Monthly Trends', {selector: 'text'}).length).toBe(2);
    });
});
