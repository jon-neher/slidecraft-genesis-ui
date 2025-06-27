import React from 'react';
import { User, LogOut } from 'lucide-react';
import { SignedIn, SignOutButton } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const ProfileMenu = () => (
  <SignedIn>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-gray-200"
          aria-label="Open profile menu"
        >
          <User className="w-5 h-5 text-slate-gray" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white text-slate-gray">
        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center gap-2 w-full">
            <User className="w-4 h-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="flex items-center gap-2 w-full">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SignedIn>
);

export default ProfileMenu;
