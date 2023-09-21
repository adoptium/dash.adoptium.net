import React from 'react';
import { act, render } from '@testing-library/react';
import { vi, describe, expect, test } from 'vitest'
import NavigationMenu from '../index';
import { useLocation } from 'react-router-dom';

vi.mock('react-router-dom');

describe('NavigationMenu component', () => {
    test('renders correctly /download path', async() => {
        vi.mocked(useLocation).mockReturnValue({path: '/download'});

        let container;
        await act(async () => {
            ({ container } = render(
              <NavigationMenu
              />
            ));
          });

          expect(container).toMatchSnapshot();
    });
    
    test('renders correctly /trends path', async () => {
        vi.mocked(useLocation).mockReturnValue({path: '/trends'});

        let container;
        await act(async () => {
            ({ container } = render(
            <NavigationMenu
            />
            ));
        });

      expect(container).toMatchSnapshot();
    });
});
