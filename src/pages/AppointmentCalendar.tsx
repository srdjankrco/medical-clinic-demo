import { useState } from 'react'
import { Calendar, Badge, Card, Modal, Form, Input, Select, DatePicker, TimePicker, Button, Space, Tag, Typography, Row, Col, List } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { appointments, patients, providers } from '../data/mockData'
import type { Appointment } from '../types'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const getAppointmentsForDate = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')
    return appointments.filter(apt => apt.date === dateStr)
  }

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(value)
    return (
      <div style={{ minHeight: 80 }}>
        {dayAppointments.slice(0, 3).map(apt => (
          <div key={apt.id} style={{ marginBottom: 4 }}>
            <Badge
              status={
                apt.status === 'Scheduled' ? 'processing' :
                apt.status === 'Completed' ? 'success' :
                apt.status === 'Cancelled' ? 'error' : 'default'
              }
              text={
                <Text style={{ fontSize: 11 }}>
                  {apt.time} {apt.patientName.split(' ')[0]}
                </Text>
              }
            />
          </div>
        ))}
        {dayAppointments.length > 3 && (
          <Text type="secondary" style={{ fontSize: 11 }}>
            +{dayAppointments.length - 3} more
          </Text>
        )}
      </div>
    )
  }

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date)
  }

  const showModal = () => {
    form.resetFields()
    form.setFieldsValue({
      date: selectedDate,
      time: dayjs('09:00', 'HH:mm'),
      duration: 30,
      type: 'Consultation',
    })
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('New appointment:', values)
      setIsModalVisible(false)
      // In real app, would add to appointments
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const selectedDateAppointments = getAppointmentsForDate(selectedDate)

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      'Scheduled': 'blue',
      'Checked-in': 'green',
      'In Progress': 'orange',
      'Completed': 'default',
      'Cancelled': 'red',
      'No-show': 'red',
    }
    return colors[status]
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Appointment Calendar</Title>
        <Space>
          <Button>Day View</Button>
          <Button>Week View</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            New Appointment
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card>
            <Calendar
              value={selectedDate}
              onSelect={onSelect}
              cellRender={dateCellRender}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarOutlined />
                <span>{selectedDate.format('MMMM D, YYYY')}</span>
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  {selectedDateAppointments.length} appointments
                </Tag>
              </div>
            }
          >
            {selectedDateAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>No appointments scheduled</div>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginTop: 16 }}>
                  Book Appointment
                </Button>
              </div>
            ) : (
              <List
                dataSource={selectedDateAppointments.sort((a, b) => a.time.localeCompare(b.time))}
                renderItem={(apt) => (
                  <List.Item key={apt.id}>
                    <Card 
                      size="small" 
                      style={{ width: '100%' }}
                      hoverable
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space>
                            <ClockCircleOutlined />
                            <Text strong>{apt.time}</Text>
                          </Space>
                          <Tag color={getStatusColor(apt.status)}>{apt.status}</Tag>
                        </div>
                        <div>
                          <UserOutlined /> <Text>{apt.patientName}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Provider: {apt.providerName}</Text>
                        </div>
                        <div>
                          <Tag>{apt.type}</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>{apt.duration} min</Text>
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>{apt.reason}</Text>
                        </div>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* New Appointment Modal */}
      <Modal
        title="Book New Appointment"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        okText="Book Appointment"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Patient"
            name="patientId"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <Select
              showSearch
              placeholder="Search and select patient"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={patients.slice(0, 20).map(p => ({
                value: p.id,
                label: `${p.firstName} ${p.lastName} (${p.id})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Provider"
            name="providerId"
            rules={[{ required: true, message: 'Please select a provider' }]}
          >
            <Select
              placeholder="Select provider"
              options={providers.map(p => ({
                value: p.id,
                label: `${p.name} - ${p.specialty}`,
              }))}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Appointment Type"
                name="type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select>
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Procedure">Procedure</Option>
                  <Option value="Telehealth">Telehealth</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Duration (minutes)"
                name="duration"
                rules={[{ required: true, message: 'Please select duration' }]}
              >
                <Select>
                  <Option value={15}>15 minutes</Option>
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>60 minutes</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Reason for Visit"
            name="reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input placeholder="E.g., Annual checkup, Follow-up visit" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea rows={3} placeholder="Additional notes (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AppointmentCalendar
