"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CircleOff,
  Command,
  Cpu,
  Database,
  Download,
  Globe,
  HardDrive,
  Hexagon,
  LineChart,
  Lock,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Terminal,
  Trash2,
  Users,
  Wifi,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [systemStatus, setSystemStatus] = useState(85)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [securityLevel, setSecurityLevel] = useState(75)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  
  // Channel management state
  const [channels, setChannels] = useState<any[]>([])
  const [voiceChannels, setVoiceChannels] = useState<any[]>([])
  const [isLoadingChannels, setIsLoadingChannels] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // User management state
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  
  // Role management state
  const [roles, setRoles] = useState<any[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  
  // Message management state
  const [messages, setMessages] = useState<any[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedChannelInfo, setSelectedChannelInfo] = useState<any>(null)
  
  // Statistics state
  const [statistics, setStatistics] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setMemoryUsage(Math.floor(Math.random() * 20) + 60)
      setNetworkStatus(Math.floor(Math.random() * 15) + 80)
      setSystemStatus(Math.floor(Math.random() * 10) + 80)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = canvas ? Math.random() * canvas.width : 0
        this.y = canvas ? Math.random() * canvas.height : 0
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (canvas) {
          if (this.x > canvas.width) this.x = 0
          if (this.x < 0) this.x = canvas.width
          if (this.y > canvas.height) this.y = 0
          if (this.y < 0) this.y = canvas.height
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Fetch channels and voice channels
  const fetchChannels = async () => {
    setIsLoadingChannels(true)
    try {
      const [channelsResponse, voiceChannelsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/channels`),
        fetch(`${API_BASE_URL}/api/voice-channels`)
      ])

      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json()
        setChannels(channelsData)
      }

      if (voiceChannelsResponse.ok) {
        const voiceChannelsData = await voiceChannelsResponse.json()
        setVoiceChannels(voiceChannelsData)
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
    } finally {
      setIsLoadingChannels(false)
    }
  }

  // Create new text channel
  const createChannel = async (name: string, description: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      if (response.ok) {
        const newChannel = await response.json()
        setChannels(prev => [...prev, newChannel])
        return { success: true, data: newChannel }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to create channel' }
    }
  }

  // Create new voice channel
  const createVoiceChannel = async (name: string, description: string, maxParticipants: number, isPrivate: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/voice-channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, maxParticipants, isPrivate }),
      })

      if (response.ok) {
        const newVoiceChannel = await response.json()
        setVoiceChannels(prev => [...prev, newVoiceChannel])
        return { success: true, data: newVoiceChannel }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to create voice channel' }
    }
  }

  // Fetch users
  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`)
      
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Fetch messages for a specific channel and open modal
  const fetchMessages = async (channelId: string) => {
    setIsLoadingMessages(true)
    setSelectedChannel(channelId)
    
    // Find channel info
    const channelInfo = channels.find(ch => ch._id === channelId)
    setSelectedChannelInfo(channelInfo)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels/${channelId}/messages`)
      
      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
        setIsMessageModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // Close message modal
  const closeMessageModal = () => {
    setIsMessageModalOpen(false)
    setSelectedChannel(null)
    setSelectedChannelInfo(null)
    setMessages([])
  }

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to delete message' }
    }
  }

  // Clear all messages in a channel
  const clearAllMessages = async (channelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels/${channelId}/messages`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessages([])
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to clear all messages' }
    }
  }

  // Delete a text channel
  const deleteChannel = async (channelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels/${channelId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChannels(prev => prev.filter(ch => ch._id !== channelId))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to delete channel' }
    }
  }

  // Delete a voice channel
  const deleteVoiceChannel = async (voiceChannelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/voice-channels/${voiceChannelId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVoiceChannels(prev => prev.filter(vc => vc._id !== voiceChannelId))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to delete voice channel' }
    }
  }

  // Fetch roles
  const fetchRoles = async () => {
    setIsLoadingRoles(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`)
      
      if (response.ok) {
        const rolesData = await response.json()
        setRoles(rolesData)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoadingRoles(false)
    }
  }

  // Create new role
  const createRole = async (name: string, description: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      if (response.ok) {
        const newRole = await response.json()
        setRoles(prev => [...prev, newRole])
        return { success: true, data: newRole }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to create role' }
    }
  }

  // Update user role
  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(prev => prev.map(user => user._id === userId ? updatedUser : user))
        return { success: true, data: updatedUser }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to update user role' }
    }
  }

  // Open role assignment modal
  const openRoleModal = (user: any) => {
    setSelectedUserForRole(user)
    setIsRoleModalOpen(true)
  }

  // Close role assignment modal
  const closeRoleModal = () => {
    setSelectedUserForRole(null)
    setIsRoleModalOpen(false)
  }

  // Fetch statistics
  const fetchStatistics = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics`)
      
      if (response.ok) {
        const statsData = await response.json()
        setStatistics(statsData)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }


  // Load channels when component mounts or when switching to channels tab
  useEffect(() => {
    if (activeTab === "channels") {
      fetchChannels()
    }
  }, [activeTab])

  // Load users and roles when switching to users tab
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
      fetchRoles()
    }
  }, [activeTab])

  // Load statistics when switching to overview tab
  useEffect(() => {
    if (activeTab === "overview") {
      fetchStatistics()
    }
  }, [activeTab])

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">SYSTEM INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Userhub Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-6">

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem 
                    icon={Activity} 
                    label="Overview" 
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                  />
                  <NavItem 
                    icon={MessageSquare} 
                    label="Channels" 
                    active={activeTab === "channels"}
                    onClick={() => setActiveTab("channels")}
                  />
                  <NavItem 
                    icon={Users} 
                    label="Users" 
                    active={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                  />
                  <NavItem 
                    icon={Shield} 
                    label="Roles" 
                    active={activeTab === "roles"}
                    onClick={() => setActiveTab("roles")}
                  />
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 lg:col-span-9">
            {activeTab === "overview" && (
              <div className="grid gap-6">
                {/* System Statistics */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                        System Overview
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={fetchStatistics}
                        disabled={isLoadingStats}
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoadingStats ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        <span className="ml-2 text-slate-400">Loading statistics...</span>
                      </div>
                    ) : statistics ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Total Users"
                          value={statistics.totalUsers}
                          icon={Users}
                          color="cyan"
                          trend="up"
                          detail="Registered users"
                        />
                        <StatCard
                          title="Online Users"
                          value={statistics.onlineUsers}
                          icon={Activity}
                          color="green"
                          trend="stable"
                          detail="Currently active"
                        />
                        <StatCard
                          title="Total Messages"
                          value={statistics.totalMessages}
                          icon={MessageSquare}
                          color="blue"
                          trend="up"
                          detail="All time messages"
                        />
                        <StatCard
                          title="Active Channels"
                          value={statistics.totalChannels}
                          icon={Radio}
                          color="purple"
                          trend="stable"
                          detail="Text & voice channels"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        No statistics available. Click refresh to load data.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Real-time Metrics */}
                {statistics && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-700/50 pb-3">
                        <CardTitle className="text-slate-100 flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                          User Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Online Users</span>
                            <span className="text-cyan-400 font-semibold">{statistics.onlineUsers}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Total Users</span>
                            <span className="text-slate-400">{statistics.totalUsers}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Active Roles</span>
                            <span className="text-slate-400">{statistics.totalRoles || 0}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(statistics.onlineUsers / statistics.totalUsers) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-500 text-center">
                            {Math.round((statistics.onlineUsers / statistics.totalUsers) * 100)}% users online
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-700/50 pb-3">
                        <CardTitle className="text-slate-100 flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5 text-cyan-500" />
                          Communication Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Total Messages</span>
                            <span className="text-cyan-400 font-semibold">{statistics.totalMessages}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Text Channels</span>
                            <span className="text-slate-400">{statistics.textChannels || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Voice Channels</span>
                            <span className="text-slate-400">{statistics.voiceChannels || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Server Status</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                              Online
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* System Status */}
                {statistics && (
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-700/50 pb-3">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Terminal className="mr-2 h-5 w-5 text-cyan-500" />
                        System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400 mb-2">
                            {formatTime(currentTime)}
                          </div>
                          <div className="text-sm text-slate-400">Current Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-2">
                            {statistics.connectedUsers || 0}
                          </div>
                          <div className="text-sm text-slate-400">Connected Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400 mb-2">
                            {statistics.totalConnections || 0}
                          </div>
                          <div className="text-sm text-slate-400">Total Connections</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {activeTab === "users" && (
              <div className="grid gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Users className="mr-2 h-5 w-5 text-cyan-500" />
                        User Management
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchUsers}
                          disabled={isLoadingUsers}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        <span className="ml-2 text-slate-400">Loading users...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {users.map((user) => (
                            <UserCard key={user._id} user={user} onAssignRole={openRoleModal} />
                          ))}
                          {users.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              No users found. Create one to get started.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "roles" && (
              <div className="grid gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                        Role Management
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchRoles}
                          disabled={isLoadingRoles}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingRoles ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                        <CreateRoleDialog onCreateRole={createRole} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoadingRoles ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        <span className="ml-2 text-slate-400">Loading roles...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {roles.map((role) => (
                            <RoleCard key={role._id} role={role} />
                          ))}
                          {roles.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              No roles found. Create one to get started.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "channels" && (
              <div className="grid gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-cyan-500" />
                        Channel Management
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchChannels}
                          disabled={isLoadingChannels}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingChannels ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Tabs defaultValue="text-channels" className="w-full">
                      <TabsList className="bg-slate-800/50 p-1 mb-6">
                        <TabsTrigger
                          value="text-channels"
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Text Channels
                        </TabsTrigger>
                        <TabsTrigger
                          value="voice-channels"
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Voice Channels
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text-channels" className="mt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-200">Text Channels</h3>
                            <CreateChannelDialog onCreateChannel={createChannel} />
                          </div>
                          
                          {isLoadingChannels ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                              <span className="ml-2 text-slate-400">Loading channels...</span>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {channels.map((channel) => (
                                <ChannelCard 
                                  key={channel._id} 
                                  channel={channel} 
                                  type="text" 
                                  onViewMessages={fetchMessages}
                                  onDeleteChannel={deleteChannel}
                                />
                              ))}
                              {channels.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                  No text channels found. Create one to get started.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="voice-channels" className="mt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-200">Voice Channels</h3>
                            <CreateVoiceChannelDialog onCreateVoiceChannel={createVoiceChannel} />
                          </div>
                          
                          {isLoadingChannels ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                              <span className="ml-2 text-slate-400">Loading voice channels...</span>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {voiceChannels.map((voiceChannel) => (
                                <ChannelCard 
                                  key={voiceChannel._id} 
                                  channel={voiceChannel} 
                                  type="voice"
                                  onDeleteVoiceChannel={deleteVoiceChannel}
                                />
                              ))}
                              {voiceChannels.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                  No voice channels found. Create one to get started.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message View Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-slate-100 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-cyan-500" />
                  {selectedChannelInfo ? `#${selectedChannelInfo.name}` : 'Channel Messages'}
                </DialogTitle>
                {selectedChannelInfo && (
                  <p className="text-sm text-slate-400 mt-1">{selectedChannelInfo.description}</p>
                )}
              </div>
              {messages.length > 0 && selectedChannel && (
                <ClearAllMessagesButton 
                  channelId={selectedChannel} 
                  onClearAll={clearAllMessages}
                  messageCount={messages.length}
                />
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <span className="ml-2 text-slate-400">Loading messages...</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {messages.length > 0 ? (
                  <div className="grid gap-3">
                    {messages.map((message) => (
                      <MessageCard key={message._id} message={message} onDelete={deleteMessage} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No messages found in this channel.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={closeMessageModal}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Assignment Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-cyan-500" />
              Assign Role to {selectedUserForRole?.username}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedUserForRole && (
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUserForRole.avatar || "/placeholder.svg?height=40&width=40"} alt={selectedUserForRole.username} />
                  <AvatarFallback className="bg-slate-700 text-cyan-500">
                    {selectedUserForRole.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-slate-200">{selectedUserForRole.username}</h4>
                  <p className="text-sm text-slate-400">Current Role: {selectedUserForRole.role || 'No Role'}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-slate-300">Select New Role</Label>
              <div className="grid gap-2">
                {roles.map((role) => (
                  <RoleSelectionCard 
                    key={role._id} 
                    role={role} 
                    isSelected={selectedUserForRole?.role === role.name}
                    onSelect={() => {
                      if (selectedUserForRole) {
                        updateUserRole(selectedUserForRole._id, role._id)
                        closeRoleModal()
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={closeRoleModal}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Component for nav items
function NavItem({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value}%
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Component for statistics cards
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Performance chart component
function PerformanceChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">100%</div>
        <div className="text-xs text-slate-500">75%</div>
        <div className="text-xs text-slate-500">50%</div>
        <div className="text-xs text-slate-500">25%</div>
        <div className="text-xs text-slate-500">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const cpuHeight = Math.floor(Math.random() * 60) + 20
          const memHeight = Math.floor(Math.random() * 40) + 40
          const netHeight = Math.floor(Math.random() * 30) + 30

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${cpuHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${memHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${netHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">00:00</div>
        <div className="text-xs text-slate-500">06:00</div>
        <div className="text-xs text-slate-500">12:00</div>
        <div className="text-xs text-slate-500">18:00</div>
        <div className="text-xs text-slate-500">24:00</div>
      </div>
    </div>
  )
}

// Process row component
function ProcessRow({
  pid,
  name,
  user,
  cpu,
  memory,
  status,
}: {
  pid: string
  name: string
  user: string
  cpu: number
  memory: number
  status: string
}) {
  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{pid}</div>
      <div className="col-span-4 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-400">{user}</div>
      <div className="col-span-2 text-cyan-400">{cpu}%</div>
      <div className="col-span-2 text-purple-400">{memory} MB</div>
      <div className="col-span-1">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
          {status}
        </Badge>
      </div>
    </div>
  )
}

// Storage item component
function StorageItem({
  name,
  total,
  used,
  type,
}: {
  name: string
  total: number
  used: number
  type: string
}) {
  const percentage = Math.round((used / total) * 100)

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">{name}</div>
        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">
          {type}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-500">
            {used} GB / {total} GB
          </div>
          <div className="text-xs text-slate-400">{percentage}%</div>
        </div>
        <Progress value={percentage} className="h-1.5 bg-slate-700">
          <div
            className={`h-full rounded-full ${
              percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-amber-500" : "bg-cyan-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="text-slate-500">Free: {total - used} GB</div>
        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-slate-400 hover:text-slate-100">
          Details
        </Button>
      </div>
    </div>
  )
}

// Alert item component
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: Check, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Communication item component
function CommunicationItem({
  sender,
  time,
  message,
  avatar,
  unread,
}: {
  sender: string
  time: string
  message: string
  avatar: string
  unread?: boolean
}) {
  return (
    <div className={`flex space-x-3 p-2 rounded-md ${unread ? "bg-slate-800/50 border border-slate-700/50" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">{sender.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{message}</div>
      </div>
      {unread && (
        <div className="flex-shrink-0 self-center">
          <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
        </div>
      )}
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Channel creation dialog for text channels
function CreateChannelDialog({ onCreateChannel }: { onCreateChannel: (name: string, description: string) => Promise<any> }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Channel name is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await onCreateChannel(name.trim(), description.trim())
      if (result.success) {
        setName("")
        setDescription("")
        setOpen(false)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to create channel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Create Text Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="channel-name" className="text-slate-300">Channel Name</Label>
            <Input
              id="channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., announcements"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="channel-description" className="text-slate-300">Description</Label>
            <Textarea
              id="channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for the channel"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Channel creation dialog for voice channels
function CreateVoiceChannelDialog({ onCreateVoiceChannel }: { onCreateVoiceChannel: (name: string, description: string, maxParticipants: number, isPrivate: boolean) => Promise<any> }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Voice channel name is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await onCreateVoiceChannel(name.trim(), description.trim(), maxParticipants, isPrivate)
      if (result.success) {
        setName("")
        setDescription("")
        setMaxParticipants(10)
        setIsPrivate(false)
        setOpen(false)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to create voice channel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Voice Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Create Voice Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="voice-channel-name" className="text-slate-300">Channel Name</Label>
            <Input
              id="voice-channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., VOICE_CALL_#4*"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="voice-channel-description" className="text-slate-300">Description</Label>
            <Textarea
              id="voice-channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for the voice channel"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="max-participants" className="text-slate-300">Max Participants</Label>
            <Input
              id="max-participants"
              type="number"
              min="1"
              max="50"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 10)}
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isLoading}
            />
            <Label htmlFor="is-private" className="text-slate-300">Private Channel</Label>
          </div>
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Voice Channel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Channel card component
function ChannelCard({ channel, type, onViewMessages, onDeleteChannel, onDeleteVoiceChannel }: { 
  channel: any; 
  type: "text" | "voice"; 
  onViewMessages?: (channelId: string) => void;
  onDeleteChannel?: (channelId: string) => Promise<any>;
  onDeleteVoiceChannel?: (voiceChannelId: string) => Promise<any>;
}) {
  const isTextChannel = type === "text"
  const Icon = isTextChannel ? MessageSquare : Mic
  const iconColor = isTextChannel ? "text-cyan-500" : "text-purple-500"

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg bg-slate-700/50 ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-200 mb-1">
              {isTextChannel ? `#${channel.name}` : channel.name}
            </h4>
            <p className="text-sm text-slate-400 mb-2">{channel.description}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Created: {new Date(channel.createdAt).toLocaleDateString()}</span>
              {isTextChannel ? (
                <span>Messages: {channel.messageCount || 0}</span>
              ) : (
                <span>Participants: {channel.participantCount || 0}/{channel.maxParticipants}</span>
              )}
              {!isTextChannel && channel.isPrivate && (
                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                  Private
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isTextChannel && onViewMessages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMessages(channel._id)}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
          )}
          <DeleteChannelButton
            channel={channel}
            type={type}
            onDeleteChannel={onDeleteChannel}
            onDeleteVoiceChannel={onDeleteVoiceChannel}
          />
          <Badge 
            variant="outline" 
            className={`${channel.isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
          >
            {channel.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Delete channel button component
function DeleteChannelButton({ channel, type, onDeleteChannel, onDeleteVoiceChannel }: { 
  channel: any; 
  type: "text" | "voice"; 
  onDeleteChannel?: (channelId: string) => Promise<any>;
  onDeleteVoiceChannel?: (voiceChannelId: string) => Promise<any>;
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const channelType = type === "text" ? "text channel" : "voice channel"
    const confirmMessage = `Are you sure you want to delete the ${channelType} "${channel.name}"? This action cannot be undone and will also delete all messages in this channel.`
    
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true)
      try {
        let result
        if (type === "text" && onDeleteChannel) {
          result = await onDeleteChannel(channel._id)
        } else if (type === "voice" && onDeleteVoiceChannel) {
          result = await onDeleteVoiceChannel(channel._id)
        }
        
        if (result && !result.success) {
          alert(result.error || `Failed to delete ${channelType}`)
        }
      } catch (error) {
        alert(`Failed to delete ${channelType}`)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

// Clear all messages button component
function ClearAllMessagesButton({ channelId, onClearAll, messageCount }: { channelId: string; onClearAll: (channelId: string) => Promise<any>; messageCount: number }) {
  const [isClearing, setIsClearing] = useState(false)

  const handleClearAll = async () => {
    const confirmMessage = `Are you sure you want to delete all ${messageCount} messages in this channel? This action cannot be undone.`
    
    if (window.confirm(confirmMessage)) {
      setIsClearing(true)
      try {
        const result = await onClearAll(channelId)
        if (!result.success) {
          alert(result.error || 'Failed to clear all messages')
        }
      } catch (error) {
        alert('Failed to clear all messages')
      } finally {
        setIsClearing(false)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClearAll}
      disabled={isClearing}
      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isClearing ? 'Clearing...' : `Clear All (${messageCount})`}
    </Button>
  )
}

// Message card component
function MessageCard({ message, onDelete }: { message: any; onDelete: (messageId: string) => Promise<any> }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setIsDeleting(true)
      try {
        const result = await onDelete(message._id)
        if (!result.success) {
          alert(result.error || 'Failed to delete message')
        }
      } catch (error) {
        alert('Failed to delete message')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user?.avatar || "/placeholder.svg?height=32&width=32"} alt={message.user?.username} />
            <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs">
              {message.user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-slate-200 text-sm">{message.user?.username || 'Unknown User'}</h4>
              <span className="text-xs text-slate-500">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-2">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="text-xs text-slate-400">
                {message.attachments.length} attachment(s)
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// User card component
function UserCard({ user, onAssignRole }: { user: any; onAssignRole?: (user: any) => void }) {
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'moderator':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'user':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/10 text-green-400 border-green-500/30' 
      : 'bg-red-500/10 text-red-400 border-red-500/30'
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.username} />
            <AvatarFallback className="bg-slate-700 text-cyan-500">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-200 mb-1">{user.username}</h4>
            <p className="text-sm text-slate-400 mb-2">{user.email}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onAssignRole && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignRole(user)}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          <Badge 
            variant="outline" 
            className={getRoleColor(user.role)}
          >
            {user.role || 'User'}
          </Badge>
          <Badge 
            variant="outline" 
            className={getStatusColor(user.isActive !== false)}
          >
            {user.isActive !== false ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </div>
  )
}


// Role card component
function RoleCard({ role }: { role: any }) {
  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'moderator':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'user':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <Shield className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-200 mb-1">{role.name}</h4>
            <p className="text-sm text-slate-400 mb-2">{role.description}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={getRoleColor(role.name)}
          >
            {role.name}
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Create role dialog
function CreateRoleDialog({ onCreateRole }: { onCreateRole: (name: string, description: string) => Promise<any> }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Role name is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await onCreateRole(name.trim(), description.trim())
      if (result.success) {
        setName("")
        setDescription("")
        setOpen(false)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to create role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Create New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role-name" className="text-slate-300">Role Name</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Moderator"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="role-description" className="text-slate-300">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for the role"
              className="bg-slate-800 border-slate-600 text-slate-100"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Role selection card component
function RoleSelectionCard({ role, isSelected, onSelect }: { role: any; isSelected: boolean; onSelect: () => void }) {
  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'moderator':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'user':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-cyan-500/10 border-cyan-500/50' 
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-4 w-4 text-cyan-500" />
          <div>
            <h4 className="font-semibold text-slate-200">{role.name}</h4>
            <p className="text-sm text-slate-400">{role.description}</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={getRoleColor(role.name)}
        >
          {role.name}
        </Badge>
      </div>
    </div>
  )
}

// Add missing imports
function Info(props: any) {
  return <AlertCircle {...props} />
}

function Check(props: any) {
  return <Shield {...props} />
}
