
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar,
  Settings,
  User,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data for charts
  const salesData = [
    { name: 'Mon', sales: 2400 },
    { name: 'Tue', sales: 1398 },
    { name: 'Wed', sales: 9800 },
    { name: 'Thu', sales: 3908 },
    { name: 'Fri', sales: 4800 },
    { name: 'Sat', sales: 3800 },
    { name: 'Sun', sales: 4300 },
  ];

  const categoryData = [
    { name: 'Yoga Mats', value: 35, color: '#8FBC8F' },
    { name: 'Ayurvedic Products', value: 30, color: '#D2B48C' },
    { name: 'Meditation', value: 20, color: '#DDA0DD' },
    { name: 'Accessories', value: 15, color: '#F0E68C' },
  ];

  const sampleProducts = [
    { id: 1, name: 'Eco Yoga Mat - Sage', category: 'Yoga Merchandise', price: 89.99, stock: 15, status: 'Active' },
    { id: 2, name: 'Ashwagandha Capsules - Vata', category: 'Ayurvedic Products', price: 34.99, stock: 3, status: 'Low Stock' },
    { id: 3, name: 'Meditation Cushion', category: 'Yoga Merchandise', price: 45.99, stock: 8, status: 'Active' },
    { id: 4, name: 'Turmeric Blend - Pitta', category: 'Ayurvedic Products', price: 28.99, stock: 12, status: 'Active' },
  ];

  const sampleOrders = [
    { id: '#WS001', customer: 'Sarah Chen', date: '2024-05-23', status: 'Processing', total: 124.97 },
    { id: '#WS002', customer: 'Mike Johnson', date: '2024-05-23', status: 'Shipped', total: 89.99 },
    { id: '#WS003', customer: 'Emma Wilson', date: '2024-05-22', status: 'Delivered', total: 156.48 },
    { id: '#WS004', customer: 'David Kumar', date: '2024-05-22', status: 'Pending', total: 203.45 },
  ];

  const sampleUsers = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@email.com', orders: 12, joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Mike Johnson', email: 'mike@email.com', orders: 8, joined: '2024-02-20', status: 'Active' },
    { id: 3, name: 'Emma Wilson', email: 'emma@email.com', orders: 15, joined: '2023-11-10', status: 'Active' },
    { id: 4, name: 'David Kumar', email: 'david@email.com', orders: 6, joined: '2024-03-05', status: 'Active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'low stock': return 'bg-orange-100 text-orange-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-stone-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-sage-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sage-800">Wellness Admin</h1>
                <p className="text-sm text-sage-600">Yoga & Ayurvedic Store Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-sage-300 text-sage-700 hover:bg-sage-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-sage-200 h-screen sticky top-0">
          <nav className="p-6 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start bg-sage-500 hover:bg-sage-600 text-white"
              onClick={() => setActiveTab('dashboard')}
            >
              <TrendingUp className="w-4 h-4 mr-3" />
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
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start hover:bg-sage-50 text-sage-700"
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag className="w-4 h-4 mr-3" />
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Dashboard</h2>
                <p className="text-sage-600">Welcome back! Here's what's happening with your wellness store.</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-sage-600">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-sage-800">$12,456</div>
                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                  </CardContent>
                </Card>
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-sage-600">Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-sage-800">234</div>
                    <p className="text-xs text-green-600 mt-1">+8% from last week</p>
                  </CardContent>
                </Card>
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-sage-600">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-sage-800">1,429</div>
                    <p className="text-xs text-blue-600 mt-1">+12% this month</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Low Stock
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-800">7</div>
                    <p className="text-xs text-orange-600 mt-1">Items need restock</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-sage-200">
                  <CardHeader>
                    <CardTitle className="text-sage-800">Weekly Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="sales" fill="#8FBC8F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-sage-200">
                  <CardHeader>
                    <CardTitle className="text-sage-800">Product Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div 
                            className="w-3 h-3 rounded mr-2" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sage-700">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-sage-800 mb-2">Products</h2>
                  <p className="text-sage-600">Manage your yoga merchandise and ayurvedic products</p>
                </div>
                <Button className="bg-sage-500 hover:bg-sage-600 text-white">
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card className="border-sage-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-sage-50 border-b border-sage-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-sage-800">Product</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Category</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Price</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Stock</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Status</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleProducts.map((product) => (
                          <tr key={product.id} className="border-b border-sage-100 hover:bg-sage-25">
                            <td className="p-4 font-medium text-sage-800">{product.name}</td>
                            <td className="p-4 text-sage-600">{product.category}</td>
                            <td className="p-4 text-sage-800">${product.price}</td>
                            <td className="p-4 text-sage-800">{product.stock}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sage-600 hover:text-sage-800">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Orders</h2>
                <p className="text-sage-600">Track and manage customer orders</p>
              </div>

              <Card className="border-sage-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-sage-50 border-b border-sage-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-sage-800">Order ID</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Customer</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Date</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Status</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Total</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleOrders.map((order) => (
                          <tr key={order.id} className="border-b border-sage-100 hover:bg-sage-25">
                            <td className="p-4 font-medium text-sage-800">{order.id}</td>
                            <td className="p-4 text-sage-800">{order.customer}</td>
                            <td className="p-4 text-sage-600">{order.date}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium text-sage-800">${order.total}</td>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-2">Users</h2>
                <p className="text-sage-600">Manage customer accounts and profiles</p>
              </div>

              <Card className="border-sage-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-sage-50 border-b border-sage-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-sage-800">Name</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Email</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Orders</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Joined</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Status</th>
                          <th className="text-left p-4 font-semibold text-sage-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleUsers.map((user) => (
                          <tr key={user.id} className="border-b border-sage-100 hover:bg-sage-25">
                            <td className="p-4 font-medium text-sage-800">{user.name}</td>
                            <td className="p-4 text-sage-600">{user.email}</td>
                            <td className="p-4 text-sage-800">{user.orders}</td>
                            <td className="p-4 text-sage-600">{user.joined}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </td>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
