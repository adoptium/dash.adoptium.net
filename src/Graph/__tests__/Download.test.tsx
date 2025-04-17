import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Download from '../Download';
import { api } from '../../api';

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
        let queryAllByText;
        let getAllByText;
        let container;

        await act(async () => {
            ({ getByText, queryAllByText, getAllByText, container } = render(
                <Download />
            ));
            setTimeout(() => { }, delay)
        });

        expect(getByText('Adoptium Download Stats')).toBeInTheDocument();
        // Look for the formatted number in the h2 element
        expect(getByText('233,144,070')).toBeInTheDocument();

        expect(queryAllByText('Total Downloads', {selector: 'text'}).length).toBe(3);
        // Use getAllByText for all numerical values that appear multiple times in the SVG
        expect(getAllByText('72 333 402', { selector: 'text' })[0]).toBeInTheDocument();
        expect(getAllByText('160 810 668', { selector: 'text' })[0]).toBeInTheDocument();
        expect(getAllByText('233 144 070', { selector: 'text' })[0]).toBeInTheDocument();

        expect(queryAllByText('Github Downloads', {selector: 'text'}).length).toBe(2);
        expect(queryAllByText('Github Release Downloads', {selector: 'text'}).length).toBe(1);
        expect(queryAllByText('JDK Versions', {selector: 'text'}).length).toBe(1);
    });
});
