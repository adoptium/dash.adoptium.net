import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest'
import Download from '../Download'
import { api } from '../../api'

// NOTE: Use a delay to avoid diff with rendering animation
// https://github.com/highcharts/highcharts/issues/14328

const delay = 2000;

const mock_data = {
    "date": "2023-09-26T15:29:39Z",
    "docker_pulls": {
        "eclipse-temurin": 72333402
    },
    "github_downloads": {
        "8": 39821217,
        "11": 48300842,
        "16": 5918452,
        "17": 45342098,
        "18": 9856871,
        "19": 7515221,
        "20": 3461189,
        "21": 594778
    },
    "total_downloads": {
        "docker_pulls": 72333402,
        "github_downloads": 160810668,
        "total": 233144070
    }
}
 
api.downloads = vi.fn().mockImplementation(() => {
    return mock_data;
});
 
describe('Download component', () => {
    test('renders correctly', async () => {
        let getByText;
        let queryAllByLabelText;

        await act(async () => {
            ({ getByText, queryAllByLabelText } = render(
                <Download />
            ));
            setTimeout(() => { }, delay)
        });

        expect(getByText('Adoptium Download Stats')).toBeInTheDocument();
        expect(getByText('233 144 070')).toBeInTheDocument();

        expect(queryAllByLabelText('Total Downloads').length).toBe(2);
        expect(getByText('72 333 402')).toBeInTheDocument();
        expect(getByText('160 810 668')).toBeInTheDocument();
        expect(getByText('233 144 070')).toBeInTheDocument();

        expect(queryAllByLabelText('Github Downloads').length).toBe(1);

        expect(getByText('39 821 217')).toBeInTheDocument();
        expect(getByText('48 300 842')).toBeInTheDocument();
        expect(getByText('45 342 098')).toBeInTheDocument();
        expect(getByText('594 778')).toBeInTheDocument();
    });
});
