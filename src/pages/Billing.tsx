import { useMemo, useState } from 'react'
import { Card, Row, Col, Typography, Statistic, Tag, Table, Space, Select, Input, DatePicker, Button, Tabs } from 'antd'
import { DollarOutlined, CheckCircleOutlined, WarningOutlined, SearchOutlined, FilterOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { patients, claims, payments } from '../data/mockData'
import type { Claim, Payment } from '../types'
import type { ColumnsType } from 'antd/es/table'

type DateRangeValue = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const claimStatusColors: Record<Claim['status'], string> = {
  Draft: 'default',
  Submitted: 'gold',
  Accepted: 'blue',
  Rejected: 'red',
  Paid: 'green',
}

const paymentStatusColors: Record<Payment['status'], string> = {
  Pending: 'gold',
  Completed: 'green',
  Refunded: 'red',
}

type ClaimFilters = {
  status?: Claim['status'] | 'All'
  dateRange?: DateRangeValue
  patientId?: string
  search?: string
}

type PaymentFilters = {
  status?: Payment['status'] | 'All'
  dateRange?: DateRangeValue
  method?: Payment['method'] | 'All'
}

const claimsColumns: ColumnsType<Claim> = [
  {
    title: 'Claim #',
    dataIndex: 'id',
    key: 'id',
    width: 140,
  },
  {
    title: 'Patient',
    dataIndex: 'patientName',
    key: 'patientName',
    render: (_, record) => record.patientName,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Total',
    dataIndex: 'totalAmount',
    key: 'total',
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Insurance',
    dataIndex: 'insuranceAmount',
    key: 'insuranceAmount',
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Patient Portion',
    dataIndex: 'patientAmount',
    key: 'patientAmount',
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Claim['status']) => <Tag color={claimStatusColors[status]}>{status}</Tag>,
  },
  {
    title: 'Payer',
    dataIndex: 'insuranceProvider',
    key: 'insuranceProvider',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render: () => (
      <Space>
        <Button type="link" size="small" icon={<FilePdfOutlined />}>Export</Button>
        <Button type="link" size="small">Details</Button>
      </Space>
    ),
  },
]

const paymentsColumns: ColumnsType<Payment> = [
  {
    title: 'Payment #',
    dataIndex: 'id',
    key: 'id',
    width: 140,
  },
  {
    title: 'Claim',
    dataIndex: 'claimId',
    key: 'claimId',
  },
  {
    title: 'Patient',
    dataIndex: 'patientId',
    key: 'patientId',
    render: (patientId: string) => {
      const patient = patients.find(p => p.id === patientId)
      return patient ? `${patient.firstName} ${patient.lastName}` : patientId
    },
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Payment['status']) => <Tag color={paymentStatusColors[status]}>{status}</Tag>,
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
    key: 'reference',
  },
]

const Billing = () => {
  const [claimFilters, setClaimFilters] = useState<ClaimFilters>({ status: 'All' })
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilters>({ status: 'All', method: 'All' })

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      if (claimFilters.status && claimFilters.status !== 'All' && claim.status !== claimFilters.status) {
        return false
      }
      if (claimFilters.patientId && claim.patientId !== claimFilters.patientId) {
        return false
      }
      if (claimFilters.dateRange && claimFilters.dateRange[0] && claimFilters.dateRange[1]) {
        const [start, end] = claimFilters.dateRange
        const claimDate = dayjs(claim.date)
        const startOfDay = start.startOf('day')
        const endOfDay = end.endOf('day')
        if (claimDate.isBefore(startOfDay) || claimDate.isAfter(endOfDay)) {
          return false
        }
      }
      if (claimFilters.search) {
        const haystack = `${claim.id} ${claim.patientName} ${claim.insuranceProvider}`.toLowerCase()
        if (!haystack.includes(claimFilters.search.toLowerCase())) {
          return false
        }
      }
      return true
    })
  }, [claimFilters])

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      if (paymentFilters.status && paymentFilters.status !== 'All' && payment.status !== paymentFilters.status) {
        return false
      }
      if (paymentFilters.method && paymentFilters.method !== 'All' && payment.method !== paymentFilters.method) {
        return false
      }
      if (paymentFilters.dateRange && paymentFilters.dateRange[0] && paymentFilters.dateRange[1]) {
        const [start, end] = paymentFilters.dateRange
        const paymentDate = dayjs(payment.date)
        const startOfDay = start.startOf('day')
        const endOfDay = end.endOf('day')
        if (paymentDate.isBefore(startOfDay) || paymentDate.isAfter(endOfDay)) {
          return false
        }
      }
      return true
    })
  }, [paymentFilters])

  const financialSummary = useMemo(() => {
    const totalCharges = claims.reduce((sum, claim) => sum + claim.totalAmount, 0)
    const totalInsurance = claims.reduce((sum, claim) => sum + claim.insuranceAmount, 0)
    const totalPatient = claims.reduce((sum, claim) => sum + claim.patientAmount, 0)
    const collected = payments.filter(p => p.status === 'Completed').reduce((sum, payment) => sum + payment.amount, 0)
    const pending = totalPatient + totalInsurance - collected
    const rejected = claims.filter(claim => claim.status === 'Rejected').length

    return {
      totalCharges,
      totalInsurance,
      totalPatient,
      collected,
      pending,
      rejected,
    }
  }, [])

  const insuranceSummary = useMemo(() => {
    const grouped = claims.reduce<Record<string, { total: number; count: number }>>((acc, claim) => {
      const key = claim.insuranceProvider
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 }
      }
      acc[key].total += claim.totalAmount
      acc[key].count += 1
      return acc
    }, {})

    return Object.entries(grouped)
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Billing & Revenue Cycle</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Charges"
              value={`$${financialSummary.totalCharges.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Collected"
              value={`$${financialSummary.collected.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Receivables"
              value={`$${financialSummary.pending.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rejected Claims"
              value={financialSummary.rejected}
              prefix={<Tag color="red">!</Tag>}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="claims" type="card" style={{ marginBottom: 24 }}>
        <Tabs.TabPane tab="Claims" key="claims">
          <Card title="Claim Filters" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Select
                  placeholder="Status"
                  style={{ width: '100%' }}
                  value={claimFilters.status ?? 'All'}
                  onChange={value => setClaimFilters(prev => ({ ...prev, status: value }))}
                >
                  <Option value="All">All</Option>
                  <Option value="Draft">Draft</Option>
                  <Option value="Submitted">Submitted</Option>
                  <Option value="Accepted">Accepted</Option>
                  <Option value="Rejected">Rejected</Option>
                  <Option value="Paid">Paid</Option>
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Select
                  allowClear
                  placeholder="Patient"
                  style={{ width: '100%' }}
                  value={claimFilters.patientId}
                  onChange={value => setClaimFilters(prev => ({ ...prev, patientId: value }))}
                >
                  {patients.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={claimFilters.dateRange}
                  onChange={value => setClaimFilters(prev => ({ ...prev, dateRange: value ?? undefined }))}
                />
              </Col>
              <Col xs={24} md={6}>
                <Input
                  placeholder="Search claims"
                  prefix={<SearchOutlined />}
                  allowClear
                  value={claimFilters.search}
                  onChange={event => setClaimFilters(prev => ({ ...prev, search: event.target.value }))}
                />
              </Col>
            </Row>
            <Button
              style={{ marginTop: 16 }}
              icon={<FilterOutlined />}
              onClick={() => setClaimFilters({ status: 'All' })}
            >
              Reset Filters
            </Button>
          </Card>

          <Card title={`Claims (${filteredClaims.length})`}>
            <Table
              rowKey="id"
              columns={claimsColumns}
              dataSource={filteredClaims}
              pagination={{ pageSize: 10, showSizeChanger: true }}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Payments" key="payments">
          <Card title="Payment Filters" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Select
                  style={{ width: '100%' }}
                  value={paymentFilters.status ?? 'All'}
                  onChange={value => setPaymentFilters(prev => ({ ...prev, status: value }))}
                >
                  <Option value="All">All</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Refunded">Refunded</Option>
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Select
                  style={{ width: '100%' }}
                  value={paymentFilters.method ?? 'All'}
                  onChange={value => setPaymentFilters(prev => ({ ...prev, method: value }))}
                >
                  <Option value="All">All Methods</Option>
                  <Option value="Cash">Cash</Option>
                  <Option value="Card">Card</Option>
                  <Option value="Insurance">Insurance</Option>
                  <Option value="Online">Online</Option>
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={paymentFilters.dateRange}
                  onChange={value => setPaymentFilters(prev => ({ ...prev, dateRange: value ?? undefined }))}
                />
              </Col>
            </Row>
            <Button
              style={{ marginTop: 16 }}
              icon={<FilterOutlined />}
              onClick={() => setPaymentFilters({ status: 'All', method: 'All' })}
            >
              Reset Filters
            </Button>
          </Card>

          <Card title={`Payments (${filteredPayments.length})`}>
            <Table
              rowKey="id"
              columns={paymentsColumns}
              dataSource={filteredPayments}
              pagination={{ pageSize: 10, showSizeChanger: true }}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Card title="Insurance Mix">
        <Row gutter={[16, 16]}>
          {insuranceSummary.map(([provider, stats]) => (
            <Col key={provider} xs={24} md={8} lg={6}>
              <Card>
                <Space direction="vertical" size={4}>
                  <Text strong>{provider}</Text>
                  <Text type="secondary">Claims: {stats.count}</Text>
                  <Text>Total Billed: ${stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default Billing
