import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  date: Date;
  account: string;
}

interface WithdrawalHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ open, onOpenChange }) => {
  // Mock data
  const withdrawals: Withdrawal[] = [
    {
      id: '1',
      amount: 50,
      status: 'completed',
      method: 'PayPal',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      account: 'user@email.com',
    },
    {
      id: '2',
      amount: 25,
      status: 'processing',
      method: 'Bank Transfer',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      account: '****1234',
    },
    {
      id: '3',
      amount: 100,
      status: 'pending',
      method: 'Amazon Gift Card',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      account: 'user@email.com',
    },
    {
      id: '4',
      amount: 30,
      status: 'failed',
      method: 'PayPal',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      account: 'old@email.com',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Withdrawal History</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View all your withdrawal requests and their status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {withdrawals.length === 0 ? (
            <Card className="p-8 text-center border-border">
              <p className="text-muted-foreground">No withdrawals yet</p>
            </Card>
          ) : (
            withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="p-4 border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getStatusIcon(withdrawal.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">${withdrawal.amount.toFixed(2)}</h4>
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${getStatusColor(withdrawal.status)}`}
                        >
                          {withdrawal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{withdrawal.method}</p>
                      <p className="text-xs text-muted-foreground mt-1">{withdrawal.account}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {format(withdrawal.date, 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(withdrawal.date, 'h:mm a')}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalHistory;
