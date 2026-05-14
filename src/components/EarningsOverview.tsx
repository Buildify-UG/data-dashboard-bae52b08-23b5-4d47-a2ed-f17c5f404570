import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EarningsOverviewProps {
  earnings: {
    today: number;
    week: number;
    total: number;
    pending: number;
  };
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ earnings }) => {
  const weekData = [
    { day: 'Mon', amount: 12.5 },
    { day: 'Tue', amount: 8.0 },
    { day: 'Wed', amount: 15.0 },
    { day: 'Thu', amount: 0 },
    { day: 'Fri', amount: 0 },
    { day: 'Sat', amount: 0 },
    { day: 'Sun', amount: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">${earnings.total.toFixed(2)}</div>
          <p className="text-sm opacity-80 mt-2">Lifetime earnings</p>
        </CardContent>
      </Card>

      {/* Pending Earnings */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">${earnings.pending.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
        </CardContent>
      </Card>

      {/* Weekly Earnings Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Weekly Earnings</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Withdrawal Options */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Withdrawal Methods</CardTitle>
          <CardDescription>Choose how to receive your earnings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-foreground">PayPal</span>
            <span className="text-xs text-muted-foreground">Instant</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-foreground">Bank Transfer</span>
            <span className="text-xs text-muted-foreground">1-2 days</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 cursor-pointer transition-colors">
            <span className="text-sm font-medium text-foreground">Amazon Gift Card</span>
            <span className="text-xs text-muted-foreground">Instant</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
