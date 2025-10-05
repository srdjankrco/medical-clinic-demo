import { useState } from 'react'
import { Form, Input, Select, DatePicker, Button, Card, Steps, Row, Col, message, Typography } from 'antd'
import { UserOutlined, PhoneOutlined, HomeOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography
const { Option } = Select

const PatientRegister = () => {
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const steps = [
    {
      title: 'Demographics',
      icon: <UserOutlined />,
    },
    {
      title: 'Contact',
      icon: <HomeOutlined />,
    },
    {
      title: 'Emergency',
      icon: <PhoneOutlined />,
    },
    {
      title: 'Insurance',
      icon: <SafetyOutlined />,
    },
  ]

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1)
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo)
    })
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const onFinish = (values: any) => {
    console.log('Registration data:', values)
    message.success('Patient registered successfully!')
    setTimeout(() => {
      navigate('/patients/list')
    }, 1500)
  }

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Select placeholder="Select gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Blood Type"
                  name="bloodType"
                >
                  <Select placeholder="Select blood type">
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="National ID"
                  name="nationalId"
                  rules={[{ required: true, message: 'Please enter national ID' }]}
                  tooltip="Aadhaar for India, QID for Qatar"
                >
                  <Input placeholder="Enter Aadhaar/QID number" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      case 1:
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Street Address"
              name={['address', 'street']}
              rules={[{ required: true, message: 'Please enter street address' }]}
            >
              <Input placeholder="Enter street address" />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="City"
                  name={['address', 'city']}
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="State"
                  name={['address', 'state']}
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="Enter state/province" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Postal Code"
                  name={['address', 'postalCode']}
                  rules={[{ required: true, message: 'Please enter postal code' }]}
                >
                  <Input placeholder="Enter postal code" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Country"
                  name={['address', 'country']}
                  rules={[{ required: true, message: 'Please select country' }]}
                >
                  <Select placeholder="Select country">
                    <Option value="India">India</Option>
                    <Option value="Qatar">Qatar</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      case 2:
        return (
          <>
            <Form.Item
              label="Emergency Contact Name"
              name={['emergencyContact', 'name']}
              rules={[{ required: true, message: 'Please enter emergency contact name' }]}
            >
              <Input placeholder="Enter contact name" />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Relationship"
                  name={['emergencyContact', 'relationship']}
                  rules={[{ required: true, message: 'Please select relationship' }]}
                >
                  <Select placeholder="Select relationship">
                    <Option value="Spouse">Spouse</Option>
                    <Option value="Parent">Parent</Option>
                    <Option value="Sibling">Sibling</Option>
                    <Option value="Child">Child</Option>
                    <Option value="Friend">Friend</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name={['emergencyContact', 'phone']}
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      case 3:
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Insurance Provider"
                  name={['insurance', 'provider']}
                  rules={[{ required: true, message: 'Please enter insurance provider' }]}
                >
                  <Input placeholder="Enter insurance provider name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Policy Number"
                  name={['insurance', 'policyNumber']}
                  rules={[{ required: true, message: 'Please enter policy number' }]}
                >
                  <Input placeholder="Enter policy number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Group Number"
                  name={['insurance', 'groupNumber']}
                >
                  <Input placeholder="Enter group number (optional)" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Expiry Date"
                  name={['insurance', 'expiryDate']}
                  rules={[{ required: true, message: 'Please select expiry date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <Title level={2}>Patient Registration</Title>
      <Card>
        <Steps current={current} items={steps} style={{ marginBottom: 32 }} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: undefined,
            bloodType: undefined,
          }}
        >
          {renderStepContent()}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            {current > 0 && (
              <Button onClick={prev}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next} style={{ marginLeft: 'auto' }}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                Register Patient
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default PatientRegister
