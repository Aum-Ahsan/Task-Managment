import { useState } from "react";
import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Target,
  Clock,
  TrendingUp,
  X
} from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgress: (projectId: number, progress: number) => void;
}

export function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose,
  onUpdateProgress 
}: ProjectDetailModalProps) {
  const [progress, setProgress] = useState(project?.progress || 0);

  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-status-active text-white';
      case 'completed': return 'bg-status-completed text-white';
      case 'planning': return 'bg-status-planning text-white';
      case 'on-hold': return 'bg-status-hold text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high text-white';
      case 'medium': return 'bg-priority-medium text-white';
      case 'low': return 'bg-priority-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const budgetUtilization = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

  const handleProgressUpdate = () => {
    onUpdateProgress(project.id, progress);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {project.title}
              </DialogTitle>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex gap-4">
            <Badge className={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
            </Badge>
          </div>

          {/* Progress Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Progress Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Update Progress:</label>
                <Slider
                  value={[progress]}
                  onValueChange={(value) => setProgress(value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <Button onClick={handleProgressUpdate} className="w-full">
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Budget Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  ${project.spent.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  of ${project.budget.toLocaleString()} budget
                </div>
                <Progress value={budgetUtilization} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {budgetUtilization.toFixed(1)}% utilized
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span className="font-medium">{new Date(project.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {project.completedTasks}/{project.tasks}
                </div>
                <div className="text-sm text-muted-foreground">
                  tasks completed
                </div>
                <Progress 
                  value={project.tasks > 0 ? (project.completedTasks / project.tasks) * 100 : 0} 
                  className="h-2" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Team and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Team Members ({project.teamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {project.teamMembers.map((member) => (
                    <div key={member} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {member.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Project Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}