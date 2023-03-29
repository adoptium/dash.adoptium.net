import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Icon } from 'antd';
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
		return <ConfigProvider locale={enUS}>
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
							<Menu.Item key="1"><Link to="/download"><Icon type="cloud-download" />Download</Link></Menu.Item>
							<Menu.Item key="2"><Link to="/trends"><Icon type="line-chart" />Trends</Link></Menu.Item>

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
				<Layout>
  				    <footer className="footer" style={{ background: '#14003c', margin: '20px 0'}}>
					    <a href="https://www.netlify.com" style={{ height: '100%', display: 'flex' }}><img src="https://www.netlify.com/v3/img/components/netlify-light.svg" alt="Deploys by Netlify"  /></a>
					</footer>
                </Layout>
			</Layout>
		</ConfigProvider>
	}
}