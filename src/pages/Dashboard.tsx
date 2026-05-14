import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, DollarSign, TrendingUp, Plus } from 'lucide-react';
import TaskList from '@/components/TaskList';
import EarningsOverview from '@/components/EarningsOverview';
import TaskForm from '@/components/TaskForm';
import WithdrawalWidget from '@/components/WithdrawalWidget';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  completed: boolean;
  completedAt?: Date;
}

interface Earnings {
  today: number;
  week: number;
  total: number;
  pending: number;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Survey',
      description: 'Answer 10 questions about your shopping habits',
      reward: 2.5,
      category: 'survey',
      completed: false,
    },
    {
      id: '2',
      title: 'Write Product Review',
      description: 'Review the new wireless headphones',
      reward: 5.0,
      category: 'review',
      completed: false,
    },
    {
      id: '3',
      title: 'Test Mobile App',
      description: 'Test new features and report bugs',
      reward: 8.0,
      category: 'testing',
      completed: false,
    },
    {
      id: '4',
      title: 'Participate in Focus Group',
      description: '1-hour discussion about new product',
      reward: 15.0,
      category: 'focus-group',
      completed: true,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [earnings] = useState<Earnings>({
    today: 7.5,
    week: 35.0,
    total: 287.50,
    pending: 12.5,
  });

  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: true, completedAt: new Date() }
        : task
    ));
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([task, ...tasks]);
    setShowTaskForm(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earn Money Dashboard</h1>
          <p className="text-muted-foreground">Complete tasks and earn money online</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Today's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">${earnings.today.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">${earnings.week.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">of {tasks.length} tasks</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Earn ${tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.reward, 0).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Available Tasks</CardTitle>
                  <CardDescription>Complete tasks to earn money</CardDescription>
                </div>
                <Button
                  onClick={() => setShowTaskForm(true)}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                {showTaskForm && (
                  <div className="mb-6 pb-6 border-b border-border">
                    <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskForm(false)} />
                  </div>
                )}
                <TaskList
                  tasks={tasks}
                  onCompleteTask={handleCompleteTask}
                />
              </CardContent>
            </Card>
          </div>

          {/* Earnings Sidebar */}
          <div className="space-y-6">
            <WithdrawalWidget balance={earnings.total} />
            <EarningsOverview earnings={earnings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
