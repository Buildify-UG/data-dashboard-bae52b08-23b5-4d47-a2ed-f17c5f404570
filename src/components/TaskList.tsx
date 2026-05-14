import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  survey: { bg: 'bg-blue-100', text: 'text-blue-800' },
  review: { bg: 'bg-purple-100', text: 'text-purple-800' },
  testing: { bg: 'bg-green-100', text: 'text-green-800' },
  'focus-group': { bg: 'bg-orange-100', text: 'text-orange-800' },
  general: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onCompleteTask }) => {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const TaskItem: React.FC<{ task: Task; isCompleted?: boolean }> = ({ task, isCompleted = false }) => {
    const colors = categoryColors[task.category] || categoryColors.general;

    return (
      <div
        className={cn(
          'flex items-start gap-4 p-4 rounded-lg border border-border transition-all',
          isCompleted
            ? 'bg-muted/30 opacity-60 hover:opacity-80'
            : 'bg-card hover:bg-accent/5'
        )}
      >
        <button
          onClick={() => !isCompleted && onCompleteTask(task.id)}
          className="mt-1 flex-shrink-0 focus:outline-none"
          disabled={isCompleted}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-semibold',
              isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
            )}>
              {task.title}
            </h3>
            <Badge variant="outline" className={cn(colors.bg, colors.text, 'text-xs')}>
              {task.category}
            </Badge>
          </div>
          <p className={cn(
            'text-sm',
            isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'
          )}>
            {task.description}
          </p>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-green-600">
            ${task.reward.toFixed(2)}
          </div>
          {!isCompleted && (
            <Button
              onClick={() => onCompleteTask(task.id)}
              size="sm"
              variant="outline"
              className="mt-2 border-border text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              Complete
            </Button>
          )}
          {isCompleted && (
            <div className="text-xs text-green-600 font-medium mt-2">
              ✓ Completed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {activeTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Active Tasks</h3>
          <div className="space-y-2">
            {activeTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Completed</h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} isCompleted={true} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
