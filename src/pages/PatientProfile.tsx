import { useParams } from 'react-router-dom'
import { Card, Descriptions, Tabs, Table, Tag, Button, Space, Avatar, Typography, Row, Col, Timeline, Empty, Statistic } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  ExperimentOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { medications, allergies, problems, getPatientById, getAppointmentsByPatient, getClinicalNotesByPatient } from '../data/mockData'
import type { Appointment } from '../types'

const { Title, Text } = Typography
const { TabPane } = Tabs

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>()
  const patient = getPatientById(id || '')
  const patientAppointments = getAppointmentsByPatient(id || '')
  const patientClinicalNotes = getClinicalNotesByPatient(id || '')
  const patientMedications = medications.slice(0, 5)
  const patientAllergies = allergies.slice(0, 3)
  const patientProblems = problems.slice(0, 4)

  if (!patient) {
    return (
      <Card>
        <Empty description="Patient not found" />
      </Card>
    )
  }

  const calculateAge = (dob: string): number => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Vital signs trending data (mock)
  const vitalsTrendData = [
    { date: '2024-01', bp: 120, hr: 72, weight: 70 },
    { date: '2024-02', bp: 118, hr: 75, weight: 69.5 },
    { date: '2024-03', bp: 122, hr: 70, weight: 70.2 },
    { date: '2024-04', bp: 119, hr: 73, weight: 69.8 },
    { date: '2024-05', bp: 121, hr: 71, weight: 70.1 },
    { date: '2024-06', bp: 120, hr: 74, weight: 69.9 },
  ]

  const appointmentColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
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
  ]

  const medicationColumns = [
    {
      title: 'Medication',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
  ]

  return (
    <div>
      {/* Patient Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={100} src={patient.photoUrl} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0 }}>
                {patient.firstName} {patient.lastName}
              </Title>
              <Space size="large">
                <Text type="secondary">
                  <UserOutlined /> {patient.gender} • {calculateAge(patient.dateOfBirth)} years
                </Text>
                <Text type="secondary">
                  <CalendarOutlined /> DOB: {patient.dateOfBirth}
                </Text>
                <Text type="secondary">
                  Patient ID: {patient.id}
                </Text>
                <Tag color={patient.status === 'Active' ? 'green' : 'default'}>
                  {patient.status}
                </Tag>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<CalendarOutlined />}>
                Book Appointment
              </Button>
              <Button icon={<FileTextOutlined />}>
                New Note
              </Button>
              <Button icon={<EditOutlined />}>
                Edit
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Alerts Section */}
        {patientAllergies.length > 0 && (
          <div style={{ marginTop: 16, padding: 12, background: '#fff2e8', borderRadius: 6, border: '1px solid #ffbb96' }}>
            <Space>
              <WarningOutlined style={{ color: '#fa8c16', fontSize: 18 }} />
              <Text strong style={{ color: '#fa8c16' }}>Allergies:</Text>
              {patientAllergies.map(allergy => (
                <Tag key={allergy.id} color="orange">
                  {allergy.allergen} - {allergy.severity}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Visits"
              value={patientAppointments.filter(a => a.status === 'Completed').length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Medications"
              value={patientMedications.filter(m => m.status === 'Active').length}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Blood Type"
              value={patient.bloodType || 'N/A'}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabbed Content */}
      <Card>
        <Tabs defaultActiveKey="demographics">
          <TabPane tab="Demographics" key="demographics">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Full Name">
                {patient.firstName} {patient.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {patient.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {patient.dateOfBirth}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {calculateAge(patient.dateOfBirth)} years
              </Descriptions.Item>
              <Descriptions.Item label="Blood Type">
                {patient.bloodType || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="National ID">
                {patient.nationalId}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                <MailOutlined /> {patient.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={2}>
                <PhoneOutlined /> {patient.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                <HomeOutlined /> {patient.address.street}, {patient.address.city}, {patient.address.state}, {patient.address.postalCode}, {patient.address.country}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Contact">
                {patient.emergencyContact.name}
              </Descriptions.Item>
              <Descriptions.Item label="Relationship">
                {patient.emergencyContact.relationship}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Phone" span={2}>
                {patient.emergencyContact.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Insurance Provider" span={2}>
                {patient.insurance.provider}
              </Descriptions.Item>
              <Descriptions.Item label="Policy Number">
                {patient.insurance.policyNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Group Number">
                {patient.insurance.groupNumber || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="Medical History" key="history">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="Active Problems" size="small" style={{ marginBottom: 16 }}>
                  <Timeline>
                    {patientProblems.filter(p => p.status === 'Active' || p.status === 'Chronic').map(problem => (
                      <Timeline.Item key={problem.id} color={problem.status === 'Chronic' ? 'red' : 'blue'}>
                        <Text strong>{problem.description}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Since: {problem.onsetDate} • {problem.icdCode}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>

                <Card title="Allergies" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {patientAllergies.map(allergy => (
                      <Card key={allergy.id} size="small" type="inner">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Text strong>{allergy.allergen}</Text>
                            <Tag color={allergy.severity === 'Severe' ? 'red' : allergy.severity === 'Moderate' ? 'orange' : 'default'} style={{ marginLeft: 8 }}>
                              {allergy.severity}
                            </Tag>
                          </div>
                          <Text type="secondary">Reaction: {allergy.reaction}</Text>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Vital Signs Trend" size="small" style={{ marginBottom: 16 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalsTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bp" stroke="#1890ff" name="BP (Systolic)" />
                      <Line type="monotone" dataKey="hr" stroke="#52c41a" name="Heart Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card title="Current Medications" size="small">
                  <Table
                    columns={medicationColumns}
                    dataSource={patientMedications}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Appointments" key="appointments">
            <Table
              columns={appointmentColumns}
              dataSource={patientAppointments}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="Clinical Notes" key="notes">
            <Timeline>
              {patientClinicalNotes.map(note => (
                <Timeline.Item key={note.id}>
                  <Card size="small" title={`${note.date} - ${note.providerName}`}>
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="Subjective">{note.subjective}</Descriptions.Item>
                      <Descriptions.Item label="Objective">{note.objective}</Descriptions.Item>
                      <Descriptions.Item label="Assessment">{note.assessment}</Descriptions.Item>
                      <Descriptions.Item label="Plan">{note.plan}</Descriptions.Item>
                    </Descriptions>
                    {note.vitalSigns && (
                      <div style={{ marginTop: 12 }}>
                        <Text strong>Vitals: </Text>
                        <Text>
                          BP: {note.vitalSigns.bloodPressureSystolic}/{note.vitalSigns.bloodPressureDiastolic} • 
                          HR: {note.vitalSigns.heartRate} bpm • 
                          Temp: {note.vitalSigns.temperature}°C • 
                          SpO2: {note.vitalSigns.oxygenSaturation}%
                        </Text>
                      </div>
                    )}
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>

          <TabPane tab="Documents" key="documents">
            <Empty description="No documents uploaded" />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default PatientProfile
