
import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Settings, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const navigationItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard', active: true },
  { title: 'Projects', icon: FileText, url: '/dashboard/projects' },
  { title: 'Templates', icon: FileText, url: '/dashboard/templates' },
  { title: 'Settings', icon: Settings, url: '/dashboard/settings' },
];

const LeftNav = () => {
  const isMobile = useIsMobile();

  return (
    <Sidebar className="w-60 border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 bg-electric-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-gray">Threadline</span>
        </motion.div>
        {isMobile && (
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Menu className="w-5 h-5" />
            </Button>
          </SidebarTrigger>
        )}
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'bg-electric-indigo text-white shadow-lg' 
                      : 'text-slate-gray hover:bg-gray-100 hover:text-electric-indigo'
                  }`}
                >
                  <a href={item.url}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default LeftNav;
