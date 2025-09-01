
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { Home, Briefcase, GraduationCap, MessageCircle, User as UserIcon, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LoginWall from "./components/auth/LoginWall";
import { Skeleton } from "./components/ui/skeleton";

const navigationItems = [
  {
    title: "Feed",
    url: createPageUrl("Feed"),
    icon: Home,
  },
  {
    title: "Vagas",
    url: createPageUrl("Vagas"),
    icon: Briefcase,
  },
  {
    title: "Cursos",
    url: createPageUrl("Cursos"),
    icon: GraduationCap,
  },
  {
    title: "Mensagens",
    url: createPageUrl("Mensagens"),
    icon: MessageCircle,
  },
  {
    title: "Perfil",
    url: createPageUrl("Perfil"),
    icon: UserIcon, // Changed to UserIcon to avoid collision with User class
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user) {
          setCurrentUser(user);
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthStatus('unauthenticated');
      }
    };
    checkAuth();
  }, [location.pathname]); // Re-run auth check on path change

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <LoginWall />;
  }

  const childrenWithProps = React.cloneElement(children, { currentUser });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style>
        {`
          :root {
            --primary-blue: #1E40AF;
            --success-green: #10B981;
            --warning-orange: #F59E0B;
            --gray-50: #F8FAFC;
            --gray-100: #F1F5F9;
            --gray-200: #E2E8F0;
            --gray-300: #CBD5E1;
            --gray-400: #94A3B8;
            --gray-500: #64748B;
            --gray-600: #475569;
            --gray-700: #334155;
            --gray-800: #1E293B;
            --gray-900: #0F172A;
          }
        `}
      </style>
      
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="border-r border-gray-200 bg-white/80 backdrop-blur-md">
            <SidebarHeader className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Primeira Trilha</h2>
                  <p className="text-xs text-gray-500">Sua primeira oportunidade</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl px-4 py-3 text-sm font-medium ${
                            location.pathname === item.url 
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm' 
                              : 'text-gray-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="mt-8 px-4 py-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">Novo</Badge>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Cursos Premium</h3>
                <p className="text-xs text-gray-600 mb-3">Desenvolva suas habilidades com nossos cursos certificados</p>
                <Button 
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700 text-xs"
                  onClick={() => window.location.href = createPageUrl('CursosPremium')}
                >
                  Explorar Cursos
                </Button>
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser?.profile_image} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{currentUser?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser?.user_type}</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            {/* Header móvel */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 md:hidden sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Primeira Trilha</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Header desktop */}
            <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
              <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                  <h1 className="text-xl font-bold text-gray-900">{currentPageName}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={currentUser?.profile_image} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

            {/* Conteúdo principal */}
            <div className="flex-1 overflow-auto">
              {childrenWithProps}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
