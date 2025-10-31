import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import type { Donation } from '@/types/firebase';

interface RecentClaimsSectionProps {
  claims: Donation[];
}

export function RecentClaimsSection({ claims }: RecentClaimsSectionProps) {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Claims</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/ngo/my-claims">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <EmptyClaimsState />
        ) : (
          <ClaimsList claims={claims.slice(0, 5)} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyClaimsState() {
  return (
    <div className="text-center py-12">
      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No claims yet</h3>
      <p className="text-muted-foreground mb-6">Start browsing available donations</p>
      <Button asChild>
        <Link to="/ngo/browse">Browse Donations</Link>
      </Button>
    </div>
  );
}

function ClaimsList({ claims }: { claims: Donation[] }) {
  return (
    <div className="space-y-4">
      {claims.map(claim => (
        <div
          key={claim.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-semibold">{claim.foodName}</h4>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {claim.quantity} {claim.quantityUnit} from {claim.donorName}
            </p>
            {claim.claimedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Claimed {formatDistanceToNow(new Date(claim.claimedAt), { addSuffix: true })}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/donation/${claim.id}`}>View</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}