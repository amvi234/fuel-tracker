import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit2, Trash2, Plus, Search, X, AlertCircle, CheckCircle } from 'lucide-react';
import { localStorageManager } from '../../../lib/utils';
import type { Product, FormData, Notification, CategoryOption } from './types';
import { useCreateProduct, useDeleteProduct, useListProducts, useUpdateProduct } from '../../../shared/api/product/product-api';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../../providers';

const formatCurrency = (value: string | number): string => `$${parseFloat(String(value) || '0').toFixed(2)}`;
const formatNumber = (value: number): string => new Intl.NumberFormat().format(value || 0);

// Component.
const Product: React.FC = () => {

    // States.
    const [showDemandForecastModal, setShowDemandForecastModal] = useState<boolean>(false);
    const [selectedProductsForForecast, setSelectedProductsForForecast] = useState<string[]>([]);
    const [products, setProducts] = useState<any>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showViewModal, setShowViewModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [notification, setNotification] = useState<Notification | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName] = useState<any>(localStorageManager.getName());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        odometer: '',
        station_name: '',
        fuel_brand: '',
        fuel_grade: '',
        quantity: '',
        total_amount: '',
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const { logout } = useAuth();
    // UseEffects.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // update the useListProducts call to use debouncedSearchTerm:
    const { data: productsResponse, isLoading: loading, isSuccess: successProductData, error: errorProductData } = useListProducts({
        category: selectedCategory,
        search: debouncedSearchTerm
    });

    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    const navigate = useNavigate();

    // useEffects.
    useEffect(() => {
        if (successProductData && productsResponse) {
            console.log(productsResponse);

            setProducts(productsResponse);
        }
    }, [successProductData, errorProductData, productsResponse])

    // Handlers. 
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.odometer || parseFloat(formData.odometer) <= 0) {
            newErrors.odometer = 'Valid odometer reading is required';
        }
        if (!formData.station_name || parseFloat(formData.station_name) <= 0) {
            newErrors.station_name = 'Valid selling price is required';
        }
        if (parseFloat(formData.fuel_brand) <= parseFloat(formData.fuel_brand)) {
            newErrors.fuel_brand = 'Fuel brand must be greater than cost price';
        }
        if (formData.fuel_grade && parseInt(formData.fuel_grade) < 0) {
            newErrors.fuel_grade = 'Fuel grade cannot be negative';
        }
        if (formData.total_amount && parseInt(formData.total_amount) < 0) {
            newErrors.total_amount = 'total_amount cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            odometer: '',
            station_name: '',
            fuel_brand: '',
            fuel_grade: '',
            quantity: '',
            total_amount: '',
        });
        setErrors({});
    };


    const handleAddProduct = async () => {
        if (!validateForm()) return;

        try {
            let productData: any = {
                name: formData.name,
                odometer: formData.odometer,
                station_name: formData.station_name,
                fuel_brand: formData.fuel_brand,
                fuel_grade: formData.fuel_grade,
                quantity: parseInt(formData.quantity) || 0,
                total_amount: parseInt(formData.total_amount) || 0,
            };

            await createProductMutation.mutateAsync(productData);

            setShowAddModal(false);
            resetForm();
            showNotification('Product added successfully!');
        } catch (error) {
            showNotification('Failed to add product', 'error');
        }
    };

    const handleProductSelection = (productId: string) => {
        setSelectedProductsForForecast(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleLogout = () => {
        navigate('/login');
        logout();
    }

    const handleDemandForecastClick = () => {
        if (selectedProductsForForecast.length < 2) {
            showNotification('Please select at least two product for demand forecast', 'error');
            return;
        }
        setShowDemandForecastModal(true);
    };


    const handleEditProduct = async () => {
        if (!validateForm() || !selectedProduct) return;

        try {
            let productData: any = {
                id: selectedProduct.id,
                name: formData.name,
                odometer: formData.odometer,
                station_name: formData.station_name,
                fuel_brand: formData.fuel_brand,
                description: formData.fuel_grade,
                quantity: parseInt(formData.quantity) || 0,
                total_amount: parseInt(formData.total_amount) || 0,
            };

            await updateProductMutation.mutateAsync(productData);

            setShowEditModal(false);
            resetForm();
            setSelectedProduct(null);
            showNotification('Product updated successfully!');
        } catch (error) {
            showNotification('Failed to update product', 'error');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProductMutation.mutateAsync({ productId: id });
                showNotification('Product deleted successfully!');
            } catch (error) {
                showNotification('Failed to delete product', 'error');
            }
        }
    };

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            odometer: product.odometer,
            station_name: product.station_name,
            fuel_brand: product.fuel_brand,
            fuel_grade: product.fuel_grade || '',
            quantity: product.quantity.toString(),
            total_amount: product.total_amount?.toString() || ''
        });
        setShowEditModal(true);
    };

    const renderFormField = (
        label: string,
        name: keyof FormData,
        type: string = 'text',
        placeholder: string = '',
        required: boolean = false,
        options: CategoryOption[] | null = null
    ) => (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {options ? (
                <select
                    value={formData[name]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                    className={`w-full bg-gray-700 text-white px-3 py-2 rounded-md border focus:outline-none transition-colors ${errors[name] ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-teal-400'
                        }`}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    value={formData[name]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    className={`w-full bg-gray-700 text-white px-3 py-2 rounded-md border focus:outline-none transition-colors resize-none ${errors[name] ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-teal-400'
                        }`}
                />
            ) : (
                <input
                    type={type}
                    value={formData[name]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                    placeholder={placeholder}
                    step={type === 'number' ? '0.01' : undefined}
                    min={type === 'number' ? '0' : undefined}
                    className={`w-full bg-gray-700 text-white px-3 py-2 rounded-md border focus:outline-none transition-colors ${errors[name] ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-teal-400'
                        }`}
                />
            )}
            {errors[name] && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors[name]}
                </p>
            )}
        </div>
    );

    const chartData = products.filter((item: Product) => selectedProductsForForecast.includes(item.id)).map((item: Product) => ({
        name: item.name,
    }));

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                    {notification.type === 'success' ?
                        <CheckCircle className="w-5 h-5" /> :
                        <AlertCircle className="w-5 h-5" />
                    }
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-teal-400">Fuel Tracker Tool</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Welcome, {userName}</span>
                        <div onClick={toggleDropdown} className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
            {showDropdown && (
                <div ref={dropdownRef}
                    className="absolute right-0 top-12 shadow-lg rounded-lg py-2 w-20 border border-gray-200 z-50">
                    <button
                        onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                        }}
                        className="color-red w-full px-2 py-2 hover:bg-red-500 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
            {/* Sub Header */}
            <div className="bg-black px-6 py-3 border-t border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold">Create and Manage Vehicles</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Demand Forecast Toggle */}


                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 " />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black text-white pl-10 pr-4 py-2 rounded-md border border-teal-600 focus:outline-none transition-colors w-64"
                            />
                        </div>


                        {/* Filter Button */}
                        <button className="border border-teal-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                            <span>∀</span>
                            <span>Filter</span>
                        </button>

                        {/* Add New Products Button */}
                        <button
                            onClick={() => {
                                setShowAddModal(true);
                            }}
                            className="bg-teal-400 hover:bg-teal-500 text-black px-4 py-2 rounded-md flex items-center space-x-2 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Vehicles</span>
                        </button>

                        {/* Demand Forecast Button */}
                        <button
                            onClick={handleDemandForecastClick}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors font-medium"
                        >
                            <span className="text-black hover:text-blue-300 transition-colors">📊</span>
                            <span>Statistics</span>
                        </button>

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="text-left p-4 font-medium">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProductsForForecast(products.map((p: { id: any; }) => p.id));
                                                    } else {
                                                        setSelectedProductsForForecast([]);
                                                    }
                                                }}
                                                checked={selectedProductsForForecast.length === products.length && products.length > 0}
                                                className="rounded bg-gray-700 text-white border border-gray-600 checked:bg-teal-400 checked:border-teal-500"
                                            />
                                        </th>
                                        <th className="text-left p-4 font-medium">name</th>
                                        <th className="text-left p-4 font-medium">odometer reading</th>
                                        <th className="text-left p-4 font-medium">station name</th>
                                        <th className="text-left p-4 font-medium">fuel brand</th>
                                        <th className="text-left p-4 font-medium">quantity</th>
                                        <th className="text-left p-4 font-medium">total amount</th>
                                        <th className="text-left p-4 font-medium">fuel grade</th>
                                        <th className="text-left p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products === undefined ? (
                                        <tr>
                                            <td colSpan={9} className="text-center p-8 text-gray-400">
                                                {searchTerm || selectedCategory !== 'all' ?
                                                    'No vehicles match your search criteria.' :
                                                    'No vehicles found. Add your first vehicle to get started.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product: Product, index: number) => (
                                            <tr key={product.id} className={`border-r border-gray-800 bg-white hover:bg-gray-750 transition-colors ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-825'}`}>
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProductsForForecast.includes(product.id)}
                                                        onChange={() => handleProductSelection(product.id)}
                                                        className="rounded bg-gray-700 text-white border border-gray-600 checked:bg-teal-400"
                                                    />
                                                </td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800 font-medium">{product.name}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800 capitalize">{product.odometer}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800">{(product.station_name)}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800">{(product.fuel_brand)}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800">{(product.quantity)}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800">{(product.fuel_grade)}</td>
                                                <td className="p-4 text-gray-800 border-r border-gray-800">{formatCurrency(product.total_amount)}</td>

                                               
                                                <td className="p-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewProduct(product)}
                                                            className="text-black hover:text-blue-300 transition-colors"
                                                            title="View Product"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(product)}
                                                            className="text-black hover:text-yellow-300 transition-colors"
                                                            title="Edit Product"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {products !== undefined && (
                            <div className="bg-black px-6 py-3 text-sm text-gray-300 flex justify-end">
                                <div className="flex items-center space-x-3 px-3 py-2 rounded-md ">
                                    {/* Demand Forecast Button */}
                                    <button
                                        onClick={() => { }}
                                        className="border border-teal-500 bg-black hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors font-medium"
                                    >
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={() => { }}
                                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors font-medium"
                                    >
                                        <span>Save</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showDemandForecastModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-scroll">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h3 className="text-xl font-semibold">Demand Forecast</h3>
                            <button
                                onClick={() => setShowDemandForecastModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Chart Container */}
                            <div className="bg-black rounded-lg p-4 mb-6 max-h-[90vh]" style={{ height: "400px" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="demand"
                                            stroke="#A855F7"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            name="Product Demand"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#14B8A6"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            name="Selling Price"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Data Table */}
                            <div className="bg-gray-800 rounded-lg">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Odometer</th>
                                            <th className="p-4">Station Name</th>
                                            <th className="p-4">Fuel Brand</th>
                                            <th className="p-4">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products
                                            .map((product: any, index: any) => (
                                                <tr key={product.id} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}>
                                                    <td className="p-4 font-medium">{product.name}</td>
                                                    <td className="p-4 capitalize">{product.odometer}</td>
                                                    <td className="p-4">{product.station_name}</td>
                                                    <td className="p-4">{product.fuel_brand}</td>
                                                    <td className="p-4">{product.fuel_grade}</td>
                                                    <td className="p-4">{product.quantity}</td>
                                                    <td className="p-4">{product.fuel_grade}</td>
                                                    <td className="p-4">{product.total_amount}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Add New Fuel Up</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderFormField('Name', 'name', 'text', 'Enter name', true)}
                            {renderFormField('Odometer', 'odometer', 'text', '0.00', true,)}
                            {renderFormField('station name', 'station_name', 'text', '', true)}
                            {renderFormField('Fuel brand', 'fuel_brand', 'text', '', true)}
                            {renderFormField('Fuel grade', 'fuel_grade', 'text', '', true)}
                            {renderFormField('quantity', 'quantity', 'number', '0.00')}
                            {renderFormField('Total Amount', 'total_amount', 'number', '0')}
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={createProductMutation.isPending}
                                className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-700 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                            >
                                {createProductMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Edit Product</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    resetForm();
                                    setSelectedProduct(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderFormField('Product Name', 'name', 'text', 'Enter product name', true)}
                            {renderFormField('Odometer', 'odometer', 'text', '0.00', true,)}
                            {renderFormField('station name', 'station_name', 'number', '0.00', true)}
                            {renderFormField('Fuel brand', 'fuel_brand', 'number', '0.00', true)}
                        </div>

                        <div className="mt-6">
                            {renderFormField('Quantity', 'quantity', 'textarea', 'Enter product description')}
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    resetForm();
                                    setSelectedProduct(null);
                                }}
                                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditProduct}
                                disabled={updateProductMutation.isPending}
                                className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-700 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                            >
                                {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;