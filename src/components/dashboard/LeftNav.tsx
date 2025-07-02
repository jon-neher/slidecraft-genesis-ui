
import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Settings, Sparkles, X, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger, 
  useSidebar 
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

const navigationItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard', active: true },
  { title: 'Integrations', icon: Plug, url: '/integrations' },
  { title: 'Projects', icon: FileText, url: '/dashboard/projects' },
  { title: 'Templates', icon: FileText, url: '/dashboard/templates' },
  { title: 'Settings', icon: Settings, url: '/dashboard/settings' },
];

const LeftNav = () => {
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();

  // Add swipe-to-close gesture for mobile
  const swipeRef = useTouchGestures<HTMLDivElement>({
    onSwipeLeft: () => {
      if (isMobile && openMobile) {
        setOpenMobile(false);
      }
    }
  });

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && openMobile) {
        setOpenMobile(false);
      }
    };

    if (isMobile && openMobile) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobile, openMobile, setOpenMobile]);

  return (
    <Sidebar 
      className="border-sidebar-border bg-sidebar" 
      ref={swipeRef}
      collapsible="offcanvas"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-electric-indigo to-neon-mint rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-sidebar-foreground">Threadline</span>
          </motion.div>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8 hover:bg-sidebar-accent text-sidebar-foreground"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
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
                  isActive={item.active}
                  className="w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200"
                  onClick={() => {
                    if (isMobile) {
                      setOpenMobile(false);
                    }
                  }}
                >
                  <a href={item.url} className="flex items-center gap-3">
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
