import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ open, onOpenChange, balance }) => {
  const [step, setStep] = useState<'method' | 'amount' | 'confirm' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [methodDetails, setMethodDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const methods = [
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { id: 'amazon_gift_card', label: 'Amazon Gift Card', icon: '🎁' },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    const amountNum = parseFloat(amount);
    if (!amount || amountNum < 1) {
      toast.error('Minimum withdrawal is $1.00');
      return;
    }
    if (amountNum > balance) {
      toast.error('Insufficient balance');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('success');
    toast.success('Withdrawal request submitted!');
  };

  const handleClose = () => {
    setStep('method');
    setSelectedMethod('');
    setAmount('');
    setMethodDetails('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Request Withdrawal</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'method' && 'Choose your withdrawal method'}
            {step === 'amount' && 'Enter withdrawal amount'}
            {step === 'confirm' && 'Review and confirm'}
            {step === 'success' && 'Withdrawal request submitted'}
          </DialogDescription>
        </DialogHeader>

        {step === 'method' && (
          <div className="space-y-3">
            {methods.map((method) => (
              <Card
                key={method.id}
                className="p-4 cursor-pointer border-border hover:bg-accent transition-colors"
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-foreground">{method.label}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 'amount' && (
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-2 block">Amount to Withdraw</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 bg-background border-border text-foreground"
                  min="1"
                  max={balance}
                  step="0.01"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available: ${balance.toFixed(2)}
              </p>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">
                {selectedMethod === 'paypal' && 'PayPal Email'}
                {selectedMethod === 'bank_transfer' && 'Bank Account'}
                {selectedMethod === 'amazon_gift_card' && 'Email Address'}
              </Label>
              <Input
                type={selectedMethod === 'paypal' ? 'email' : 'text'}
                placeholder={
                  selectedMethod === 'paypal'
                    ? 'your@email.com'
                    : selectedMethod === 'amazon_gift_card'
                      ? 'your@email.com'
                      : 'Account number'
                }
                value={methodDetails}
                onChange={(e) => setMethodDetails(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1 border-border text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={handleAmountSubmit}
                disabled={!amount || !methodDetails}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <Card className="p-4 bg-background border-border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Withdrawal Amount:</span>
                  <span className="font-semibold text-foreground">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-semibold text-foreground">
                    {methods.find((m) => m.id === selectedMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="font-semibold text-foreground">1-3 business days</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-2 p-3 bg-accent/50 rounded-lg border border-border">
              <AlertCircle className="w-4 h-4 text-accent-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent-foreground">
                Once submitted, you cannot cancel this request. Please review carefully.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('amount')}
                className="flex-1 border-border text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                isLoading={isLoading}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Withdrawal Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                Your withdrawal of ${parseFloat(amount).toFixed(2)} has been submitted and will be
                processed within 1-3 business days.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-primary text-primary-foreground">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
