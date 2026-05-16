import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  status: 'active' | 'inactive';
  completions: number;
}

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Survey',
      description: 'Answer 10 questions about your shopping habits',
      reward: 2.5,
      category: 'survey',
      status: 'active',
      completions: 234,
    },
    {
      id: '2',
      title: 'Write Product Review',
      description: 'Review the new wireless headphones',
      reward: 5.0,
      category: 'review',
      status: 'active',
      completions: 156,
    },
    {
      id: '3',
      title: 'Test Mobile App',
      description: 'Test new features and report bugs',
      reward: 8.0,
      category: 'testing',
      status: 'active',
      completions: 89,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'general',
  });

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        reward: task.reward.toString(),
        category: task.category,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', reward: '', category: 'general' });
    }
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title || !formData.reward) return;

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formData.title,
                description: formData.description,
                reward: parseFloat(formData.reward),
                category: formData.category,
              }
            : t
        )
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          reward: parseFloat(formData.reward),
          category: formData.category,
          status: 'active',
          completions: 0,
        },
      ]);
    }

    setIsDialogOpen(false);
    setFormData({ title: '', description: '', reward: '', category: 'general' });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const categoryColors: Record<string, string> = {
    survey: 'bg-blue-100 text-blue-800',
    review: 'bg-green-100 text-green-800',
    testing: 'bg-purple-100 text-purple-800',
    'focus-group': 'bg-orange-100 text-orange-800',
    general: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Task Management</h1>
          <p className="text-muted-foreground">Create and manage available tasks</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                <DialogDescription>
                  {editingTask ? 'Update task details' : 'Add a new task for users to complete'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Task title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Task description"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reward">Reward ($)</Label>
                    <Input
                      id="reward"
                      type="number"
                      step="0.01"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="focus-group">Focus Group</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTask}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {editingTask ? 'Update' : 'Create'} Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>{filteredTasks.length} tasks available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Category</TableHead>
                    <TableHead className="text-foreground">Reward</TableHead>
                    <TableHead className="text-foreground">Completions</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge className={categoryColors[task.category] || categoryColors.general}>
                          {task.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">${task.reward.toFixed(2)}</TableCell>
                      <TableCell className="text-foreground">{task.completions}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{task.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(task)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

export default AdminTasks;
