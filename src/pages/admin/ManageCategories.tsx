import {
    Button,
    Dropdown,
    Empty,
    Modal,
    Form,
    Input,
    Switch,
} from 'antd';
import { MoreOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// Ensure this path is correct for your project structure
import { addCategory, deleteCategory, getAllCategories, toggleCategoryStatus, updateCategory } from '../../utils/threadcategories';
import { toast } from 'react-toastify';
import catImg from '/public/icons/admin/5.jpeg';

interface CategoryType {
    key: string; // This is the actual ID from the backend
    id: string;  // This is the mapped index from original code, preserved
    category_name: string;
    category_slug: string;
    is_active: boolean;
}

const ManageCategories = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false); // Main loading for categories list
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [form] = Form.useForm();
    const [actionLoading, setActionLoading] = useState(false); // Loading for modal submit or individual actions

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getAllCategories();
            if (response.success) {
                const formattedData = response.data.map((category: any, index: number) => ({
                    key: category.id, // Actual backend ID
                    id: String(index), // Mapped index
                    category_name: category.category_name,
                    category_slug: category.category_slug,
                    is_active: category.is_active,
                }));
                setCategories(formattedData);
            } else {
                toast.error(response.message || "Failed to fetch categories.");
            }
        } catch (e: any) {
            console.error("Fetch categories error:", e);
            toast.error(e.message || "An error occurred while fetching categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddOrEditCategory = async () => {
        try {
            const values = await form.validateFields();
            setActionLoading(true);
            const data = {
                category_name: values.category_name,
                category_slug: values.category_name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), // Generate a clean slug
            };

            let response;
            if (isEditMode && editingCategory) {
                response = await updateCategory(editingCategory.key, data);
            } else {
                response = await addCategory(data);
            }

            if (response.success) {
                toast.success(response.data?.message || (isEditMode ? "Category updated successfully!" : "Category added successfully!"));
                fetchCategories();
                setIsModalVisible(false);
                form.resetFields();
                setIsEditMode(false);
                setEditingCategory(null);
            } else {
                toast.error(response.message || "Operation failed.");
            }
        } catch (error: any) {
            if (error.errorFields) {
                console.log("Form validation error:", error.errorFields);
                // AntD form validation errors are usually handled by the form items themselves
            } else {
                toast.error(error.response?.data?.message || error.response?.data?.error || error.message || "An error occurred.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setIsEditMode(false);
        setEditingCategory(null);
    };

    const handleCategoryStatus = async (record: CategoryType) => {
        try {
            // Optimistically update UI
            setCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.key === record.key ? { ...cat, is_active: !cat.is_active } : cat
                )
            );
            const response = await toggleCategoryStatus(record.key, !record.is_active);
            if (response.success) {
                toast.success(response.data?.message || "Status updated successfully!");
                // Optionally, refetch to ensure full sync, though optimistic update handles UI
                // fetchCategories(); 
            } else {
                toast.error(response.message || "Failed to update status.");
                // Revert optimistic update if API call fails
                setCategories(prevCategories =>
                    prevCategories.map(cat =>
                        cat.key === record.key ? { ...cat, is_active: record.is_active } : cat
                    )
                );
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.response?.data?.error || "Error updating status.");
            // Revert optimistic update on error
            setCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.key === record.key ? { ...cat, is_active: record.is_active } : cat
                )
            );
        }
    };

    const handleEdit = (record: CategoryType) => {
        setIsEditMode(true);
        setEditingCategory(record);
        form.setFieldsValue({ category_name: record.category_name });
        setIsModalVisible(true);
    };

    const handleDelete = (record: CategoryType) => {
        Modal.confirm({
            title: <span style={{ color: '#00FFFF', fontFamily: 'monospace', fontSize: '18px' }}>⚠ DELETE CATEGORY</span>,
            content: (
                <div style={{ color: '#E0E0E0', fontFamily: 'monospace', padding: '10px 0' }}>
                    <div style={{ color: '#FF4444', marginBottom: '8px' }}>TARGET: {record.category_name}</div>
                    <div>This action cannot be undone.</div>
                </div>
            ),
            okText: 'EXECUTE DELETE',
            okType: 'danger',
            cancelText: 'ABORT',
            centered: true,
            styles: {
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                content: {
                    backgroundColor: '#0A0E1A',
                    border: '2px solid #FF4444',
                    borderRadius: '0',
                    boxShadow: '0 0 30px rgba(255, 68, 68, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)'
                },
                header: {
                    backgroundColor: '#0A0E1A',
                    borderBottom: '2px solid #FF4444',
                    borderRadius: '0'
                },
                body: {
                    backgroundColor: '#0A0E1A',
                    fontFamily: 'monospace'
                },
                footer: {
                    backgroundColor: '#0A0E1A',
                    borderTop: '2px solid #FF4444',
                    borderRadius: '0'
                }
            },
            okButtonProps: {
                style: {
                    backgroundColor: '#FF4444',
                    borderColor: '#FF4444',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    borderRadius: '0',
                    boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
                }
            },
            cancelButtonProps: {
                style: {
                    color: '#00FFFF',
                    borderColor: '#00FFFF',
                    backgroundColor: 'transparent',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    borderRadius: '0'
                }
            },
            onOk: async () => {
                try {
                    setActionLoading(true);
                    const response = await deleteCategory(record.key);
                    if (response.success) {
                        toast.success(response.data?.message || "Category deleted successfully!");
                        fetchCategories();
                    } else {
                        toast.error(response.message || "Failed to delete category.");
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || error.response?.data?.error || "Error deleting category.");
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    return (
        <div className="relative w-full min-h-[calc(100vh-125px)] p-4 md:p-6 bg-[#050810] overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridMove 20s linear infinite'
                }} />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full h-full">
                {/* Header Section */}
                <div className="relative mb-8">
                    <div className="flex justify-between items-center">
                        {/* Title Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 relative">
                                    {/* Hexagonal border */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }}
                                    />
                                    <div
                                        className="absolute inset-[3px] bg-[#0A0E1A] flex items-center justify-center overflow-hidden"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                                        }}
                                    >
                                        <img
                                            src={catImg}
                                            alt="Categories"
                                            className="w-full h-full object-cover"
                                            style={{
                                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold font-mowaq text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider">
                                    CATEGORY
                                </h1>
                                <div className="text-cyan-300 text-sm font-mono mt-1 opacity-80">
                                    SYSTEM_STATUS: ONLINE | ENTITIES: {categories.length}
                                </div>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => {
                                setIsModalVisible(true);
                                setIsEditMode(false);
                                setEditingCategory(null);
                                form.resetFields();
                            }}
                            className="relative group px-8 py-4 font-mono font-bold tracking-wider text-black transition-all duration-300 overflow-hidden"
                            style={{
                                background: 'linear-gradient(45deg, #00FFFF, #00CCFF)',
                                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)',
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div className="flex items-center gap-3 font-mowaq">
                                <PlusOutlined style={{ fontSize: '18px' }} />
                                <span>NEW.ENTITY</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading && (
                    <div className="flex flex-col justify-center items-center h-[60vh]">
                        <div className="relative">
                            <LoadingOutlined
                                style={{ fontSize: 48, color: '#00FFFF' }}
                                spin
                            />
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                        </div>
                        <div className="text-cyan-300 font-mono mt-4 text-lg">LOADING.ENTITIES...</div>
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-[60vh]">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🚫</div>
                            <div className="text-cyan-300 font-mono text-xl mb-2">NO.ENTITIES.DETECTED</div>
                            <div className="text-gray-500 font-mono">Initialize your first category entity</div>
                        </div>
                    </div>
                )}

                {!loading && categories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={category.key}
                                className="relative group cursor-pointer transition-all duration-500"
                                style={{
                                    animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                }}
                            >
                                {/* Main Card */}
                                <div
                                    className="relative h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 transition-all duration-500 group-hover:border-cyan-400 group-hover:shadow-cyan-400/25"
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.05)'
                                    }}
                                >
                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                                        <div
                                            className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}
                                            style={{
                                                boxShadow: `0 0 10px ${category.is_active ? '#4ADE80' : '#F87171'}`
                                            }}
                                        />
                                        <span className={`text-xs font-mono ${category.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                            {category.is_active ? 'ACTIVE' : 'OFFLINE'}
                                        </span>
                                    </div>

                                    {/* More Options */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    {
                                                        key: 'edit',
                                                        label: 'Edit',
                                                        onClick: () => handleEdit(category)
                                                    },
                                                    {
                                                        key: 'delete',
                                                        label: 'Delete',
                                                        onClick: () => handleDelete(category)
                                                    },
                                                ],
                                                style: {
                                                    backgroundColor: '#0A0E1A',
                                                    border: '1px solid #00FFFF',
                                                    borderRadius: '0',
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
                                                }
                                            }}
                                            placement="bottomLeft"
                                            trigger={['click']}
                                        >
                                            <button className="w-8 h-8 bg-black/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 transition-all duration-300">
                                                <MoreOutlined style={{ fontSize: '14px' }} />
                                            </button>
                                        </Dropdown>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold font-mowaq text-white font-mono mb-2 group-hover:text-cyan-300 transition-colors duration-300 truncate">
                                                {category.category_name.toUpperCase()}
                                            </h3>
                                            <div className="text-cyan-400/70 text-xs font-mono">
                                                SLUG: {category.category_slug}
                                            </div>
                                        </div>

                                        {/* Bottom Section */}
                                        <div className="flex items-center justify-between z-20">
                                            <div className="text-xs font-mono text-gray-400">
                                                ID: {category.key.slice(0, 8)}...
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-300">Status</span>
                                                <Switch
                                                    checked={category.is_active}
                                                    onChange={() => handleCategoryStatus(category)}
                                                    style={{
                                                        backgroundColor: category.is_active ? '#00FFFF' : '#374151'
                                                    }}
                                                    size="small"
                                                    checkedChildren="ON"
                                                    unCheckedChildren="OFF"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Effect Overlay - FIXED: Added pointer-events-none */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                                        }}
                                    />
                                </div>

                                {/* Scan Line Effect - FIXED: Added pointer-events-none */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
                                        animation: 'scan 2s linear infinite',
                                        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <Modal
                    title={
                        <div className="text-cyan-400 font-mono text-lg tracking-wider">
                            {isEditMode ? '⚙ MODIFY.ENTITY' : '✨ CREATE.ENTITY'}
                        </div>
                    }
                    open={isModalVisible}
                    onOk={handleAddOrEditCategory}
                    onCancel={handleCancel}
                    confirmLoading={actionLoading}
                    okText={isEditMode ? 'UPDATE.ENTITY' : 'CREATE.ENTITY'}
                    cancelText="ABORT"
                    centered
                    okButtonProps={{
                        style: {
                            background: 'linear-gradient(45deg, #00FFFF, #00CCFF)',
                            borderColor: '#00FFFF',
                            color: 'black',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            borderRadius: '0',
                            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                        }
                    }}
                    cancelButtonProps={{
                        style: {
                            color: '#FF4444',
                            borderColor: '#FF4444',
                            backgroundColor: 'transparent',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            borderRadius: '0'
                        }
                    }}
                    styles={{
                        mask: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
                        content: {
                            backgroundColor: '#0A0E1A',
                            border: '2px solid #00FFFF',
                            borderRadius: '0',
                            boxShadow: '0 0 50px rgba(0, 255, 255, 0.3)'
                        },
                        header: {
                            backgroundColor: '#0A0E1A',
                            borderBottom: '2px solid #00FFFF',
                            borderRadius: '0'
                        },
                        body: {
                            backgroundColor: '#0A0E1A',
                            fontFamily: 'monospace'
                        },
                        footer: {
                            backgroundColor: '#0A0E1A',
                            borderTop: '2px solid #00FFFF',
                            borderRadius: '0'
                        }
                    }}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="category_name"
                            label={
                                <span className="text-cyan-300 font-mowaq tracking-wider">
                                    ENTITY.NAME
                                </span>
                            }
                            rules={[{ required: true, message: 'Entity name is required' }]}
                        >
                            <Input
                                placeholder="Enter entity designation..."
                                className="font-mono"
                                style={{
                                    backgroundColor: '#1A1E2E',
                                    color: '#00FFFF',
                                    borderColor: '#00FFFF',
                                    borderRadius: '0',
                                    padding: '12px 16px',
                                    fontSize: '14px',
                                    boxShadow: 'inset 0 0 10px rgba(0, 255, 255, 0.1)'
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            <style>
                {`
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px) scale(0.9); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                `}
            </style>
        </div>
    );
};

export default ManageCategories;