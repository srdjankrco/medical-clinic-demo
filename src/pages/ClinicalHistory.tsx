import { useMemo, useState } from 'react'
import { Card, Row, Col, Typography, Select, Descriptions, Timeline, Space, Tag, Table, Statistic, Collapse, List } from 'antd'
import { CalendarOutlined, MedicineBoxOutlined, ExperimentOutlined, WarningOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  patients,
  clinicalNotes,
  appointments,
  allergies,
  medications,
  problems,
  labResults,
  immunizationsByPatient,
} from '../data/mockData'
import type { ClinicalNote, LabResult } from '../types'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Panel } = Collapse

const noteTimelineItem = (note: ClinicalNote) => (
  <Timeline.Item key={note.id} color="blue">
    <Card size="small" title={`${note.date} • ${note.providerName}`}>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Subjective">{note.subjective}</Descriptions.Item>
        <Descriptions.Item label="Objective">{note.objective}</Descriptions.Item>
        <Descriptions.Item label="Assessment">{note.assessment}</Descriptions.Item>
        <Descriptions.Item label="Plan">{note.plan}</Descriptions.Item>
      </Descriptions>
      {note.vitalSigns && (
        <Paragraph style={{ marginTop: 12 }}>
          <Text strong>Vitals:</Text>{' '}
          <Text>
            Temp {note.vitalSigns.temperature}°C • BP {note.vitalSigns.bloodPressureSystolic}/{note.vitalSigns.bloodPressureDiastolic} • HR {note.vitalSigns.heartRate} bpm • SpO₂ {note.vitalSigns.oxygenSaturation}%
          </Text>
        </Paragraph>
      )}
      {note.diagnoses.length > 0 && (
        <Space wrap style={{ marginTop: 8 }}>
          {note.diagnoses.map(diag => (
            <Tag key={diag.code} color={diag.type === 'Primary' ? 'green' : 'default'}>
              {diag.code} — {diag.description}
            </Tag>
          ))}
        </Space>
      )}
    </Card>
  </Timeline.Item>
)

const LabResultList = ({ results }: { results: LabResult[] }) => (
  <List
    itemLayout="vertical"
    dataSource={results}
    renderItem={lab => (
      <List.Item key={lab.id}>
        <List.Item.Meta
          title={
            <Space size="small">
              <ExperimentOutlined />
              <Text strong>{lab.testName}</Text>
              <Tag color={lab.status === 'Completed' ? 'green' : lab.status === 'In Progress' ? 'blue' : 'gold'}>
                {lab.status}
              </Tag>
            </Space>
          }
          description={
            <Space size="small">
              <Text type="secondary">Ordered {lab.orderDate}</Text>
              {lab.resultDate && <Text type="secondary">• Result {lab.resultDate}</Text>}
              <Text type="secondary">• Performed by {lab.performedBy}</Text>
            </Space>
          }
        />
        <Table
          size="small"
          rowKey={item => `${lab.id}-${item.name}`}
          dataSource={lab.results}
          pagination={false}
          columns={[
            { title: 'Analyte', dataIndex: 'name', key: 'name' },
            { title: 'Value', dataIndex: 'value', key: 'value' },
            { title: 'Units', dataIndex: 'unit', key: 'unit', width: 100 },
            { title: 'Reference Range', dataIndex: 'referenceRange', key: 'range' },
            {
              title: 'Flag',
              dataIndex: 'isAbnormal',
              key: 'flag',
              width: 100,
              render: (isAbnormal: boolean) =>
                isAbnormal ? <Tag color="red">High/Low</Tag> : <Tag color="default">Normal</Tag>,
            },
          ]}
        />
        {lab.notes && (
          <Paragraph style={{ marginTop: 8 }}>
            <Text type="secondary">Note: {lab.notes}</Text>
          </Paragraph>
        )}
      </List.Item>
    )}
  />
)

const ClinicalHistory = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? '')

  const patient = useMemo(() => patients.find(p => p.id === selectedPatientId) ?? patients[0], [selectedPatientId])

  const patientAppointments = useMemo(
    () => appointments.filter(apt => apt.patientId === patient?.id),
    [patient?.id],
  )

  const patientNotes = useMemo(
    () => clinicalNotes.filter(note => note.patientId === patient?.id).sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
    [patient?.id],
  )

  const patientLabs = useMemo(
    () => labResults.filter(lab => lab.patientId === patient?.id).sort((a, b) => dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf()),
    [patient?.id],
  )

  const patientImmunizations = useMemo(() => immunizationsByPatient[patient?.id ?? ''] ?? [], [patient?.id])

  const recentAllergies = allergies.slice(0, 3)
  const activeMedications = medications.filter(m => m.status === 'Active').slice(0, 5)
  const chronicProblems = problems.filter(p => p.status !== 'Resolved').slice(0, 5)

  const visitStats = {
    totalVisits: patientAppointments.filter(apt => apt.status === 'Completed').length,
    upcoming: patientAppointments.filter(apt => dayjs(apt.date).isAfter(dayjs())).length,
    lastVisit: patientAppointments
      .filter(apt => apt.status === 'Completed')
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())[0]?.date,
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Clinical History</Title>
        <Select
          showSearch
          value={patient?.id}
          style={{ minWidth: 260 }}
          placeholder="Select patient"
          optionFilterProp="children"
          onChange={value => setSelectedPatientId(value)}
          filterOption={(input, option) =>
            option?.children ? String(option.children).toLowerCase().includes(input.toLowerCase()) : false
          }
        >
          {patients.map(p => (
            <Option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} ({p.id})
            </Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card title="Visit Summary">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Statistic
                title="Total Visits"
                value={visitStats.totalVisits}
                prefix={<CalendarOutlined />}
              />
              <Statistic
                title="Upcoming Appointments"
                value={visitStats.upcoming}
                prefix={<HistoryOutlined />}
              />
              <Statistic
                title="Last Visit"
                value={visitStats.lastVisit ?? 'No completed visits'}
                prefix={<FileTextOutlined />}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Patient Snapshot">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Patient ID">{patient?.id}</Descriptions.Item>
              <Descriptions.Item label="DOB">{patient?.dateOfBirth}</Descriptions.Item>
              <Descriptions.Item label="Gender">{patient?.gender}</Descriptions.Item>
              <Descriptions.Item label="Blood Type">{patient?.bloodType ?? 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Primary Phone">{patient?.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{patient?.email}</Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {patient?.address.street}, {patient?.address.city}, {patient?.address.state}, {patient?.address.country}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Active Problems" extra={<Tag color="blue">Chronic & Active</Tag>}>
            <List
              dataSource={chronicProblems}
              renderItem={problem => (
                <List.Item key={problem.id}>
                  <List.Item.Meta
                    title={
                      <Space size="small">
                        <WarningOutlined style={{ color: '#faad14' }} />
                        <Text strong>{problem.description}</Text>
                        <Tag>{problem.icdCode}</Tag>
                      </Space>
                    }
                    description={`Since ${problem.onsetDate}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Active Medications" extra={<Tag color="purple">Medication List</Tag>}>
            <List
              dataSource={activeMedications}
              renderItem={med => (
                <List.Item key={med.id}>
                  <List.Item.Meta
                    avatar={<MedicineBoxOutlined style={{ color: '#722ed1', fontSize: 20 }} />}
                    title={`${med.name} • ${med.dosage}`}
                    description={`${med.frequency} • Route: ${med.route}`}
                  />
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Start: {med.startDate}</Text>
                    {med.instructions && <Text type="secondary">Instructions: {med.instructions}</Text>}
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Allergies" extra={<Tag color="volcano">Critical</Tag>}>
            <List
              dataSource={recentAllergies}
              renderItem={allergy => (
                <List.Item key={allergy.id}>
                  <List.Item.Meta
                    avatar={<WarningOutlined style={{ color: '#fa541c', fontSize: 18 }} />}
                    title={
                      <Space size="small">
                        <Text strong>{allergy.allergen}</Text>
                        <Tag color={allergy.severity === 'Severe' ? 'red' : allergy.severity === 'Moderate' ? 'orange' : 'gold'}>
                          {allergy.severity}
                        </Tag>
                      </Space>
                    }
                    description={`Reaction: ${allergy.reaction}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Immunizations" extra={<Tag color="green">Up to date</Tag>}>
            <List
              dataSource={patientImmunizations}
              locale={{ emptyText: 'No immunization records' }}
              renderItem={(imm, index) => (
                <List.Item key={`${imm.vaccineName}-${index}`}>
                  <List.Item.Meta
                    avatar={<ExperimentOutlined style={{ color: '#52c41a', fontSize: 20 }} />}
                    title={`${imm.vaccineName} • Dose ${imm.doseNumber ?? '—'}`}
                    description={`Date: ${imm.date} • Administered by ${imm.administeredBy}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Encounter Timeline" style={{ marginBottom: 24 }}>
        {patientNotes.length === 0 ? (
          <Text type="secondary">No clinical notes available.</Text>
        ) : (
          <Timeline mode="left">
            {patientNotes.map(noteTimelineItem)}
          </Timeline>
        )}
      </Card>

      <Card title="Laboratory Results" style={{ marginBottom: 24 }}>
        {patientLabs.length === 0 ? (
          <Text type="secondary">No lab orders found for this patient.</Text>
        ) : (
          <LabResultList results={patientLabs} />
        )}
      </Card>

      <Card title="Appointments">
        <Collapse accordion>
          {patientAppointments.map(apt => (
            <Panel
              key={apt.id}
              header={
                <Space size="large">
                  <Text strong>{apt.date}</Text>
                  <Tag color="blue">{apt.type}</Tag>
                  <Text type="secondary">{apt.time} • {apt.providerName}</Text>
                  <Tag color={apt.status === 'Completed' ? 'green' : apt.status === 'Cancelled' ? 'red' : 'blue'}>{apt.status}</Tag>
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Reason">{apt.reason}</Descriptions.Item>
                <Descriptions.Item label="Duration">{apt.duration} minutes</Descriptions.Item>
                {apt.notes && <Descriptions.Item label="Notes">{apt.notes}</Descriptions.Item>}
              </Descriptions>
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  )
}

export default ClinicalHistory
