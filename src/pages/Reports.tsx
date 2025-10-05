import { Card, Row, Col, Typography, Tabs, DatePicker, Button, Space, Table, Statistic } from 'antd'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarOutlined, CalendarOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title } = Typography
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa8c16']

const Reports = () => {
  // Financial data
  const revenueData = [
    { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
    { month: 'Feb', revenue: 38500, expenses: 26000, profit: 12500 },
    { month: 'Mar', revenue: 45000, expenses: 29000, profit: 16000 },
    { month: 'Apr', revenue: 41000, expenses: 27500, profit: 13500 },
    { month: 'May', revenue: 43500, expenses: 28500, profit: 15000 },
    { month: 'Jun', revenue: 45890, expenses: 30000, profit: 15890 },
  ]

  const insuranceDistribution = [
    { name: 'HealthCare Plus', value: 35 },
    { name: 'MediShield', value: 28 },
    { name: 'Global Health', value: 22 },
    { name: 'Wellness Insurance', value: 15 },
  ]

  const appointmentStats = [
    { type: 'Consultation', count: 145 },
    { type: 'Follow-up', count: 89 },
    { type: 'Procedure', count: 34 },
    { type: 'Telehealth', count: 52 },
  ]

  // A/R Aging data
  const arAgingData = [
    { range: '0-30 days', amount: 12500 },
    { range: '31-60 days', amount: 8200 },
    { range: '61-90 days', amount: 4300 },
    { range: '90+ days', amount: 2100 },
  ]

  const collectionsData = [
    { key: '1', payer: 'HealthCare Plus', billed: 45000, collected: 42000, pending: 3000, rate: '93.3%' },
    { key: '2', payer: 'MediShield', billed: 32000, collected: 29500, pending: 2500, rate: '92.2%' },
    { key: '3', payer: 'Global Health', billed: 28000, collected: 25200, pending: 2800, rate: '90.0%' },
    { key: '4', payer: 'Self Pay', billed: 15000, collected: 12000, pending: 3000, rate: '80.0%' },
  ]

  const collectionsColumns = [
    { title: 'Payer', dataIndex: 'payer', key: 'payer' },
    { title: 'Billed', dataIndex: 'billed', key: 'billed', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'Collected', dataIndex: 'collected', key: 'collected', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'Pending', dataIndex: 'pending', key: 'pending', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'Collection Rate', dataIndex: 'rate', key: 'rate' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Reports & Analytics</Title>
        <Space>
          <RangePicker />
          <Button icon={<DownloadOutlined />}>Export PDF</Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="financial">
        <TabPane tab="Financial Reports" key="financial">
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Revenue (YTD)"
                  value={255890}
                  prefix={<DollarOutlined />}
                  precision={0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Collections Rate"
                  value={91.2}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Outstanding A/R"
                  value={27100}
                  prefix={<DollarOutlined />}
                  precision={0}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Revenue vs Expenses">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#52c41a" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#f5222d" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#1890ff" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Insurance Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insuranceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {insuranceDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="A/R Aging">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={arAgingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#faad14" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Collections by Payer">
                <Table
                  columns={collectionsColumns}
                  dataSource={collectionsData}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Operational Reports" key="operational">
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Appointments (Month)"
                  value={320}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Active Patients"
                  value={1248}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="No-Show Rate"
                  value={4.2}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Appointment Types Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Provider Productivity">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { provider: 'Dr. Smith', patients: 145 },
                    { provider: 'Dr. Johnson', patients: 132 },
                    { provider: 'Dr. Williams', patients: 128 },
                    { provider: 'Dr. Brown', patients: 115 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#52c41a" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Clinical Quality" key="quality">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Clinical Quality Measures">
                <Table
                  dataSource={[
                    { key: '1', measure: 'Diabetes HbA1c Testing', numerator: 145, denominator: 156, rate: '92.9%', target: '90%', status: 'Met' },
                    { key: '2', measure: 'Hypertension Control', numerator: 234, denominator: 268, rate: '87.3%', target: '85%', status: 'Met' },
                    { key: '3', measure: 'Preventive Care Screening', numerator: 412, denominator: 450, rate: '91.6%', target: '90%', status: 'Met' },
                    { key: '4', measure: 'Medication Reconciliation', numerator: 298, denominator: 320, rate: '93.1%', target: '95%', status: 'Not Met' },
                  ]}
                  columns={[
                    { title: 'Measure', dataIndex: 'measure', key: 'measure' },
                    { title: 'Numerator', dataIndex: 'numerator', key: 'numerator' },
                    { title: 'Denominator', dataIndex: 'denominator', key: 'denominator' },
                    { title: 'Rate', dataIndex: 'rate', key: 'rate' },
                    { title: 'Target', dataIndex: 'target', key: 'target' },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <span style={{ color: status === 'Met' ? '#52c41a' : '#f5222d' }}>
                          {status}
                        </span>
                      ),
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Reports
