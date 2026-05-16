import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminSidebar from '@/components/AdminSidebar';
import { Search, Check, X, Clock } from 'lucide-react';

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedDate: string;
  processedDate?: string;
}

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      email: 'john@example.com',
      amount: 100.00,
      method: 'PayPal',
      status: 'pending',
      requestedDate: '2024-05-15',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      amount: 250.00,
      method: 'Bank Transfer',
      status: 'processing',
      requestedDate: '2024-05-14',
    },
    {
      id: '3',
      userId: '3',
      userName: 'Bob Johnson',
      email: 'bob@example.com',
      amount: 50.00,
      method: 'Amazon Gift Card',
      status: 'completed',
      requestedDate: '2024-05-10',
      processedDate: '2024-05-12',
    },
    {
      id: '4',
      userId: '4',
      userName: 'Alice Williams',
      email: 'alice@example.com',
      amount: 75.50,
      method: 'PayPal',
      status: 'pending',
      requestedDate: '2024-05-16',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredWithdrawals = withdrawals.filter(
    (w) =>
      (w.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || w.status === filterStatus)
  );

  const updateWithdrawalStatus = (id: string, newStatus: Withdrawal['status']) => {
    setWithdrawals(
      withdrawals.map((w) =>
        w.id === id
          ? {
              ...w,
              status: newStatus,
              processedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : w.processedDate,
            }
          : w
      )
    );
  };

  const stats = [
    {
      label: 'Pending',
      value: withdrawals.filter((w) => w.status === 'pending').length,
      color: 'text-yellow-500',
    },
    {
      label: 'Processing',
      value: withdrawals.filter((w) => w.status === 'processing').length,
      color: 'text-blue-500',
    },
    {
      label: 'Completed',
      value: withdrawals.filter((w) => w.status === 'completed').length,
      color: 'text-green-500',
    },
    {
      label: 'Failed',
      value: withdrawals.filter((w) => w.status === 'failed').length,
      color: 'text-red-500',
    },
  ];

  const totalPending = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const statusBadgeColor: Record<Withdrawal['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusIcons: Record<Withdrawal['status'], React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Clock className="w-4 h-4" />,
    completed: <Check className="w-4 h-4" />,
    failed: <X className="w-4 h-4" />,
  };

  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Withdrawal Management</h1>
          <p className="text-muted-foreground">Process and track user withdrawal requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert */}
        <Card className="bg-orange-50 border-orange-200 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">Pending Withdrawals</p>
                <p className="text-sm text-orange-700">${totalPending.toFixed(2)} waiting to be processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-md bg-card border border-border text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Withdrawals Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>{filteredWithdrawals.length} requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground">User</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Amount</TableHead>
                    <TableHead className="text-foreground">Method</TableHead>
                    <TableHead className="text-foreground">Requested</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{withdrawal.userName}</TableCell>
                      <TableCell className="text-muted-foreground">{withdrawal.email}</TableCell>
                      <TableCell className="text-foreground font-medium">${withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{withdrawal.method}</TableCell>
                      <TableCell className="text-muted-foreground">{withdrawal.requestedDate}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeColor[withdrawal.status]}>
                          <span className="flex items-center gap-1">
                            {statusIcons[withdrawal.status]}
                            {withdrawal.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {withdrawal.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateWithdrawalStatus(withdrawal.id, 'processing')}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateWithdrawalStatus(withdrawal.id, 'failed')}
                              className="text-red-500 hover:text-red-700"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {withdrawal.status === 'processing' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal.id, 'completed')}
                            className="text-green-500 hover:text-green-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                        {(withdrawal.status === 'completed' || withdrawal.status === 'failed') && (
                          <span className="text-sm text-muted-foreground">Done</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
