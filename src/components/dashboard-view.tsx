import { Analytics, Notification } from "@/types/project";
import { AnalyticsCard } from "./analytics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Play, 
  BarChart3, 
  Target, 
  AlertCircle, 
  Bell, 
  Zap, 
  Plus, 
  Download, 
  Calendar,
  TrendingUp 
} from "lucide-react";

interface DashboardViewProps {
  analytics: Analytics;
  notifications: Notification[];
  onNewProject: () => void;
  onExportData: () => void;
  onChangeView: (view: string) => void;
}

export function DashboardView({ 
  analytics, 
  notifications, 
  onNewProject, 
  onExportData, 
  onChangeView 
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Active Projects"
          value={analytics.activeProjects}
          subtitle={`Avg Progress: ${analytics.avgProgress}%`}
          icon={Play}
          iconColor="text-status-active"
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Budget Utilization"
          value={`${analytics.budgetUtilization.toFixed(1)}%`}
          subtitle={`$${analytics.totalSpent.toLocaleString()} / $${analytics.totalBudget.toLocaleString()}`}
          icon={BarChart3}
          iconColor="text-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <AnalyticsCard
          title="Completion Rate"
          value={`${analytics.onTimeCompletion.toFixed(1)}%`}
          subtitle={`${analytics.completedProjects} completed`}
          icon={Target}
          iconColor="text-status-completed"
          trend={{ value: 5, isPositive: true }}
        />
        <AnalyticsCard
          title="Overdue Projects"
          value={analytics.overdueProjects}
          subtitle="Require attention"
          icon={AlertCircle}
          iconColor="text-priority-high"
          trend={{ value: -3, isPositive: false }}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5 text-orange-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <GradientButton 
                variant="hero" 
                className="flex-col h-16 gap-1"
                onClick={onNewProject}
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs">New Project</span>
              </GradientButton>
              
              <GradientButton 
                variant="success" 
                className="flex-col h-16 gap-1"
                onClick={onExportData}
              >
                <Download className="h-4 w-4" />
                <span className="text-xs">Export Data</span>
              </GradientButton>
              
              <GradientButton 
                variant="primary" 
                className="flex-col h-16 gap-1"
                onClick={() => onChangeView('timeline')}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Timeline</span>
              </GradientButton>
              
              <GradientButton 
                variant="warning" 
                className="flex-col h-16 gap-1"
                onClick={() => onChangeView('kanban')}
              >
                <Target className="h-4 w-4" />
                <span className="text-xs">Kanban</span>
              </GradientButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-status-active">
                {analytics.activeProjects}
              </div>
              <div className="text-sm text-muted-foreground">Projects in Progress</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-status-completed">
                ${(analytics.totalSpent / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-muted-foreground">Total Investment</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {analytics.avgProgress}%
              </div>
              <div className="text-sm text-muted-foreground">Average Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}