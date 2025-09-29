import { Project } from "@/types/project";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Eye, Archive, Calendar, DollarSign, Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onToggleStar: (id: number) => void;
  onViewDetails: (project: Project) => void;
  onArchive: (id: number) => void;
}

export function ProjectCard({ project, onToggleStar, onViewDetails, onArchive }: ProjectCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'planning': return 'outline';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-priority-high bg-priority-high/10';
      case 'medium': return 'text-priority-medium bg-priority-medium/10';
      case 'low': return 'text-priority-low bg-priority-low/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const budgetUtilization = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

  return (
    <Card className="group border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {project.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => onToggleStar(project.id)}
              >
                <Star 
                  className={`h-4 w-4 transition-colors ${
                    project.starred 
                      ? 'fill-yellow-500 text-yellow-500' 
                      : 'text-muted-foreground hover:text-yellow-500'
                  }`} 
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={getStatusVariant(project.status)} className="capitalize">
            {project.status.replace('-', ' ')}
          </Badge>
          <Badge className={getPriorityColor(project.priority)}>
            {project.priority} priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Budget</span>
            </div>
            <div className="font-medium">
              ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
            </div>
            <Progress value={budgetUtilization} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Timeline</span>
            </div>
            <div className="text-xs">
              <div>{new Date(project.startDate).toLocaleDateString()}</div>
              <div>{new Date(project.endDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Team ({project.teamMembers.length})</span>
          </div>
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 4).map((member, index) => (
              <Avatar key={member} className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="text-xs bg-gradient-primary text-white">
                  {member.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 4 && (
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="text-xs bg-muted">
                  +{project.teamMembers.length - 4}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(project)}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onArchive(project.id)}>
              <Archive className="h-3 w-3 mr-1" />
              {project.archived ? 'Restore' : 'Archive'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {project.completedTasks}/{project.tasks} tasks
          </div>
        </div>
      </CardContent>
    </Card>
  );
}