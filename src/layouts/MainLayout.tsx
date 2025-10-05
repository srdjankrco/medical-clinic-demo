import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Badge, Typography } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  SafetyOutlined,
  GlobalOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/patients',
      icon: <UserOutlined />,
      label: 'Patients',
      children: [
        {
          key: '/patients/register',
          label: <Link to="/patients/register">New Registration</Link>,
        },
        {
          key: '/patients/list',
          label: <Link to="/patients/list">Patient List</Link>,
        },
        {
          key: '/patients/search',
          label: <Link to="/patients/search">Search Patients</Link>,
        },
      ],
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
      children: [
        {
          key: '/appointments/calendar',
          label: <Link to="/appointments/calendar">Calendar</Link>,
        },
        {
          key: '/appointments/new',
          label: <Link to="/appointments/new">New Appointment</Link>,
        },
      ],
    },
    {
      key: '/clinical',
      icon: <FileTextOutlined />,
      label: 'Clinical',
      children: [
        {
          key: '/clinical/documentation',
          label: <Link to="/clinical/documentation">Documentation</Link>,
        },
        {
          key: '/clinical/history',
          label: <Link to="/clinical/history">Medical History</Link>,
        },
        {
          key: '/clinical/labs',
          label: <Link to="/clinical/labs">Lab Results</Link>,
        },
      ],
    },
    {
      key: '/billing',
      icon: <DollarOutlined />,
      label: <Link to="/billing">Billing</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: 'compliance',
      icon: <SafetyOutlined />,
      label: 'Compliance',
      children: [
        {
          key: '/compliance/india',
          label: <Link to="/compliance/india">India (CEA/DPDP)</Link>,
        },
        {
          key: '/compliance/qatar',
          label: <Link to="/compliance/qatar">Qatar (MOPH/PDPPL)</Link>,
        },
      ],
    },
    {
      key: '/portal',
      icon: <GlobalOutlined />,
      label: <Link to="/portal">Patient Portal</Link>,
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            color: 'white',
            fontSize: collapsed ? '16px' : '18px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? '🏥' : '🏥 MediClinic'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/patients', '/appointments', '/clinical', 'compliance']}
          items={menuItems}
          style={{ marginTop: 8 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
            <Text strong style={{ fontSize: 16 }}>
              Demo Prototype
            </Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Demo" size="small" />
                <Text>Dr. Demo User</Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
