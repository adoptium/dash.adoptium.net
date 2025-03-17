import React from 'react';
import { useLocation, Link } from 'react-router';
import { Menu } from 'antd';
import { CloudDownloadOutlined, LineChartOutlined } from '@ant-design/icons';

const NavigationMenu = (): JSX.Element => {
    const location = useLocation();

    const getSelectedKeysByUrl = () => {
        if(location.pathname === '/') return ['1'];
        if(location.pathname === '/download') return ['1'];
        else if(location.pathname === '/trends') return ['2'];
    }

    const menuItems = [
        {
          key: '1',
          icon: <CloudDownloadOutlined />,
          label: <Link to="/download"> Download</Link>
        },
        {
          key: '2',
          icon: <LineChartOutlined />,
          label: <Link to="/trends"> Trends</Link>
        }
    ];

    return (
        <Menu
            mode="inline"
            selectedKeys={getSelectedKeysByUrl()}
            style={{ height: '100%', borderRight: 0, marginTop: 20 }}
            items={menuItems}
        />
    )
}

export default NavigationMenu;
