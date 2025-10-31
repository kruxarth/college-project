import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardHeaderProps {
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ error, loading, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">NGO Dashboard</h1>
        <p className="text-muted-foreground">Browse and claim available food donations</p>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button size="lg" className="bg-gradient-warm" asChild>
          <Link to="/ngo/browse" className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Browse Donations
          </Link>
        </Button>
      </div>
    </div>
  );
}