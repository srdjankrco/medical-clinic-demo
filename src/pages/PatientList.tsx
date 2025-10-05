import { useState } from 'react'
import { Table, Card, Input, Button, Space, Tag, Avatar, Typography, Row, Col, Select } from 'antd'
import { SearchOutlined, UserAddOutlined, EyeOutlined, EditOutlined, CalendarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { patients } from '../data/mockData'
import type { Patient } from '../types'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

const PatientList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined)
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.phone.includes(searchText) ||
      patient.email.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesGender = !selectedGender || patient.gender === selectedGender
    const matchesCountry = !selectedCountry || patient.address.country === selectedCountry
    const matchesStatus = !selectedStatus || patient.status === selectedStatus

    return matchesSearch && matchesGender && matchesCountry && matchesStatus
  })

  const columns = [
    {
      title: 'Patient ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 250,
      render: (_: any, record: Patient) => (
        <Space>
          <Avatar src={record.photoUrl} icon={<UserAddOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.gender} • {calculateAge(record.dateOfBirth)} years
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_: any, record: Patient) => (
        <div>
          <div>{record.phone}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      width: 150,
      render: (_: any, record: Patient) => (
        <div>
          <div>{record.address.city}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.address.country}</div>
        </div>
      ),
    },
    {
      title: 'Blood Type',
      dataIndex: 'bloodType',
      key: 'bloodType',
      width: 100,
      render: (bloodType: string) => bloodType || 'N/A',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      width: 120,
      render: (date: string) => date || 'No visits',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Patient['status']) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Patient) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/patients/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CalendarOutlined />}
          >
            Book
          </Button>
        </Space>
      ),
    },
  ]

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

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Patient List</Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => navigate('/patients/register')}
        >
          New Patient
        </Button>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Search
                placeholder="Search by name, ID, phone, or email"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={setSearchText}
              />
            </Col>
            <Col xs={24} md={6} lg={4}>
              <Select
                placeholder="Gender"
                allowClear
                style={{ width: '100%' }}
                size="large"
                onChange={setSelectedGender}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Col>
            <Col xs={24} md={6} lg={4}>
              <Select
                placeholder="Country"
                allowClear
                style={{ width: '100%' }}
                size="large"
                onChange={setSelectedCountry}
              >
                <Option value="India">India</Option>
                <Option value="Qatar">Qatar</Option>
              </Select>
            </Col>
            <Col xs={24} md={6} lg={4}>
              <Select
                placeholder="Status"
                allowClear
                style={{ width: '100%' }}
                size="large"
                onChange={setSelectedStatus}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Col>
            <Col xs={24} md={6} lg={4}>
              <Button size="large" block>
                Export CSV
              </Button>
            </Col>
          </Row>
        </Space>

        <div style={{ marginBottom: 16, color: '#666' }}>
          Showing {filteredPatients.length} of {patients.length} patients
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} patients`,
          }}
        />
      </Card>
    </div>
  )
}

export default PatientList
