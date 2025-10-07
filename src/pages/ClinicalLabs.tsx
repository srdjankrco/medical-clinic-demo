import { useMemo, useState } from 'react'
import { Card, Row, Col, Typography, Select, Tag, Table, Space, Statistic, DatePicker, Button, Input, Modal, Descriptions } from 'antd'
import { SearchOutlined, FilterOutlined, DownloadOutlined, ExperimentOutlined, FileTextOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { patients, providers, labResults } from '../data/mockData'
import type { LabResult, LabResultItem } from '../types'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

type Filters = {
  patientId?: string
  providerId?: string
  status?: LabResult['status'] | 'All'
  dateRange?: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  search?: string
}

const statusColors: Record<LabResult['status'], string> = {
  Ordered: 'gold',
  'In Progress': 'blue',
  Completed: 'green',
  Cancelled: 'red',
}

const columns = (
  onViewResult: (record: LabResult) => void,
): ColumnsType<LabResult> => [
  {
    title: 'Order #',
    dataIndex: 'id',
    key: 'id',
    width: 130,
  },
  {
    title: 'Test',
    dataIndex: 'testName',
    key: 'testName',
    render: (value: string, record) => (
      <Space direction="vertical" size={0}>
        <Text strong>{value}</Text>
        <Text type="secondary">{record.testCode}</Text>
      </Space>
    ),
  },
  {
    title: 'Patient',
    dataIndex: 'patientId',
    key: 'patient',
    render: (value: string) => {
      const patient = patients.find(p => p.id === value)
      return patient ? `${patient.firstName} ${patient.lastName}` : value
    },
  },
  {
    title: 'Ordering Provider',
    key: 'provider',
    render: (_, record) => record.performedBy,
  },
  {
    title: 'Ordered',
    dataIndex: 'orderDate',
    key: 'orderDate',
  },
  {
    title: 'Result Date',
    dataIndex: 'resultDate',
    key: 'resultDate',
    render: (value?: string) => value ?? '—',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: LabResult['status']) => <Tag color={statusColors[status]}>{status}</Tag>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<FileTextOutlined />} onClick={() => onViewResult(record)}>
          Details
        </Button>
        <Button type="link" size="small" icon={<DownloadOutlined />}>PDF</Button>
      </Space>
    ),
  },
]

const ClinicalLabs = () => {
  const [filters, setFilters] = useState<Filters>({ status: 'All' })
  const [selectedLab, setSelectedLab] = useState<LabResult | null>(null)

  const filteredResults = useMemo(() => {
    return labResults.filter(result => {
      if (filters.patientId && result.patientId !== filters.patientId) {
        return false
      }
      if (filters.status && filters.status !== 'All' && result.status !== filters.status) {
        return false
      }
      if (filters.providerId && result.performedBy !== providers.find(p => p.id === filters.providerId)?.name) {
        return false
      }
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const [start, end] = filters.dateRange
        const ordered = dayjs(result.orderDate)
        const startOfDay = start.startOf('day')
        const endOfDay = end.endOf('day')
        if (ordered.isBefore(startOfDay) || ordered.isAfter(endOfDay)) {
          return false
        }
      }
      if (filters.search) {
        const haystack = `${result.testName} ${result.testCode} ${result.performedBy}`.toLowerCase()
        if (!haystack.includes(filters.search.toLowerCase())) {
          return false
        }
      }
      return true
    })
  }, [filters])

  const stats = useMemo(() => {
    const total = labResults.length
    const completed = labResults.filter(lab => lab.status === 'Completed').length
    const inProgress = labResults.filter(lab => lab.status === 'In Progress').length
    const ordered = labResults.filter(lab => lab.status === 'Ordered').length
    return { total, completed, inProgress, ordered }
  }, [])

  const resetFilters = () => {
    setFilters({ status: 'All' })
  }

  const handleDateRangeChange = (value: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setFilters(prev => ({ ...prev, dateRange: value }))
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Laboratory Orders & Results</Title>
        <Space>
          <Input
            placeholder="Search tests, codes, labs"
            prefix={<SearchOutlined />}
            allowClear
            value={filters.search}
            onChange={event => setFilters(prev => ({ ...prev, search: event.target.value }))}
            style={{ width: 260 }}
          />
          <Button icon={<FilterOutlined />} onClick={resetFilters}>
            Reset Filters
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Orders" value={stats.total} prefix={<ExperimentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Completed" value={stats.completed} prefix={<Tag color="green"> </Tag>} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="In Progress" value={stats.inProgress} prefix={<Tag color="blue"> </Tag>} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Ordered" value={stats.ordered} prefix={<Tag color="gold"> </Tag>} />
          </Card>
        </Col>
      </Row>

      <Card title="Filters" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
              placeholder="Patient"
              style={{ width: '100%' }}
              value={filters.patientId}
              onChange={value => setFilters(prev => ({ ...prev, patientId: value }))}
            >
              {patients.map(patient => (
                <Option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
              placeholder="Performing Lab"
              style={{ width: '100%' }}
              value={filters.providerId}
              onChange={value => setFilters(prev => ({ ...prev, providerId: value }))}
            >
              {providers.map(provider => (
                <Option key={provider.id} value={provider.id}>
                  {provider.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              value={filters.status ?? 'All'}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="All">All</Option>
              <Option value="Ordered">Ordered</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange ?? null}
              onChange={handleDateRangeChange}
            />
          </Col>
        </Row>
      </Card>

      <Card title={`Lab Orders (${filteredResults.length})`}>
        <Table
          rowKey="id"
          size="middle"
          scroll={{ x: 900 }}
          columns={columns(setSelectedLab)}
          dataSource={filteredResults}
        />
      </Card>

      <Modal
        title={selectedLab ? `${selectedLab.testName} (${selectedLab.testCode})` : 'Result Details'}
        open={Boolean(selectedLab)}
        onCancel={() => setSelectedLab(null)}
        footer={null}
        width={720}
      >
        {selectedLab && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Order #">{selectedLab.id}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedLab.status]}>{selectedLab.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Patient" span={2}>
                {patients.find(p => p.id === selectedLab.patientId)?.firstName}{' '}
                {patients.find(p => p.id === selectedLab.patientId)?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Ordered">{selectedLab.orderDate}</Descriptions.Item>
              <Descriptions.Item label="Result">{selectedLab.resultDate ?? 'Pending'}</Descriptions.Item>
              <Descriptions.Item label="Performed By" span={2}>{selectedLab.performedBy}</Descriptions.Item>
            </Descriptions>

            <Table
              size="small"
              dataSource={selectedLab.results}
              rowKey={(item: LabResultItem) => `${selectedLab.id}-${item.name}`}
              pagination={false}
              columns={[
                { title: 'Analyte', dataIndex: 'name', key: 'name' },
                { title: 'Value', dataIndex: 'value', key: 'value' },
                { title: 'Unit', dataIndex: 'unit', key: 'unit', width: 120 },
                { title: 'Reference Range', dataIndex: 'referenceRange', key: 'range' },
                {
                  title: 'Flag',
                  dataIndex: 'isAbnormal',
                  key: 'flag',
                  width: 100,
                  render: (flag: boolean) => (flag ? <Tag color="red">High/Low</Tag> : <Tag>Normal</Tag>),
                },
              ]}
            />

            {selectedLab.notes && <Text type="secondary">Notes: {selectedLab.notes}</Text>}
          </Space>
        )}
      </Modal>
    </div>
  )
}

export default ClinicalLabs
