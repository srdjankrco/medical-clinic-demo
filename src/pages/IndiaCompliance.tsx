import { Card, Row, Col, Typography, Descriptions, Table, Tag, Alert, Timeline, Progress, Statistic } from 'antd'
import { SafetyOutlined, CheckCircleOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { indiaCompliance } from '../data/mockData'

const { Title, Text } = Typography

const IndiaCompliance = () => {
  const ceaStatus = indiaCompliance.ceaRegistration
  const permits = indiaCompliance.permits
  const staffCredentials = indiaCompliance.staffCredentials

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusTag = (status: string) => {
    const colors: Record<string, string> = {
      'Valid': 'green',
      'Expiring Soon': 'orange',
      'Expired': 'red',
    }
    return <Tag color={colors[status]}>{status}</Tag>
  }

  const permitColumns = [
    {
      title: 'Permit Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Authority',
      dataIndex: 'authority',
      key: 'authority',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => {
        const days = getDaysUntilExpiry(date)
        return (
          <span>
            {date}
            {days < 90 && days > 0 && (
              <Tag color="orange" style={{ marginLeft: 8 }}>
                {days} days left
              </Tag>
            )}
          </span>
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
  ]

  const staffColumns = [
    {
      title: 'Staff Name',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag>{role}</Tag>,
    },
    {
      title: 'Registration Number',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
    },
    {
      title: 'Council',
      dataIndex: 'council',
      key: 'council',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
  ]

  const complianceScore = Math.round(
    (permits.filter(p => p.status === 'Valid').length / permits.length) * 100
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SafetyOutlined /> India Compliance Dashboard
        </Title>
        <Text type="secondary">
          Clinical Establishment Act (CEA), DPDP Act, and Regulatory Compliance
        </Text>
      </div>

      {/* Compliance Score */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Overall Compliance Score"
              value={complianceScore}
              suffix="%"
              valueStyle={{ color: complianceScore >= 90 ? '#52c41a' : '#faad14' }}
            />
            <Progress percent={complianceScore} status={complianceScore >= 90 ? 'success' : 'normal'} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Active Permits"
              value={permits.filter(p => p.status === 'Valid').length}
              suffix={`/ ${permits.length}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={permits.filter(p => p.status === 'Expiring Soon').length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* CEA Registration */}
      <Card title="Clinical Establishment Act (CEA) Registration" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Registration Status">
            <Tag color="green" icon={<CheckCircleOutlined />}>
              {ceaStatus.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Registration Number">
            {ceaStatus.registrationNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Issue Date">
            {ceaStatus.issueDate}
          </Descriptions.Item>
          <Descriptions.Item label="Expiry Date">
            {ceaStatus.expiryDate}
          </Descriptions.Item>
        </Descriptions>

        <Alert
          message="CEA Compliance Requirements"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Display patient rights charter prominently</li>
              <li>Maintain standard treatment guidelines</li>
              <li>Display service rates and charges</li>
              <li>Maintain clinical records as per standards</li>
              <li>Submit annual returns to state authority</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* Mandatory Permits */}
      <Card title="Mandatory Permits & Licenses" style={{ marginBottom: 24 }}>
        <Table
          columns={permitColumns}
          dataSource={permits}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Staff Credentials */}
      <Card title="Staff Medical Council Registrations" style={{ marginBottom: 24 }}>
        <Table
          columns={staffColumns}
          dataSource={staffCredentials}
          rowKey="id"
          pagination={false}
        />

        <Alert
          message="National Medical Register (NMR) Integration"
          description="All physician registrations are cross-verified with the National Medical Commission's National Medical Register."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* DPDP Act Compliance */}
      <Card title="Digital Personal Data Protection (DPDP) Act Compliance">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" type="inner" title="Consent Management">
              <Timeline>
                <Timeline.Item color="green">
                  <Text strong>Free & Informed Consent</Text>
                  <br />
                  <Text type="secondary">
                    Patient consent forms implemented with clear purpose disclosure
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Specific Consent</Text>
                  <br />
                  <Text type="secondary">
                    Separate consents for treatment, data processing, and communication
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Withdrawal Rights</Text>
                  <br />
                  <Text type="secondary">
                    Patients can withdraw consent at any time through portal
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" type="inner" title="Data Subject Rights">
              <Timeline>
                <Timeline.Item color="green">
                  <Text strong>Right to Access</Text>
                  <br />
                  <Text type="secondary">
                    Patients can view their data through patient portal
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Right to Correction</Text>
                  <br />
                  <Text type="secondary">
                    Data correction requests processed within 7 days
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Right to Erasure</Text>
                  <br />
                  <Text type="secondary">
                    Data deletion requests handled as per retention policies
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text strong>Breach Notification</Text>
                  <br />
                  <Text type="secondary">
                    Automated notification to Data Protection Board within 72 hours
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Col>
        </Row>

        <Alert
          message="Consent Manager Integration"
          description="System integrated with DPDP-compliant Consent Manager platform for interoperable consent management across healthcare ecosystem."
          type="info"
          showIcon
          icon={<ClockCircleOutlined />}
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  )
}

export default IndiaCompliance
