import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Home,
  Folder,
  Edit,
  Eye,
  LogOut
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';
import { fetchDashboardStats, fetchSalesByDay, fetchSalesByCategory } from '@/services/analyticsService';
import { fetchOrders } from '@/services/orderService';
import { fetchUsers } from '@/services/userService';
import { fetchCategories } from '@/services/categoryService';
import { formatSimpleCurrency } from '@/lib/currency';
import { useNavigate } from 'react-router-dom';
import CategoriesList from '@/components/CategoriesList';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: dashboardStats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  const { data: salesByDay, isLoading: loadingSalesByDay } = useQuery({
    queryKey: ['salesByDay'],
    queryFn: fetchSalesByDay
  });

  const { data: salesByCategory, isLoading: loadingSalesByCategory } = useQuery({
    queryKey: ['salesByCategory'],
    queryFn: fetchSalesByCategory
  });

  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const getStatusColor = (status: string | null | undefined) => {
    // Handle undefined, null, or empty status
    if (!status) {
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'low stock':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getCategoryName = (categoryId: string | null | undefined) => {
    if (!categoryId || !categories) return 'No Category';
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
          <div className="p-6 border-b border-sage-200">
            <h1 className="text-xl font-bold text-sage-800">SabrShukr</h1>
            <p className="text-sm text-sage-600 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="mt-6 px-4 space-y-2 flex-1">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('dashboard')}
            >
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('products')}
            >
              <Package className="w-4 h-4 mr-3" />
              Products
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('categories')}
            >
              <Folder className="w-4 h-4 mr-3" />
              Categories
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="w-4 h-4 mr-3" />
              Orders
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-3" />
              Users
            </Button>
          </nav>

          {/* Logout Button at the bottom */}
          <div className="p-4 border-t border-sage-200">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Dashboard Overview</h2>
                <p className="text-sage-600">Welcome to your SabrShukr management system</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-sage-600">Total Revenue</h3>
                    <DollarSign className="h-4 w-4 text-sage-600" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="text-2xl font-bold text-sage-400">Loading...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-sage-800">
                          {formatSimpleCurrency(dashboardStats?.totalSales || 0)}
                        </div>
                        <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-sage-600">Total Orders</h3>
                    <ShoppingCart className="h-4 w-4 text-sage-600" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="text-2xl font-bold text-sage-400">Loading...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-sage-800">{dashboardStats?.totalOrders || 0}</div>
                        <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-sage-600">Total Products</h3>
                    <Package className="h-4 w-4 text-sage-600" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="text-2xl font-bold text-sage-400">Loading...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-sage-800">{dashboardStats?.totalProducts || 0}</div>
                        <p className="text-xs text-red-600 mt-1">-3% from last month</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-sage-600">New Customers</h3>
                    <Users className="h-4 w-4 text-sage-600" />
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="text-2xl font-bold text-sage-400">Loading...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-sage-800">{dashboardStats?.newCustomers || 0}</div>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sage-800">Sales by Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingSalesByDay ? (
                      <div className="text-sage-500">Loading sales data...</div>
                    ) : salesByDay && salesByDay.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesByDay}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis tickFormatter={(value) => formatSimpleCurrency(value as number)} />
                          <Tooltip formatter={(value) => [formatSimpleCurrency(value as number), 'Sales']} />
                          <Line type="monotone" dataKey="total" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-sage-500">No sales data available</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sage-800">Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingSalesByCategory ? (
                      <div className="text-sage-500">Loading sales data...</div>
                    ) : salesByCategory && salesByCategory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            dataKey="total"
                            isAnimationActive={false}
                            data={salesByCategory}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                          >
                            {salesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [formatSimpleCurrency(value as number), name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-sage-500">No sales data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-sage-800 mb-2">Products</h2>
                  <p className="text-sage-600">Manage your product inventory and details</p>
                </div>
                <Button 
                  onClick={() => navigate('/products/new')}
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sage-800">Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-sage-200">
                          <th className="text-left p-4 font-medium text-sage-700">Name</th>
                          <th className="text-left p-4 font-medium text-sage-700">Category</th>
                          <th className="text-left p-4 font-medium text-sage-700">Price</th>
                          <th className="text-left p-4 font-medium text-sage-700">Stock</th>
                          <th className="text-left p-4 font-medium text-sage-700">Status</th>
                          <th className="text-left p-4 font-medium text-sage-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingProducts ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-sage-500">Loading products...</td>
                          </tr>
                        ) : products && products.length > 0 ? (
                          products.map((product: any) => (
                            <tr key={product.id} className="border-b border-sage-100 hover:bg-sage-25">
                              <td className="p-4 font-medium text-sage-800">{product.name}</td>
                              <td className="p-4 text-sage-600">{getCategoryName(product.category_id)}</td>
                              <td className="p-4 text-sage-800">{formatSimpleCurrency(product.price)}</td>
                              <td className="p-4 text-sage-800">{product.stock_quantity}</td>
                              <td className="p-4">
                                <Badge className={product.stock_quantity < 10 ? getStatusColor('low stock') : getStatusColor('active')}>
                                  {product.stock_quantity < 10 ? 'Low Stock' : 'In Stock'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-sage-600 hover:text-sage-800"
                                    onClick={() => navigate(`/products/${product.id}/edit`)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-sage-500">No products found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Categories</h2>
                <p className="text-sage-600">Manage product categories and organization</p>
              </div>
              <CategoriesList />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Orders</h2>
                <p className="text-sage-600">Track and manage customer orders</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sage-800">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-sage-200">
                          <th className="text-left p-4 font-medium text-sage-700">Order ID</th>
                          <th className="text-left p-4 font-medium text-sage-700">Customer</th>
                          <th className="text-left p-4 font-medium text-sage-700">Status</th>
                          <th className="text-left p-4 font-medium text-sage-700">Total</th>
                          <th className="text-left p-4 font-medium text-sage-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingOrders ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-sage-500">Loading orders...</td>
                          </tr>
                        ) : orders && orders.length > 0 ? (
                          orders.slice(0, 10).map((order: any) => (
                            <tr key={order.id} className="border-b border-sage-100 hover:bg-sage-25">
                              <td className="p-4 font-medium text-sage-800">#{order.id.slice(0, 8)}</td>
                              <td className="p-4 text-sage-600">{order.customer || 'Guest'}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status || 'Unknown'}
                                </Badge>
                              </td>
                              <td className="p-4 font-medium text-sage-800">{formatSimpleCurrency(order.total_amount)}</td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-sage-500">No orders found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Users</h2>
                <p className="text-sage-600">Manage user accounts and permissions</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sage-800">Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-sage-200">
                          <th className="text-left p-4 font-medium text-sage-700">Name</th>
                          <th className="text-left p-4 font-medium text-sage-700">Email</th>
                          <th className="text-left p-4 font-medium text-sage-700">Role</th>
                          <th className="text-left p-4 font-medium text-sage-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingUsers ? (
                          <tr>
                            <td colSpan={4} className="text-center p-8 text-sage-500">Loading users...</td>
                          </tr>
                        ) : users && users.length > 0 ? (
                          users.map((user: any) => (
                            <tr key={user.id} className="border-b border-sage-100 hover:bg-sage-25">
                              <td className="p-4 font-medium text-sage-800">{user.full_name || 'N/A'}</td>
                              <td className="p-4 text-sage-600">{user.email}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(user.role)}>
                                  {user.role || 'User'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-sage-600 hover:text-sage-800"
                                    onClick={() => navigate(`/users/${user.id}`)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center p-8 text-sage-500">No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
