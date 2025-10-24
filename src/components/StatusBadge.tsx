import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'available' | 'claimed' | 'on_the_way' | 'picked_up' | 'completed' | 'cancelled';
  className?: string;
}

const statusConfig = {
  available: { label: 'Available', className: 'bg-success text-success-foreground' },
  claimed: { label: 'Claimed', className: 'bg-blue-500 text-white' },
  on_the_way: { label: 'On the Way', className: 'bg-warning text-warning-foreground' },
  picked_up: { label: 'Picked Up', className: 'bg-secondary text-secondary-foreground' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
