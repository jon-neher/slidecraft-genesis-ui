import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const UserProfileCard = () => {
  const { user } = useUser();
  if (!user) return null;

  const initials = user.firstName?.charAt(0) ?? 'U';

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6 flex items-center gap-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'User'} />
          <AvatarFallback className="bg-electric-indigo text-ice-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-gray">{user.fullName}</p>
          <p className="text-sm text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
