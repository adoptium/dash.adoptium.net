import React, { Component } from 'react'
import { Route } from 'react-router'
import { ConfigProvider, Layout, Menu, Button } from 'antd'
import Highcharts from 'highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import enUs from 'antd/lib/locale/en_US'
import { Download, Trends } from './Graph'
import AdoptiumLogo from './Adoptiumlogo.svg'
import NavigationMenu from './Components/NavigationMenu'
import ErrorBoundary from './ErrorBoundary'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

AccessibilityModule(Highcharts)

const { Header, Content, Sider } = Layout

const menuItems = [
  {
    key: '1',
    icon: <a href='https://adoptium.net/' style={{ height: '100%', display: 'flex' }}><img alt='Adoptium Logo' src={AdoptiumLogo} style={{ height: '3.5em', paddingTop: '.5em' }} /></a>
  }
]

export default class App extends Component {
  state = {
    collapsed: false
  }

  handleToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render () {
    return (
      <ConfigProvider locale={enUs}>
        <Layout>
          <Header className='header' style={{ background: '#14003c' }}>
            <div className='logo' />
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '15px', background: '#14003c' }}
              items={menuItems}
            />
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }} trigger={null} collapsible collapsed={this.state.collapsed}>
              <NavigationMenu />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <ErrorBoundary>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <Button onClick={this.handleToggle} type='link' shape='circle' icon={this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
                  <Route exact path='/' component={Download} />
                  <Route path='/download' component={Download} />
                  <Route path='/trends' component={Trends} />
                </Content>
              </ErrorBoundary>
            </Layout>
          </Layout>
          <Layout>
            <footer className='py-3 mt-auto' style={{ background: '#14003c', margin: '20px 0' }}>
              <a href='https://www.netlify.com' style={{ height: '100%', display: 'flex' }}><img src='https://www.netlify.com/v3/img/components/netlify-light.svg' alt='Deploys by Netlify' /></a>
            </footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    )
  }
}
