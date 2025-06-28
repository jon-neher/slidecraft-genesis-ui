import React from 'react';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfileMenu = () => {
  const { user } = useUser();
  if (!user) return null;

  const initials = user.firstName?.charAt(0) ?? 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-50">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'User'} />
            <AvatarFallback className="bg-electric-indigo text-ice-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 w-56">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium text-slate-gray">{user.fullName}</p>
          <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full text-slate-gray hover:bg-gray-50">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="w-full text-left text-slate-gray">Log Out</button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
