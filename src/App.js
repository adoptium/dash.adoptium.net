import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Icon } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import ErrorBoundary from './ErrorBoundary';
import { Download, Trends } from './Graph/';

import 'antd/dist/antd.css';
import AdoptLogo from './Adoptlogo.svg';

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
		return <ConfigProvider locale={enUS}>
			<Layout>
				<Header className="header" style={{ background: '#152935' }}>
					<div className="logo" />
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={['2']}
						style={{ lineHeight: '64px', background: '#152935' }}
					>
						<Menu.Item key="1"><a href="https://adoptopenjdk.net/" style={{ height: '100%', display: 'flex' }}><img src={AdoptLogo} /></a></Menu.Item>
						<Menu.Item key="2"><Link to="/download">Download Stats</Link></Menu.Item>
					</Menu>

				</Header>
				<Layout>
					<Sider width={200} style={{ background: '#fff' }} trigger={null} collapsible collapsed={this.state.collapsed}>
						<Menu
							mode="inline"
							defaultSelectedKeys={['1']}
							defaultOpenKeys={['sub1']}
							style={{ height: '100%', borderRight: 0 }}
						>
							<SubMenu key="sub1" title={<span><Icon type="user" />Menu</span>}>
								<Menu.Item key="1"><Link to="/download">Download</Link></Menu.Item>
								<Menu.Item key="2"><Link to="/trends">Trends</Link></Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Layout style={{ padding: '0 24px 24px' }}>
						<ErrorBoundary>
							<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
								<Icon
									className="trigger"
									type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
									onClick={this.toggle}
								/>
								<Route exact path="/" component={Download} />
								<Route path="/download" component={Download} />
								<Route path="/trends" component={Trends} />
							</Content>
						</ErrorBoundary>
					</Layout>
				</Layout>
			</Layout>
		</ConfigProvider>
	}
}