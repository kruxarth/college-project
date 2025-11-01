import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2,
  Activity,
  Settings 
} from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileQuickViewProps {
  user: UserType;
  onEdit: () => void;
  onViewActivity: () => void;
  onViewSettings: () => void;
}

export const ProfileQuickView: React.FC<ProfileQuickViewProps> = ({
  user,
  onEdit,
  onViewActivity,
  onViewSettings
}) => {
  return (
    <Card className="md:hidden mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          </div>
          <Button size="sm" onClick={onEdit} className="gap-1">
            <Edit2 className="h-3 w-3" />
            Edit
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{user.address}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={onViewActivity} className="flex-1 gap-1">
            <Activity className="h-3 w-3" />
            Activity
          </Button>
          <Button size="sm" variant="outline" onClick={onViewSettings} className="flex-1 gap-1">
            <Settings className="h-3 w-3" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};