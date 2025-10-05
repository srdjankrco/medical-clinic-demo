import { Card, Row, Col, Typography, Descriptions, Table, Tag, Alert, Steps, Timeline, Statistic } from 'antd'
import { SafetyOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { qatarCompliance } from '../data/mockData'

const { Title, Text } = Typography

const QatarCompliance = () => {
  const mophLicensing = qatarCompliance.mophLicensing
  const dhpCredentials = qatarCompliance.dhpCredentials
  const equipmentApprovals = qatarCompliance.equipmentApprovals

  const getStageIndex = (stage: string) => {
    const stages = ['Not Started', 'Project Proposal', 'Ancillary Approvals', 'Final Assessment', 'Licensed']
    return stages.indexOf(stage)
  }

  const dhpColumns = [
    {
      title: 'Staff Name',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Profession',
      dataIndex: 'profession',
      key: 'profession',
    },
    {
      title: 'PSV Status',
      dataIndex: 'psvStatus',
      key: 'psvStatus',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'green' : status === 'Pending' ? 'blue' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Prometric',
      dataIndex: 'prometricStatus',
      key: 'prometricStatus',
      render: (status: string) => (
        <Tag color={status === 'Passed' ? 'green' : status === 'Scheduled' ? 'blue' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'DHP Status',
      dataIndex: 'dhpStatus',
      key: 'dhpStatus',
      render: (status: string) => (
        <Tag color={status === 'Licensed' ? 'green' : status === 'Under Review' ? 'blue' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'License Number',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
      render: (num: string) => num || '-',
    },
    {
      title: 'Expiry',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => date || '-',
    },
  ]

  const equipmentColumns = [
    {
      title: 'Equipment',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Approval Market',
      dataIndex: 'approvalMarket',
      key: 'approvalMarket',
      render: (market: string) => <Tag color="blue">{market}</Tag>,
    },
    {
      title: 'Approval Number',
      dataIndex: 'approvalNumber',
      key: 'approvalNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : status === 'Pending' ? 'blue' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SafetyOutlined /> Qatar Compliance Dashboard
        </Title>
        <Text type="secondary">
          MOPH Licensing, DHP Credentialing, and PDPPL Compliance
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="MOPH License Status"
              value={mophLicensing.stage}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: mophLicensing.stage === 'Licensed' ? '#52c41a' : '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Licensed Staff"
              value={dhpCredentials.filter(c => c.dhpStatus === 'Licensed').length}
              suffix={`/ ${dhpCredentials.length}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Approved Equipment"
              value={equipmentApprovals.filter(e => e.status === 'Approved').length}
              suffix={`/ ${equipmentApprovals.length}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* MOPH Licensing Process */}
      <Card title="MOPH Licensing Process" style={{ marginBottom: 24 }}>
        <Steps
          current={getStageIndex(mophLicensing.stage)}
          items={[
            {
              title: 'Project Proposal',
              description: 'Initial application and design submission',
              icon: mophLicensing.stage === 'Project Proposal' ? <SyncOutlined spin /> : undefined,
            },
            {
              title: 'Ancillary Approvals',
              description: 'Civil Defence, Municipality clearances',
              icon: mophLicensing.stage === 'Ancillary Approvals' ? <SyncOutlined spin /> : undefined,
            },
            {
              title: 'Final Assessment',
              description: 'On-site inspection by MOPH',
              icon: mophLicensing.stage === 'Final Assessment' ? <SyncOutlined spin /> : undefined,
            },
            {
              title: 'Licensed',
              description: 'Facility operational license issued',
              icon: mophLicensing.stage === 'Licensed' ? <CheckCircleOutlined /> : undefined,
            },
          ]}
          style={{ marginBottom: 24 }}
        />

        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Application Number">
            {mophLicensing.applicationNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Submitted Date">
            {mophLicensing.submittedDate}
          </Descriptions.Item>
          <Descriptions.Item label="Approval Date">
            {mophLicensing.approvalDate}
          </Descriptions.Item>
          <Descriptions.Item label="License Number">
            {mophLicensing.licenseNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Current Stage">
            <Tag color="green">{mophLicensing.stage}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Expiry Date">
            {mophLicensing.expiryDate}
          </Descriptions.Item>
        </Descriptions>

        <Alert
          message="MOPH Standards Compliance"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Facility designed as per MOPH architectural guidelines</li>
              <li>Gender-separated waiting areas and treatment rooms</li>
              <li>All infrastructure documentation maintained</li>
              <li>Annual license renewal process tracked</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* DHP Credentialing */}
      <Card title="DHP Staff Credentialing" style={{ marginBottom: 24 }}>
        <Table
          columns={dhpColumns}
          dataSource={dhpCredentials}
          rowKey="id"
          pagination={false}
        />

        <Alert
          message="DHP Licensing Process"
          description={
            <Timeline style={{ marginTop: 16 }}>
              <Timeline.Item color="green">
                <Text strong>Primary Source Verification (PSV)</Text>
                <br />
                <Text type="secondary">Credentials verified through DataFlow</Text>
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text strong>Prometric Examination</Text>
                <br />
                <Text type="secondary">Professional competency assessment</Text>
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text strong>DHP Evaluation</Text>
                <br />
                <Text type="secondary">Final review and license issuance</Text>
              </Timeline.Item>
            </Timeline>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* Equipment Approvals */}
      <Card title="Medical Equipment Approvals (GHTF Markets)" style={{ marginBottom: 24 }}>
        <Table
          columns={equipmentColumns}
          dataSource={equipmentApprovals}
          rowKey="id"
          pagination={false}
        />

        <Alert
          message="GHTF Founding Member Markets"
          description="All medical devices approved by FDA (USA), CE (Europe), TGA (Australia), Health Canada, or PMDA (Japan) are recognized by MOPH."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* PDPPL Compliance */}
      <Card title="Personal Data Protection Law (PDPPL) Compliance">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" type="inner" title="Sensitive Personal Data Processing">
              <Timeline>
                <Timeline.Item color="green">
                  <Text strong>Special Permit Obtained</Text>
                  <br />
                  <Text type="secondary">
                    Permit from National Data Privacy Office for health data processing
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Enhanced Security Measures</Text>
                  <br />
                  <Text type="secondary">
                    Encryption, access controls, and audit logging implemented
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Consent Management</Text>
                  <br />
                  <Text type="secondary">
                    Explicit consent for processing sensitive health information
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
                    Patients can access their personal data within 30 days
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Right to Rectification</Text>
                  <br />
                  <Text type="secondary">
                    Inaccurate data corrected upon patient request
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="green">
                  <Text strong>Right to Erasure</Text>
                  <br />
                  <Text type="secondary">
                    Data deletion subject to legal retention requirements
                  </Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text strong>72-Hour Breach Notification</Text>
                  <br />
                  <Text type="secondary">
                    Automated breach notification system configured
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Col>
        </Row>

        <Alert
          message="Data Privacy Impact Assessment (DPIA)"
          description="Comprehensive DPIA conducted and updated annually to assess risks in processing sensitive health data."
          type="info"
          showIcon
          icon={<ClockCircleOutlined />}
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  )
}

export default QatarCompliance
