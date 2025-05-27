import {
    Table,
    Button,
    Dropdown,
    Empty,
    Modal,
    Form,
    Input,
    Switch,
} from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { addCategory, deleteCategory, getAllCategories, toggleCategoryStatus, updateCategory } from '../../utils/threadcategories';
import { toast } from 'react-toastify';

interface CategoryType {
    key: string;
    id: string;
    category_name: string;
    category_slug: string;
    is_active: boolean;
}

const ManageCategories = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getAllCategories();
            if (response.success) {
                const formattedData = response.data.map((category: CategoryType, index: any) => {
                    return {
                        key: category.id,
                        id: index,
                        category_name: category.category_name,
                        category_slug: category.category_slug,
                        is_active: category.is_active,
                    }
                })

                setCategories(formattedData);
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrEditCategory = async () => {
        try {
            form.validateFields().then(async values => {
                setLoading(true);
                const data = {
                    category_name: values.category_name,
                    category_slug: values.category_name,
                }

                let response = null;
                if (isEditMode) {
                    response = await updateCategory(editingCategory ? editingCategory.key : '', data);
                } else {
                    response = await addCategory(data);
                }
                if (response.success) {
                    toast.success(response.data.message)
                    fetchCategories()
                } else {
                    toast.error(response.message)
                    setIsModalVisible(false)
                    setLoading(false);
                }
            });
        } catch (error) {
            // @ts-ignore
            toast.error(error.response?.data.message || error.response?.data.error)
        } finally {
            setLoading(false);
            setIsModalVisible(false)
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setIsEditMode(false);
        setEditingCategory(null);
    }

    const handleCategoryStatus = async (record: CategoryType) => {
        try {
            setLoading(true)
            const response = await toggleCategoryStatus(record.key, !record.is_active);
            if (response.success) {
                toast.success(response.data.message)
                fetchCategories()
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            // @ts-ignore
            toast.error(error.response?.data.message || error.response?.data.error)
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record: CategoryType) => {
        setIsEditMode(true);
        setEditingCategory(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: any) => {
        try {
            setLoading(true)
            const response = await deleteCategory(record?.key);
            if (response.success) {
                toast.success(response.data.message)
                fetchCategories()
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            // @ts-ignore
            toast.error(error.response?.data.message || error.response?.data.error)
        } finally {
            setLoading(false);
        }
    }

    const columns: ColumnsType<CategoryType> = [
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text) => <span className="text-white text-xs sm:text-sm">{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'status',
            align: 'center',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleCategoryStatus(record)}
                    className={isActive ? 'bg-[#34A853]' : 'bg-gray-500'}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'edit',
                                label: (
                                    <Button
                                        type="text"
                                        className="text-[#4285F4] hover:text-blue-100"
                                        onClick={() => handleEdit(record)}
                                    >
                                        Edit
                                    </Button>
                                ),
                            },
                            {
                                key: 'delete',
                                label: (
                                    <Button
                                        type="text"
                                        className="text-red-400 hover:text-red-200"
                                        onClick={() => handleDelete(record)}
                                    >
                                        Delete
                                    </Button>
                                ),
                            },
                        ],
                    }}
                    placement="bottomRight"
                    overlayClassName="custom-dropdown-menu"
                >

                    <Button
                        shape="circle"
                        icon={<MoreOutlined className="text-2xl" />}
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                    />
                </Dropdown>
            ),
        },
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="w-full rounded-2xl bg-[#1b1b1b] min-h-[calc(100vh-125px)] md:p-6 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-mowaq lg:text-3xl md:text-3xl text-xl text-white font-semibold">
                    Categories Management
                </h2>

                <button
                    onClick={() => {
                        setIsModalVisible(true);
                        setIsEditMode(false);
                        form.resetFields();
                    }}
                    className="flex items-center gap-3 px-4 py-2 bg-[#A0FF06] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
                >
                    <PlusOutlined className='text-xl' />
                    Add Category
                </button>
            </div>

            <div className="custom-dark-table-container">
                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="text-gray-400">
                                        No categories available
                                    </span>
                                }
                            />
                        ),
                    }}
                    className="custom-dark-table"
                />
            </div>

            <Modal
                title={isEditMode ? 'Edit Category' : 'Add New Category'}
                open={isModalVisible}
                onOk={handleAddOrEditCategory}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText={isEditMode ? 'Update Category' : 'Add Category'}
                okButtonProps={{
                    className: 'bg-[#C6FF00] hover:bg-[#AEEA00] !text-black font-semibold',
                }}
                className="custom-dark-modal"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="category_name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                        <Input
                            placeholder="Enter category name"
                            className="bg-[#1e1e1e] border-gray-700 text-white hover:border-gray-600 focus:border-gray-500"
                        />
                    </Form.Item>
                    {/* <Form.Item
                        name="is_active"
                        label="Active Status"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch className="bg-gray-500" />
                    </Form.Item> */}
                </Form>
            </Modal>
        </div>
    );
};

export default ManageCategories;
