import { useState, useEffect } from "react";
import { Project, NewProject, ProjectPriority, ProjectCategory } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradientButton } from "@/components/ui/gradient-button";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: NewProject) => void;
  initialData?: NewProject;
}

const initialProjectState: NewProject = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  priority: 'medium',
  category: '',
  budget: 0,
  teamMembers: []
};

export function ProjectModal({ isOpen, onClose, onSubmit, initialData }: ProjectModalProps) {
  const [project, setProject] = useState<NewProject>(initialData || initialProjectState);

  useEffect(() => {
    if (initialData) {
      setProject(initialData);
    } else {
      setProject(initialProjectState);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.title && project.startDate && project.endDate) {
      onSubmit(project);
      setProject(initialProjectState);
      onClose();
    }
  };

  const handleClose = () => {
    setProject(initialProjectState);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Create New Project
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter project title"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={project.category} 
                onValueChange={(value) => setProject({ ...project, category: value as ProjectCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={project.priority} 
                onValueChange={(value) => setProject({ ...project, priority: value as ProjectPriority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={project.startDate}
                onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={project.endDate}
                onChange={(e) => setProject({ ...project, endDate: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0"
                value={project.budget}
                onChange={(e) => setProject({ ...project, budget: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <GradientButton 
              type="submit" 
              variant="hero" 
              className="flex-1"
              disabled={!project.title || !project.startDate || !project.endDate}
            >
              Create Project
            </GradientButton>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}