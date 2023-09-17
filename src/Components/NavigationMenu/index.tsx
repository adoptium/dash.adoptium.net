import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

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
            <Menu.Item key="1"><Link to="/download"><Icon type="cloud-download" />Download</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/trends"><Icon type="line-chart" />Trends</Link></Menu.Item>
        </Menu>
    )
}

export default NavigationMenu;
