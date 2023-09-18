import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { CloudDownloadOutlined, LineChartOutlined } from '@ant-design/icons';

const NavigationMenu = (): JSX.Element => {
    const location = useLocation();

    const getSelectedKeysByUrl = () => {
        if(location.pathname === '/') return ['1'];
        if(location.pathname === '/download') return ['1'];
        else if(location.pathname === '/trends') return ['2'];
    }

    return (
        <Menu
            mode="inline"
            selectedKeys={getSelectedKeysByUrl()}
            style={{ height: '100%', borderRight: 0, marginTop: 20 }}
        >
            <Menu.Item key="1"><Link to="/download"><CloudDownloadOutlined /> Download</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/trends"><LineChartOutlined /> Trends</Link></Menu.Item>
         </Menu>
    )
}

export default NavigationMenu;
