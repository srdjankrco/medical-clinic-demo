import { useState } from 'react'
import { Card, Form, Input, Select, Button, Space, Typography, Row, Col, InputNumber, Alert, Tag, Divider, AutoComplete } from 'antd'
import { SaveOutlined, PrinterOutlined, UserOutlined, MedicineBoxOutlined, ExperimentOutlined, WarningOutlined } from '@ant-design/icons'
import { patients, providers } from '../data/mockData'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const ClinicalDocumentation = () => {
  const [form] = Form.useForm()
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(undefined)

  // Mock ICD-10 codes for autocomplete
  const icd10Codes = [
    { value: 'J00 - Acute nasopharyngitis (common cold)' },
    { value: 'I10 - Essential (primary) hypertension' },
    { value: 'E11 - Type 2 diabetes mellitus' },
    { value: 'M79.3 - Myalgia' },
    { value: 'R50.9 - Fever, unspecified' },
    { value: 'J06.9 - Acute upper respiratory infection' },
    { value: 'K21.9 - Gastro-esophageal reflux disease' },
    { value: 'M25.5 - Pain in joint' },
  ]

  const templateOptions = [
    { label: 'General Consultation', value: 'general' },
    { label: 'Follow-up Visit', value: 'followup' },
    { label: 'Annual Physical', value: 'physical' },
    { label: 'Acute Illness', value: 'acute' },
  ]

  const loadTemplate = (templateType: string) => {
    const templates = {
      general: {
        subjective: 'Patient presents with...',
        objective: 'Vital signs stable. Physical examination reveals...',
        assessment: '',
        plan: 'Continue current management. Follow-up in...',
      },
      followup: {
        subjective: 'Patient returns for follow-up. Reports...',
        objective: 'Vital signs: BP, HR, Temp. Examination shows...',
        assessment: 'Condition improving/stable/worsening...',
        plan: 'Continue medications. Next follow-up in...',
      },
    }
    const template = templates[templateType as keyof typeof templates]
    if (template) {
      form.setFieldsValue(template)
    }
  }

  const onFinish = (values: any) => {
    console.log('Clinical note:', values)
  }

  const patient = selectedPatient ? patients.find(p => p.id === selectedPatient) : null

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Clinical Documentation</Title>
        <Space>
          <Select
            placeholder="Load Template"
            style={{ width: 200 }}
            onChange={loadTemplate}
            allowClear
          >
            {templateOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          <Button icon={<PrinterOutlined />}>Print</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
            Save Note
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={18}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                temperature: 37.0,
                oxygenSaturation: 98,
              }}
            >
              {/* Patient and Provider Selection */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Patient"
                    name="patientId"
                    rules={[{ required: true, message: 'Please select a patient' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Search and select patient"
                      optionFilterProp="children"
                      onChange={setSelectedPatient}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={patients.slice(0, 20).map(p => ({
                        value: p.id,
                        label: `${p.firstName} ${p.lastName} (${p.id})`,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Provider"
                    name="providerId"
                    rules={[{ required: true, message: 'Please select provider' }]}
                  >
                    <Select
                      placeholder="Select provider"
                      options={providers.map(p => ({
                        value: p.id,
                        label: `${p.name} - ${p.specialty}`,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Vital Signs</Divider>
              
              <Row gutter={16}>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="Temperature (°C)" name="temperature">
                    <InputNumber step={0.1} min={35} max={42} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="BP Systolic" name="bpSystolic">
                    <InputNumber min={50} max={250} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="BP Diastolic" name="bpDiastolic">
                    <InputNumber min={30} max={150} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="Heart Rate" name="heartRate">
                    <InputNumber min={30} max={200} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="Resp. Rate" name="respiratoryRate">
                    <InputNumber min={8} max={40} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="SpO2 (%)" name="oxygenSaturation">
                    <InputNumber min={70} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="Weight (kg)" name="weight">
                    <InputNumber step={0.1} min={0} max={300} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Form.Item label="Height (cm)" name="height">
                    <InputNumber step={0.1} min={0} max={250} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>SOAP Note</Divider>

              <Form.Item
                label={<Text strong style={{ fontSize: 16 }}>Subjective</Text>}
                name="subjective"
                rules={[{ required: true, message: 'Please enter subjective findings' }]}
                tooltip="Chief complaint, history of present illness, patient's description"
              >
                <TextArea
                  rows={4}
                  placeholder="Chief complaint, history of present illness, patient's description of symptoms..."
                />
              </Form.Item>

              <Form.Item
                label={<Text strong style={{ fontSize: 16 }}>Objective</Text>}
                name="objective"
                rules={[{ required: true, message: 'Please enter objective findings' }]}
                tooltip="Physical examination findings, observations, test results"
              >
                <TextArea
                  rows={4}
                  placeholder="Physical examination findings, observations, measurable data..."
                />
              </Form.Item>

              <Form.Item
                label={<Text strong style={{ fontSize: 16 }}>Assessment</Text>}
                name="assessment"
                rules={[{ required: true, message: 'Please enter assessment' }]}
                tooltip="Diagnosis, ICD-10 codes"
              >
                <AutoComplete
                  options={icd10Codes}
                  placeholder="Type to search ICD-10 codes or enter diagnosis..."
                  filterOption={(inputValue, option) =>
                    option!.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                  }
                >
                  <TextArea rows={3} />
                </AutoComplete>
              </Form.Item>

              <Form.Item
                label={<Text strong style={{ fontSize: 16 }}>Plan</Text>}
                name="plan"
                rules={[{ required: true, message: 'Please enter treatment plan' }]}
                tooltip="Treatment plan, medications, follow-up instructions"
              >
                <TextArea
                  rows={4}
                  placeholder="Treatment plan, medications prescribed, follow-up instructions, patient education..."
                />
              </Form.Item>

              <Form.Item
                label="Additional Notes"
                name="additionalNotes"
              >
                <TextArea rows={2} placeholder="Any additional observations or instructions..." />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          {/* Patient Context Sidebar */}
          {patient ? (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card title="Patient Context" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <UserOutlined /> <Text strong>{patient.firstName} {patient.lastName}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</Text>
                  </div>
                  <div>
                    <Text type="secondary">Blood Type: {patient.bloodType}</Text>
                  </div>
                  <div>
                    <Text type="secondary">ID: {patient.id}</Text>
                  </div>
                </Space>
              </Card>

              <Card title={<><WarningOutlined /> Allergies</>} size="small" type="inner" style={{ borderColor: '#ff7875' }}>
                <Space direction="vertical" size="small">
                  <Tag color="orange">Penicillin - Severe</Tag>
                  <Tag color="orange">Peanuts - Moderate</Tag>
                </Space>
              </Card>

              <Card title={<><MedicineBoxOutlined /> Current Medications</>} size="small">
                <Space direction="vertical" size="small" style={{ fontSize: 12 }}>
                  <div>• Metformin 500mg - Twice daily</div>
                  <div>• Lisinopril 10mg - Once daily</div>
                  <div>• Aspirin 75mg - Once daily</div>
                </Space>
              </Card>

              <Card title={<><ExperimentOutlined /> Active Problems</>} size="small">
                <Space direction="vertical" size="small" style={{ fontSize: 12 }}>
                  <div>• Type 2 Diabetes</div>
                  <div>• Hypertension</div>
                  <div>• Chronic back pain</div>
                </Space>
              </Card>

              <Alert
                message="Clinical Decision Support"
                description="Patient is due for HbA1c test. Last test: 3 months ago."
                type="info"
                showIcon
                closable
              />
            </Space>
          ) : (
            <Card size="small">
              <Text type="secondary">Select a patient to view context information</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ClinicalDocumentation
