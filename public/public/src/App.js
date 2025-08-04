import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Star,
  Target,
  BarChart3,
  PieChart,
  FileText,
  Send,
  CheckCircle,
  Wifi,
  WifiOff,
  Download,
  Bell
} from 'lucide-react';

const DroneBusinessPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Sample data with localStorage persistence
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('droneClients');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: "Sunset Realty",
          email: "contact@sunsetrealty.com",
          phone: "(555) 123-4567",
          status: "active",
          totalRevenue: 2500,
          projects: 3
        },
        {
          id: 2,
          name: "Mountain View Weddings",
          email: "info@mvweddings.com",
          phone: "(555) 987-6543",
          status: "active",
          totalRevenue: 1800,
          projects: 2
        }
      ];
    } catch {
      return [
        {
          id: 1,
          name: "Sunset Realty",
          email: "contact@sunsetrealty.com",
          phone: "(555) 123-4567",
          status: "active",
          totalRevenue: 2500,
          projects: 3
        }
      ];
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('droneProjects');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: "Luxury Home Showcase",
          client: "Sunset Realty",
          date: "2025-08-15",
          status: "completed",
          price: 800,
          location: "Beverly Hills, CA",
          duration: "2 hours",
          type: "Real Estate"
        },
        {
          id: 2,
          title: "Wedding Ceremony Aerial",
          client: "Mountain View Weddings",
          date: "2025-08-20",
          status: "scheduled",
          price: 1200,
          location: "Napa Valley, CA",
          duration: "4 hours",
          type: "Wedding"
        }
      ];
    } catch {
      return [
        {
          id: 1,
          title: "Luxury Home Showcase",
          client: "Sunset Realty",
          date: "2025-08-15",
          status: "completed",
          price: 800,
          location: "Beverly Hills, CA",
          duration: "2 hours",
          type: "Real Estate"
        }
      ];
    }
  });

  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [pricingInputs, setPricingInputs] = useState({
    projectType: 'real-estate',
    duration: 2,
    location: 'local',
    editingLevel: 'basic'
  });

  // PWA Setup Effects
  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode (installed as PWA)');
    }

    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('droneClients', JSON.stringify(clients));
    } catch (error) {
      console.log('Could not save clients to localStorage');
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('droneProjects', JSON.stringify(projects));
    } catch (error) {
      console.log('Could not save projects to localStorage');
    }
  }, [projects]);

  // PWA Functions
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        new Notification('SkyView Business', {
          body: 'Notifications enabled! You\'ll get reminders for upcoming shoots.',
        });
      }
    }
  };

  const scheduleNotification = (title, message, delay = 5000) => {
    if (notificationsEnabled && 'Notification' in window) {
      setTimeout(() => {
        new Notification(title, {
          body: message,
        });
      }, delay);
    }
  };

  // Calculate dashboard metrics
  const totalRevenue = projects.reduce((sum, project) => sum + project.price, 0);
  const monthlyRevenue = totalRevenue; // Simplified for demo
  const totalClients = clients.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  // Pricing calculator logic
  const calculatePrice = () => {
    let basePrice = 0;
    
    switch(pricingInputs.projectType) {
      case 'real-estate': basePrice = 300; break;
      case 'wedding': basePrice = 800; break;
      case 'commercial': basePrice = 1200; break;
      case 'event': basePrice = 600; break;
      default: basePrice = 400;
    }

    const durationMultiplier = pricingInputs.duration * 50;
    const locationMultiplier = pricingInputs.location === 'remote' ? 1.5 : 1;
    const editingMultiplier = pricingInputs.editingLevel === 'premium' ? 1.8 : 
                             pricingInputs.editingLevel === 'standard' ? 1.4 : 1;

    return Math.round((basePrice + durationMultiplier) * locationMultiplier * editingMultiplier);
  };

  const addClient = (clientData) => {
    const newClient = {
      id: clients.length + 1,
      ...clientData,
      status: 'active',
      totalRevenue: 0,
      projects: 0
    };
    setClients([...clients, newClient]);
    setShowNewClientForm(false);
    scheduleNotification('New Client Added!', `${clientData.name} has been added to your client list.`);
  };

  const addProject = (projectData) => {
    const newProject = {
      id: projects.length + 1,
      ...projectData,
      status: 'scheduled'
    };
    setProjects([...projects, newProject]);
    setShowNewProjectForm(false);
    scheduleNotification('Project Scheduled!', `${projectData.title} has been added to your schedule.`);
  };

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${color}`}>
              <TrendingUp size={16} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'text-green-600' ? 'from-green-100 to-green-200' : 'from-blue-100 to-purple-200'}`}>
          <Icon size={24} className={color === 'text-green-600' ? 'text-green-600' : 'text-blue-600'} />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Business Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNewClientForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            <span>New Client</span>
          </button>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="+23% from last month"
          color="text-green-600"
        />
        <StatCard
          icon={Users}
          title="Active Clients"
          value={totalClients}
          change="+2 new this month"
          color="text-blue-600"
        />
        <StatCard
          icon={Camera}
          title="Projects Completed"
          value={completedProjects}
          change="+5 this month"
          color="text-purple-600"
        />
        <StatCard
          icon={Target}
          title="Goal Progress"
          value={`${Math.round((totalRevenue / 10000) * 100)}%`}
          change={`$${totalRevenue} / $10,000`}
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-800">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.client} • {project.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${project.price}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Growth</h3>
          <div className="h-48 flex items-end justify-around bg-gradient-to-t from-blue-50 to-transparent rounded-xl p-4">
            {[1200, 1800, 2400, 3200, 4200].map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg w-8"
                  style={{ height: `${(value / 4200) * 120}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">M{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{client.name}</h3>
                <p className="text-gray-600">{client.email}</p>
                <p className="text-gray-600">{client.phone}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                {client.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="font-bold text-green-600">${client.totalRevenue}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Projects</p>
                <p className="font-bold text-blue-600">{client.projects}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'completed' ? 'bg-green-100 text-green-600' : 
                    project.status === 'scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{project.duration}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${project.price}</p>
                <p className="text-sm text-gray-600">{project.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Smart Pricing Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Project Details</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select
                value={pricingInputs.projectType}
                onChange={(e) => setPricingInputs({...pricingInputs, projectType: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="real-estate">Real Estate</option>
                <option value="wedding">Wedding</option>
                <option value="commercial">Commercial</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="range"
                min="1"
                max="8"
                value={pricingInputs.duration}
                onChange={(e) => setPricingInputs({...pricingInputs, duration: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>1hr</span>
                <span className="font-medium">{pricingInputs.duration}hrs</span>
                <span>8hrs</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPricingInputs({...pricingInputs, location: 'local'})}
                  className={`p-3 rounded-xl border transition-all ${
                    pricingInputs.location === 'local' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Local (0-50mi)
                </button>
                <button
                  onClick={() => setPricingInputs({...pricingInputs, location: 'remote'})}
                  className={`p-3 rounded-xl border transition-all ${
                    pricingInputs.location === 'remote' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Remote (50mi+)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Editing Level</label>
              <div className="space-y-2">
                {['basic', 'standard', 'premium'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPricingInputs({...pricingInputs, editingLevel: level})}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      pricingInputs.editingLevel === level 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium capitalize">{level}</span>
                    <span className="text-sm text-gray-600 block">
                      {level === 'basic' && 'Raw footage + basic cuts'}
                      {level === 'standard' && 'Color correction + music'}
                      {level === 'premium' && 'Full post-production + effects'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Pricing Breakdown</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span>Base Rate ({pricingInputs.projectType})</span>
              <span>$300</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Duration ({pricingInputs.duration}hrs)</span>
              <span>${pricingInputs.duration * 50}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Location ({pricingInputs.location})</span>
              <span>{pricingInputs.location === 'remote' ? '+50%' : 'Standard'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Editing ({pricingInputs.editingLevel})</span>
              <span>
                {pricingInputs.editingLevel === 'premium' ? '+80%' : 
                 pricingInputs.editingLevel === 'standard' ? '+40%' : 'Standard'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-2">Recommended Price</p>
            <p className="text-4xl font-bold text-gray-800">${calculatePrice()}</p>
            <button 
              onClick={() => scheduleNotification('Quote Ready!', `${calculatePrice()} quote generated for ${pricingInputs.projectType} project.`)}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
            >
              Create Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">PWA Settings & Business</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">PWA Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                {isOnline ? <Wifi className="text-green-600" size={20} /> : <WifiOff className="text-red-600" size={20} />}
                <div>
                  <p className="font-medium">Connection Status</p>
                  <p className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline - Data cached locally'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Bell className={notificationsEnabled ? "text-blue-600" : "text-gray-400"} size={20} />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">{notificationsEnabled ? 'Enabled' : 'Click to enable'}</p>
                </div>
              </div>
              {!notificationsEnabled && (
                <button
                  onClick={requestNotificationPermission}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Enable
                </button>
              )}
            </div>

            {showInstallPrompt && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center space-x-3">
                  <Download className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-blue-800">Install App</p>
                    <p className="text-sm text-blue-600">Add to home screen for better experience</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  Install
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Business Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input 
                type="text" 
                defaultValue="SkyView Drone Services"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                defaultValue="contact@skyviewdrones.com"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue Goal</label>
              <input 
                type="number" 
                defaultValue="10000"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Growth Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800">Social Media Marketing</h4>
              <p className="text-sm text-blue-600 mt-1">Post stunning aerial shots daily on Instagram and TikTok</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-800">Real Estate Partnerships</h4>
              <p className="text-sm text-green-600 mt-1">Partner with local realtors for consistent bookings</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <h4 className="font-semibold text-purple-800">Premium Packages</h4>
              <p className="text-sm text-purple-600 mt-1">Offer full video production with same-day delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const NewClientModal = () => showNewClientForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Client</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addClient({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
          });
        }}>
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Client Name"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowNewClientForm(false)}
              className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const NewProjectModal = () => showNewProjectForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Project</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addProject({
            title: formData.get('title'),
            client: formData.get('client'),
            date: formData.get('date'),
            price: parseInt(formData.get('price')),
            location: formData.get('location'),
            duration: formData.get('duration'),
            type: formData.get('type')
          });
        }}>
          <div className="space-y-4">
            <input
              name="title"
              type="text"
              placeholder="Project Title"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="client"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.name}>{client.name}</option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="price"
              type="number"
              placeholder="Price ($)"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="location"
              type="text"
              placeholder="Location"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="duration"
              type="text"
              placeholder="Duration (e.g., 2 hours)"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="type"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Project Type</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Wedding">Wedding</option>
              <option value="Commercial">Commercial</option>
              <option value="Event">Event</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowNewProjectForm(false)}
              className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* PWA Install Banner */}
      {showInstallPrompt && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center relative">
          <p className="text-sm">📱 Install SkyView Business as an app for the best experience!</p>
          <button
            onClick={handleInstallClick}
            className="ml-2 bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Install Now
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <Camera className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SkyView Business</h1>
                <p className="text-sm text-gray-600">Drone Videography PWA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="text-green-600" size={16} />
                ) : (
                  <WifiOff className="text-red-600" size={16} />
                )}
                <span className="text-xs text-gray-600 hidden sm:block">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Goal Progress */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Monthly Goal Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalRevenue / 10000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ${totalRevenue} / $10K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-2 mb-8 bg-white p-2 rounded-2xl shadow-sm w-fit">
          <TabButton
            id="dashboard"
            icon={BarChart3}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={setActiveTab}
          />
          <TabButton
            id="clients"
            icon={Users}
            label="Clients"
            isActive={activeTab === 'clients'}
            onClick={setActiveTab}
          />
          <TabButton
            id="projects"
            icon={Camera}
            label="Projects"
            isActive={activeTab === 'projects'}
            onClick={setActiveTab}
          />
          <TabButton
            id="pricing"
            icon={DollarSign}
            label="Pricing"
            isActive={activeTab === 'pricing'}
            onClick={setActiveTab}
          />
          <TabButton
            id="settings"
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={setActiveTab}
          />
        </nav>

        {/* Main Content */}
        <main>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'pricing' && renderPricing()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Modals */}
      <NewClientModal />
      <NewProjectModal />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-3">
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          title="Quick Add Project"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => scheduleNotification('Analytics Update', 'Your business analytics have been updated!')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          title="Test Notifications"
        >
          <TrendingUp size={24} />
        </button>
      </div>

      {/* PWA Success Messages */}
      {notificationsEnabled && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 animate-pulse">
          <CheckCircle size={20} />
          <span>PWA Ready! 📱</span>
        </div>
      )}
    </div>
  );
};

export default DroneBusinessPlatform;
