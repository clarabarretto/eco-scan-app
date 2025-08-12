import { NavLink, useLocation } from "react-router-dom"
import { Home, BarChart3, Camera, Trophy, Leaf, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Classificar", url: "/", icon: Camera, description: "Upload e classificação" },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3, description: "Histórico e estatísticas" },
  { title: "Conquistas", url: "/achievements", icon: Trophy, description: "Badges e pontuação" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-secondary/20 text-secondary font-medium border-r-2 border-secondary" : "hover:bg-muted/50 hover:text-secondary"

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-secondary" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-foreground">EcoClassify</h2>
                <p className="text-xs text-muted-foreground">IA Sustentável</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">
            {!isCollapsed ? "Navegação" : "Nav"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats Preview - only when expanded */}
        {!isCollapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-4 border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Eco Score</span>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {localStorage.getItem('eco-points') || '0'}
              </p>
              <p className="text-xs text-muted-foreground">pontos verdes</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}