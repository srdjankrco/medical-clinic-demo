import { Card, Row, Col, Typography, List, Tag, Button, Space, Avatar, Timeline, Descriptions, Empty, Statistic } from 'antd'
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  DollarOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  DownloadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { patients, appointments, medications, allergies } from '../data/mockData'

const { Title, Text } = Typography

const PatientPortal = () => {
  // Mock logged-in patient
  const patient = patients[0]
  const patientAppointments = appointments.filter(a => a.patientId === patient.id).slice(0, 3)
  const upcomingAppointments = patientAppointments.filter(a => new Date(a.date) > new Date())
  const patientMedications = medications.filter(m => m.status === 'Active').slice(0, 4)
  const patientAllergies = allergies.slice(0, 2)

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Welcome Header */}
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
          <Row align="middle" gutter={24}>
            <Col>
              <Avatar size={80} src={patient.photoUrl} icon={<UserOutlined />} />
            </Col>
            <Col flex="auto">
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                Welcome back, {patient.firstName}!
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                Patient ID: {patient.id}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Alerts */}
        {patientAllergies.length > 0 && (
          <Card style={{ marginBottom: 24, borderLeft: '4px solid #fa8c16' }}>
            <Space>
              <WarningOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <Text strong style={{ fontSize: 16 }}>Important: Allergies on Record</Text>
                <div>
                  {patientAllergies.map(allergy => (
                    <Tag key={allergy.id} color="orange" style={{ marginTop: 8 }}>
                      {allergy.allergen} - {allergy.severity}
                    </Tag>
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        )}

        {/* Quick Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Upcoming Appointments"
                value={upcomingAppointments.length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Unread Messages"
                value={3}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Medications"
                value={patientMedications.length}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Outstanding Balance"
                value={0}
                prefix="$"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Appointments */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Upcoming Appointments</span>
                </Space>
              }
              extra={<Button type="primary" size="small">Request Appointment</Button>}
            >
              {upcomingAppointments.length === 0 ? (
                <Empty description="No upcoming appointments" />
              ) : (
                <List
                  dataSource={upcomingAppointments}
                  renderItem={apt => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<CalendarOutlined />} style={{ background: '#1890ff' }} />}
                        title={`${apt.date} at ${apt.time}`}
                        description={
                          <Space direction="vertical" size="small">
                            <Text>Dr. {apt.providerName}</Text>
                            <Tag color="blue">{apt.type}</Tag>
                            <Text type="secondary">{apt.reason}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          {/* Messages */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <MessageOutlined />
                  <span>Recent Messages</span>
                </Space>
              }
              extra={<Button type="primary" size="small">New Message</Button>}
            >
              <List
                dataSource={[
                  { id: 1, from: 'Dr. Smith', subject: 'Lab results available', date: '2024-06-15', unread: true },
                  { id: 2, from: 'Clinic Admin', subject: 'Appointment reminder', date: '2024-06-14', unread: true },
                  { id: 3, from: 'Dr. Johnson', subject: 'Follow-up instructions', date: '2024-06-10', unread: false },
                ]}
                renderItem={msg => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<MessageOutlined />} style={{ background: msg.unread ? '#52c41a' : '#d9d9d9' }} />}
                      title={
                        <Space>
                          {msg.subject}
                          {msg.unread && <Tag color="green">New</Tag>}
                        </Space>
                      }
                      description={`From: ${msg.from} • ${msg.date}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Medical Records */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Medical Records</span>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Card size="small" type="inner">
                  <Text strong>Current Medications</Text>
                  <List
                    size="small"
                    dataSource={patientMedications}
                    renderItem={med => (
                      <List.Item>
                        <Text>{med.name} - {med.dosage}</Text>
                        <Text type="secondary">{med.frequency}</Text>
                      </List.Item>
                    )}
                  />
                </Card>

                <Card size="small" type="inner">
                  <Text strong>Recent Lab Results</Text>
                  <Timeline style={{ marginTop: 16 }}>
                    <Timeline.Item color="green">
                      <Space direction="vertical" size={0}>
                        <Text strong>Complete Blood Count</Text>
                        <Text type="secondary">2024-06-10</Text>
                        <Button type="link" size="small" icon={<DownloadOutlined />} style={{ paddingLeft: 0 }}>
                          View Results
                        </Button>
                      </Space>
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Space direction="vertical" size={0}>
                        <Text strong>Lipid Panel</Text>
                        <Text type="secondary">2024-05-15</Text>
                        <Button type="link" size="small" icon={<DownloadOutlined />} style={{ paddingLeft: 0 }}>
                          View Results
                        </Button>
                      </Space>
                    </Timeline.Item>
                  </Timeline>
                </Card>

                <Card size="small" type="inner">
                  <Text strong>Visit Summaries</Text>
                  <Timeline style={{ marginTop: 16 }}>
                    <Timeline.Item>
                      <Space direction="vertical" size={0}>
                        <Text strong>Annual Physical Exam</Text>
                        <Text type="secondary">Dr. Smith • 2024-06-01</Text>
                        <Button type="link" size="small" icon={<DownloadOutlined />} style={{ paddingLeft: 0 }}>
                          View Summary
                        </Button>
                      </Space>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Space>
            </Card>
          </Col>

          {/* Health Information */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Health Information</span>
                </Space>
              }
              extra={<Button size="small">Update</Button>}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Blood Type">{patient.bloodType}</Descriptions.Item>
                <Descriptions.Item label="Allergies">
                  <Space direction="vertical">
                    {patientAllergies.map(a => (
                      <Tag key={a.id} color="orange">{a.allergen}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                  <br />
                  {patient.emergencyContact.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance">
                  {patient.insurance.provider}
                  <br />
                  Policy: {patient.insurance.policyNumber}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <Space>
                  <DollarOutlined />
                  <span>Billing</span>
                </Space>
              }
              style={{ marginTop: 16 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Current Balance:</Text>
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>$0.00</Text>
                </div>
                <Button type="primary" block>View Billing History</Button>
                <Button block>Make a Payment</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default PatientPortal
