import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, Task, Notification, FilterCriteria, Analytics, NewProject, ViewType, ProjectStatus, ProjectPriority, ProjectCategory } from '@/types/project';
import { DashboardView } from '@/components/dashboard-view';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GradientButton } from '@/components/ui/gradient-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar, Clock, Plus, CheckCircle2, Circle, Target, TrendingUp,
  AlertCircle, Filter, Search, Download, Upload, Settings, Moon, Sun,
  BarChart3, Users, Zap, Archive, Edit3, Trash2, Play, Pause,
  ChevronLeft, ChevronRight, Eye, EyeOff, Bell, Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    status: 'all',
    priority: 'all',
    category: 'all',
    dateRange: 'all'
  });
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "AI-Powered Website Redesign",
      description: "Complete overhaul with machine learning recommendations and modern UI/UX principles",
      status: "active",
      priority: "high",
      startDate: "2024-09-28",
      endDate: "2024-11-15",
      progress: 65,
      category: "Design",
      teamMembers: ["Alice Johnson", "Bob Smith", "Carol Davis"],
      budget: 50000,
      spent: 32500,
      tasks: 24,
      completedTasks: 16,
      tags: ["urgent", "client-facing", "revenue-critical", "ai"],
      lastActivity: "2024-09-29",
      starred: true,
      archived: false
    },
    {
      id: 2,
      title: "Cross-Platform Mobile Suite",
      description: "React Native application with advanced analytics dashboard and real-time notifications",
      status: "planning",
      priority: "medium",
      startDate: "2024-10-15",
      endDate: "2025-02-28",
      progress: 15,
      category: "Development",
      teamMembers: ["David Wilson", "Eve Martinez", "Frank Thompson"],
      budget: 80000,
      spent: 12000,
      tasks: 45,
      completedTasks: 7,
      tags: ["mobile", "analytics", "cross-platform", "react-native"],
      lastActivity: "2024-09-28",
      starred: false,
      archived: false
    },
    {
      id: 3,
      title: "Cloud Infrastructure Migration",
      description: "Kubernetes deployment with auto-scaling capabilities and improved security protocols",
      status: "completed",
      priority: "high",
      startDate: "2024-08-01",
      endDate: "2024-09-15",
      progress: 100,
      category: "Infrastructure",
      teamMembers: ["Grace Lee", "Henry Park"],
      budget: 35000,
      spent: 33800,
      tasks: 18,
      completedTasks: 18,
      tags: ["infrastructure", "scalability", "performance", "kubernetes"],
      lastActivity: "2024-09-15",
      starred: false,
      archived: false
    },
    {
      id: 4,
      title: "Market Research Analysis",
      description: "Comprehensive competitor analysis with AI insights and market trend predictions",
      status: "on-hold",
      priority: "low",
      startDate: "2024-11-01",
      endDate: "2024-12-15",
      progress: 5,
      category: "Research",
      teamMembers: ["Ivy Chen", "Jack Robinson"],
      budget: 25000,
      spent: 1250,
      tasks: 12,
      completedTasks: 1,
      tags: ["research", "market-analysis", "competitive", "ai-insights"],
      lastActivity: "2024-09-20",
      starred: false,
      archived: false
    }
  ]);

  const [notifications] = useState<Notification[]>([
    { id: 1, message: "Website Redesign milestone reached - 65% complete", type: "success", timestamp: "2024-09-29 10:30" },
    { id: 2, message: "Mobile Suite task deadline approaching in 2 days", type: "warning", timestamp: "2024-09-29 09:15" },
    { id: 3, message: "Budget threshold exceeded for Infrastructure project", type: "error", timestamp: "2024-09-28 16:45" }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Memoized filtered projects
  const filteredAndSearchedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      if (project.archived && currentView !== 'archive') return false;
      if (filterCriteria.status !== 'all' && project.status !== filterCriteria.status) return false;
      if (filterCriteria.priority !== 'all' && project.priority !== filterCriteria.priority) return false;
      if (filterCriteria.category !== 'all' && project.category !== filterCriteria.category) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query)) ||
          project.teamMembers.some(member => member.toLowerCase().includes(query))
        );
      }
      return true;
    });
    
    return filtered.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  }, [projects, filterCriteria, searchQuery, currentView]);

  // Analytics calculation
  const analytics = useMemo((): Analytics => {
    const active = projects.filter(p => p.status === 'active' && !p.archived);
    const completed = projects.filter(p => p.status === 'completed');
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
    const avgProgress = projects.length ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;
    const overdueProjects = projects.filter(p =>
      new Date(p.endDate) < new Date() && p.status !== 'completed'
    ).length;
    
    return {
      activeProjects: active.length,
      completedProjects: completed.length,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget ? (totalSpent / totalBudget) * 100 : 0,
      avgProgress: Math.round(avgProgress),
      overdueProjects,
      onTimeCompletion: completed.length ? ((completed.length - overdueProjects) / completed.length) * 100 : 0
    };
  }, [projects]);

  // Event handlers
  const toggleProjectStar = useCallback((projectId: number) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, starred: !p.starred } : p
    ));
    toast({
      title: "Project updated",
      description: "Project starred status updated successfully.",
    });
  }, [toast]);

  const archiveProject = useCallback((projectId: number) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, archived: !p.archived } : p
    ));
    toast({
      title: "Project archived",
      description: "Project has been moved to archive.",
    });
  }, [toast]);

  const handleCreateProject = useCallback((newProject: NewProject) => {
    if (!newProject.category) return; // Don't create project without category
    
    const project: Project = {
      ...newProject,
      category: newProject.category as ProjectCategory,
      id: Date.now(),
      status: new Date(newProject.startDate) > new Date() ? 'planning' : 'active',
      progress: 0,
      spent: 0,
      tasks: 0,
      completedTasks: 0,
      tags: [],
      lastActivity: new Date().toISOString().split('T')[0],
      starred: false,
      archived: false
    };
    
    setProjects(prev => [...prev, project]);
    toast({
      title: "Project created",
      description: `${project.title} has been created successfully.`,
    });
  }, [toast]);

  const exportData = useCallback(() => {
    const data = {
      projects,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Project data has been exported successfully.",
    });
  }, [projects, toast]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'projects', label: 'Projects', icon: Target },
    { key: 'timeline', label: 'Timeline', icon: Calendar },
    { key: 'kanban', label: 'Kanban', icon: Users },
    { key: 'archive', label: 'Archive', icon: Archive }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Card className="shadow-medium mb-6 border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Advanced Project Suite
                </h1>
                <p className="text-muted-foreground">
                  AI-powered project management with real-time analytics and insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="border-border/50"
                >
                  {darkMode ? 
                    <Sun className="h-4 w-4 text-yellow-500" /> : 
                    <Moon className="h-4 w-4 text-slate-600" />
                  }
                </Button>
                <GradientButton
                  variant="hero"
                  onClick={() => setShowAddForm(true)}
                  className="shadow-glow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </GradientButton>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation & Filters */}
        <Card className="shadow-soft mb-6 border-border/50 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex gap-2">
                {navigationItems.map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={currentView === key ? "default" : "ghost"}
                    onClick={() => setCurrentView(key as ViewType)}
                    className={currentView === key ? "bg-gradient-primary text-white shadow-soft" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search projects, tags, team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 border-border/50"
                  />
                </div>
                
                <Select
                  value={filterCriteria.status}
                  onValueChange={(value) => setFilterCriteria({ ...filterCriteria, status: value as any })}
                >
                  <SelectTrigger className="w-40 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                
                <GradientButton variant="success" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </GradientButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Views */}
        {currentView === 'dashboard' && (
          <DashboardView
            analytics={analytics}
            notifications={notifications}
            onNewProject={() => setShowAddForm(true)}
            onExportData={exportData}
            onChangeView={(view: string) => setCurrentView(view as ViewType)}
          />
        )}

        {(currentView === 'projects' || currentView === 'archive') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSearchedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onToggleStar={toggleProjectStar}
                onViewDetails={setSelectedProject}
                onArchive={archiveProject}
              />
            ))}
            {filteredAndSearchedProjects.length === 0 && (
              <Card className="col-span-full text-center p-12 border-border/50 shadow-soft">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new project to get started
                </p>
                <GradientButton variant="primary" onClick={() => setShowAddForm(true)}>
                  Create Project
                </GradientButton>
              </Card>
            )}
          </div>
        )}

        {/* Simplified Timeline View */}
        {currentView === 'timeline' && (
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAndSearchedProjects.map(project => (
                <div key={project.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-card/50">
                  <div className="w-4 h-4 rounded-full bg-gradient-primary shrink-0" />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString()} → {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {project.status.replace('-', ' ')}
                    </Badge>
                    <div className="w-24">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Kanban View */}
        {currentView === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(['planning', 'active', 'on-hold', 'completed'] as const).map(status => (
              <Card key={status} className="shadow-soft border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'planning' ? 'bg-status-planning' :
                      status === 'active' ? 'bg-status-active' :
                      status === 'on-hold' ? 'bg-status-hold' : 'bg-status-completed'
                    }`} />
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    <Badge variant="secondary" className="ml-auto">
                      {filteredAndSearchedProjects.filter(p => p.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredAndSearchedProjects
                    .filter(project => project.status === status)
                    .map(project => (
                      <Card key={project.id} className="cursor-pointer hover:shadow-soft transition-all border-border/30">
                        <CardContent className="p-4 space-y-3">
                          <h4 className="font-medium text-sm text-foreground line-clamp-2">
                            {project.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                project.priority === 'high' ? 'border-priority-high text-priority-high' :
                                project.priority === 'medium' ? 'border-priority-medium text-priority-medium' :
                                'border-priority-low text-priority-low'
                              }`}
                            >
                              {project.priority}
                            </Badge>
                            <div className="flex -space-x-1">
                              {project.teamMembers.slice(0, 2).map((member, index) => (
                                <div
                                  key={member}
                                  className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-xs text-white font-medium border-2 border-background"
                                  title={member}
                                >
                                  {member.charAt(0)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Project Creation Modal */}
        <ProjectModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </div>
  );
};

export default Index;
