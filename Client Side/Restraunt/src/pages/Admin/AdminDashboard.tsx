import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { categoriesAPI, menuAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalCategories: number;
  totalMenuItems: number;
  availableItems: number;
  unavailableItems: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalCategories: 0,
    totalMenuItems: 0,
    availableItems: 0,
    unavailableItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [categoriesRes, menuRes] = await Promise.all([
        categoriesAPI.getAll(),
        menuAPI.getAll(),
      ]);

      const categories = categoriesRes.data;
      const menuItems = menuRes.data;

      const available = Array.isArray(menuItems)
        ? menuItems.filter((item: any) => item.available || item.isAvailable).length
        : 0;
      const unavailable = Array.isArray(menuItems)
        ? menuItems.filter((item: any) => !item.available && !item.isAvailable).length
        : 0;

      setStats({
        totalCategories: Array.isArray(categories) ? categories.length : 0,
        totalMenuItems: Array.isArray(menuItems) ? menuItems.length : 0,
        availableItems: available,
        unavailableItems: unavailable,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Menu Items',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Available Items',
      value: stats.availableItems,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Unavailable Items',
      value: stats.unavailableItems,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const availablePercent = stats.totalMenuItems > 0
    ? (stats.availableItems / stats.totalMenuItems) * 100
    : 0;
  const unavailablePercent = stats.totalMenuItems > 0
    ? (stats.unavailableItems / stats.totalMenuItems) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your restaurant admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Menu Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/admin/categories" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/menu" className="gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Manage Menu Items
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Menu Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Available */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Items</span>
                <span className="font-medium">{stats.availableItems} items</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${availablePercent}%` }}
                />
              </div>
            </div>

            {/* Unavailable */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unavailable Items</span>
                <span className="font-medium">{stats.unavailableItems} items</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-destructive transition-all"
                  style={{ width: `${unavailablePercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
