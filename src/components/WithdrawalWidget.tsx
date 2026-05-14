import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, History } from 'lucide-react';
import WithdrawalDialog from './WithdrawalDialog';
import WithdrawalHistory from './WithdrawalHistory';

interface WithdrawalWidgetProps {
  balance: number;
}

const WithdrawalWidget: React.FC<WithdrawalWidgetProps> = ({ balance }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Available Balance</h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-4xl font-bold text-primary mb-1">${balance.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Ready to withdraw</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowDialog(true)}
            disabled={balance < 1}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-accent"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {balance < 1 && (
          <p className="text-xs text-destructive mt-2">Minimum withdrawal: $1.00</p>
        )}
      </Card>

      <WithdrawalDialog open={showDialog} onOpenChange={setShowDialog} balance={balance} />
      <WithdrawalHistory open={showHistory} onOpenChange={setShowHistory} />
    </>
  );
};

export default WithdrawalWidget;
