import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, CheckSquare, CreditCard, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500' },
    { label: 'Active Tasks', value: '456', icon: CheckSquare, color: 'text-green-500' },
    { label: 'Pending Withdrawals', value: '$12,450', icon: CreditCard, color: 'text-orange-500' },
    { label: 'Total Paid Out', value: '$45,320', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const earningsData = [
    { date: 'Mon', earnings: 2400 },
    { date: 'Tue', earnings: 1398 },
    { date: 'Wed', earnings: 9800 },
    { date: 'Thu', earnings: 3908 },
    { date: 'Fri', earnings: 4800 },
    { date: 'Sat', earnings: 3800 },
    { date: 'Sun', earnings: 4300 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 520 },
    { month: 'Mar', users: 680 },
    { month: 'Apr', users: 890 },
    { month: 'May', users: 1050 },
    { month: 'Jun', users: 1234 },
  ];

  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your platform overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
              <CardDescription>Total earnings by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
