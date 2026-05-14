import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    reward: number;
    category: string;
  }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'general',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.reward) {
      onSubmit({
        title: formData.title,
        description: formData.description,
        reward: parseFloat(formData.reward),
        category: formData.category,
      });
      setFormData({
        title: '',
        description: '',
        reward: '',
        category: 'general',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-foreground">Task Title</Label>
        <Input
          id="title"
          placeholder="e.g., Complete Survey"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 border-border bg-background text-foreground"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-foreground">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what needs to be done..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 border-border bg-background text-foreground"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reward" className="text-foreground">Reward ($)</Label>
          <Input
            id="reward"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.reward}
            onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
            className="mt-1 border-border bg-background text-foreground"
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-foreground">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="mt-1 border-border bg-background text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="survey">Survey</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="focus-group">Focus Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add Task
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-border text-foreground hover:bg-accent"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
