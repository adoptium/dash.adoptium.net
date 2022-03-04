import React, { Component } from 'react';
import { Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { CloudDownloadOutlined, LineChartOutlined, MenuFold, MenuUnfold } from '@ant-design/icons';
// TODO replace legacy icon in the future
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { ConfigProvider, Layout, Menu } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import ErrorBoundary from './ErrorBoundary';
import { Download, Trends } from './Graph/';

import 'antd/dist/antd.css';
import AdoptiumLogo from './Adoptiumlogo.svg';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class extends Component {
	state = {
		collapsed: false,
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {
		return (
            <ConfigProvider locale={enUS}>
                <Layout>
                    <Header className="header" style={{ background: '#14003c' }}>
                        <div className="logo" />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px', background: '#14003c' }}
                        >
                            <Menu.Item key="1"><a href="https://adoptium.net/" style={{ height: '100%', display: 'flex' }}><img src={AdoptiumLogo} style={{height: '3.5em', paddingTop: '1em'}} /></a></Menu.Item>
                            <Menu.Item key="2"><Link to="/download">Download Stats</Link></Menu.Item>
                        </Menu>

                    </Header>
                    <Layout>
                        <Sider width={200} style={{ background: '#fff' }} trigger={null} collapsible collapsed={this.state.collapsed}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0, marginTop: 20 }}
                            >
                                <Menu.Item key="1"><Link to="/download"><CloudDownloadOutlined />Download</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/trends"><LineChartOutlined />Trends</Link></Menu.Item>

                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            <ErrorBoundary>
                                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                                    <LegacyIcon
                                        className="trigger"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                        onClick={this.toggle}
                                    />
                                    <Routes>
                                        <Route path="/" element={<Download/>} />
                                        <Route path="/download" element={<Download/>} />
                                        <Route path="/trends" element={<Trends/>} />
                                    </Routes>
                                </Content>
                            </ErrorBoundary>
                        </Layout>
                    </Layout>
                </Layout>
            </ConfigProvider>
        );
	}
}