import { Card, Col, Row, Statistic, Typography, Table, Tag, Button, Space } from 'antd'
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardMetrics, appointments, patients } from '../data/mockData'
import type { Appointment } from '../types'

const { Title, Text } = Typography

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa8c16']

const Dashboard = () => {
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments
    .filter(apt => apt.date === today)
    .slice(0, 5)
    .map(apt => ({
      ...apt,
      patient: patients.find(p => p.id === apt.patientId),
    }))

  const appointmentColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Provider',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Telehealth' ? 'blue' : 'default'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Appointment['status']) => {
        const colors = {
          'Scheduled': 'blue',
          'Checked-in': 'green',
          'In Progress': 'orange',
          'Completed': 'default',
          'Cancelled': 'red',
          'No-show': 'red',
        }
        return <Tag color={colors[status]}>{status}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small" icon={<EyeOutlined />}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        <Space>
          <Button>Export Report</Button>
          <Button type="primary">New Appointment</Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Appointments"
              value={dashboardMetrics.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  / 32 total
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Waiting Patients"
              value={dashboardMetrics.waitingPatients}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={<ArrowUpOutlined style={{ fontSize: 12, color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Patients"
              value={dashboardMetrics.activePatients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={dashboardMetrics.monthlyRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Appointment Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardMetrics.appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardMetrics.appointmentsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend (Last 6 Months)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardMetrics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Patient Flow & Today's Appointments */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Patient Flow (Today)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardMetrics.patientFlowToday}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Today's Appointments">
            <Table
              columns={appointmentColumns}
              dataSource={todayAppointments}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
