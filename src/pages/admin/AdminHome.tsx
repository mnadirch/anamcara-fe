import { Card, Statistic, Row, Col, Table, Tag, Space, Button, List, Avatar } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RecentActivity {
  id: string;
  type: 'blog' | 'thread' | 'user';
  action: string;
  title: string;
  timestamp: string;
  user: string;
}

interface LatestRecord {
  key: string;
  id: string;
  title: string;
  type: 'blog' | 'thread' | 'user';
  status: 'active' | 'pending' | 'deleted';
  created_at: string;
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    threads: 0,
    blogs: 0,
    loading: true
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [latestRecords, setLatestRecords] = useState<LatestRecord[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setStats({
        totalUsers: 124,
        activeUsers: 98,
        threads: 356,
        blogs: 72,
        loading: false
      });
    };

    const fetchActivities = async () => {
      setRecentActivities([
        {
          id: '1',
          type: 'blog',
          action: 'created',
          title: 'AI Trends in 2025',
          timestamp: '2023-05-15T10:30:00Z',
          user: 'Muzammal Awann'
        },
        {
          id: '2',
          type: 'thread',
          action: 'replied to',
          title: '#456 - Feature Request',
          timestamp: '2023-05-14T15:45:00Z',
          user: 'Admin'
        },
        {
          id: '3',
          type: 'user',
          action: 'updated permissions for',
          title: 'Sarah Johnson',
          timestamp: '2023-05-14T09:20:00Z',
          user: 'Admin'
        },
        {
          id: '4',
          type: 'blog',
          action: 'published',
          title: 'Getting Started with React 18',
          timestamp: '2023-05-13T14:10:00Z',
          user: 'Alex Chen'
        }
      ]);
    };

    const fetchLatestRecords = async () => {
      setLatestRecords([
        {
          key: '1',
          id: 'blog-45',
          title: 'AI Trends in 2025',
          type: 'blog',
          status: 'active',
          created_at: '2023-05-15T10:30:00Z'
        },
        {
          key: '2',
          id: 'thread-456',
          title: 'Feature Request: Dark Mode',
          type: 'thread',
          status: 'pending',
          created_at: '2023-05-14T15:45:00Z'
        },
        {
          key: '3',
          id: 'user-89',
          title: 'Sarah Johnson',
          type: 'user',
          status: 'active',
          created_at: '2023-05-14T09:20:00Z'
        },
        {
          key: '4',
          id: 'blog-44',
          title: 'Getting Started with React 18',
          type: 'blog',
          status: 'active',
          created_at: '2023-05-13T14:10:00Z'
        }
      ]);
    };

    fetchStats();
    fetchActivities();
    fetchLatestRecords();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: LatestRecord) => (
        <span className="text-white hover:text-[#A0FF06] cursor-pointer" onClick={() => handleViewRecord(record)}>
          {text}
        </span>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'blog' ? 'blue' : type === 'thread' ? 'purple' : 'cyan'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: LatestRecord) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewRecord(record)}
            className="text-[#A0FF06]"
          />
        </Space>
      )
    }
  ];

  const handleViewRecord = (record: LatestRecord) => {
    switch (record.type) {
      case 'blog':
        navigate(`/admin/blogs/${record.id}`);
        break;
      case 'thread':
        navigate(`/admin/threads/${record.id}`);
        break;
      case 'user':
        navigate(`/admin/users/${record.id}`);
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="w-full min-h-[calc(100vh-125px)] p-6 bg-[#1b1b1b] text-white">
      <h1 className="text-3xl font-bold mb-6 font-mowaq">Admin Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: <UserOutlined />, color: '#fff' },
          { title: 'Active Users', value: stats.activeUsers, icon: <CheckCircleOutlined />, color: '#52c41a' },
          { title: 'Threads', value: stats.threads, icon: <MessageOutlined />, color: '#fff' },
          { title: 'Published Blogs', value: stats.blogs, icon: <FileTextOutlined />, color: '#fff' }
        ].map((stat, idx) => (
          <Col xs={24} sm={12} md={6} key={idx}>
            <Card className="bg-[#2a2a2a] border-0 hover:border hover:border-[#A0FF06]/50 transition-all">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
                loading={stats.loading}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity and Latest Records */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                <span>Recent Activity</span>
              </div>
            }
            className="bg-[#2a2a2a] border-0"
            bordered={false}
            extra={<Button type="text" icon={<ArrowRightOutlined />} onClick={() => navigate('/admin/activity')} />}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item className="text-white hover:bg-[#333] transition-all">
                  <List.Item.Meta
                    avatar={<Avatar icon={item.type === 'blog' ? <FileTextOutlined /> : item.type === 'thread' ? <MessageOutlined /> : <UserOutlined />} />}
                    title={
                      <span>
                        <span className="font-semibold">{item.user}</span> {item.action}{' '}
                        <span className="text-[#A0FF06]">{item.title}</span>
                      </span>
                    }
                    description={<span className="text-gray-400">{formatTimeAgo(item.timestamp)}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <BarChartOutlined className="mr-2" />
                <span>Latest Records</span>
              </div>
            }
            className="bg-[#2a2a2a] border-0"
            bordered={false}
          >
            <Table
              columns={columns}
              dataSource={latestRecords}
              pagination={false}
              rowClassName={() => 'text-white'}
              className="custom-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
