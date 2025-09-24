'use client';

import { useState } from 'react';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Bars3Icon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  key: string;
  type: 'software' | 'business' | 'marketing' | 'support';
  status: 'active' | 'paused' | 'completed';
  lead: string;
  team: string[];
  progress: number;
  lastUpdated: string;
  issues: {
    total: number;
    open: number;
    inProgress: number;
    done: number;
  };
}

interface Issue {
  id: string;
  key: string;
  summary: string;
  type: 'story' | 'bug' | 'task' | 'epic';
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  status: 'to-do' | 'in-progress' | 'in-review' | 'done';
  assignee: string;
  reporter: string;
  created: string;
  updated: string;
  labels: string[];
  sprint: string;
}

export default function AtlassianPage() {
  const [activeView, setActiveView] = useState<'projects' | 'issues' | 'boards' | 'reports'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: '1',
      name: 'TDC Market Platform',
      key: 'TMP',
      type: 'software',
      status: 'active',
      lead: 'Ahmet Yılmaz',
      team: ['Ahmet Yılmaz', 'Ayşe Kaya', 'Mehmet Demir'],
      progress: 75,
      lastUpdated: '2 saat önce',
      issues: { total: 24, open: 8, inProgress: 12, done: 4 }
    },
    {
      id: '2',
      name: 'Satıcı Onboarding',
      key: 'SOB',
      type: 'business',
      status: 'active',
      lead: 'Fatma Özkan',
      team: ['Fatma Özkan', 'Ali Veli'],
      progress: 60,
      lastUpdated: '1 gün önce',
      issues: { total: 15, open: 5, inProgress: 7, done: 3 }
    },
    {
      id: '3',
      name: 'Q4 Marketing Campaign',
      key: 'Q4M',
      type: 'marketing',
      status: 'active',
      lead: 'Zeynep Arslan',
      team: ['Zeynep Arslan', 'Can Yılmaz'],
      progress: 40,
      lastUpdated: '3 saat önce',
      issues: { total: 18, open: 10, inProgress: 6, done: 2 }
    },
    {
      id: '4',
      name: 'Customer Support',
      key: 'CSP',
      type: 'support',
      status: 'active',
      lead: 'Emre Kılıç',
      team: ['Emre Kılıç', 'Selin Yıldız', 'Burak Öz'],
      progress: 85,
      lastUpdated: '30 dakika önce',
      issues: { total: 32, open: 12, inProgress: 15, done: 5 }
    }
  ];

  const issues: Issue[] = [
    {
      id: '1',
      key: 'TMP-123',
      summary: 'Satıcı dashboard performans optimizasyonu',
      type: 'story',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Ahmet Yılmaz',
      reporter: 'Ayşe Kaya',
      created: '2 gün önce',
      updated: '1 saat önce',
      labels: ['performance', 'frontend'],
      sprint: 'Sprint 12'
    },
    {
      id: '2',
      key: 'TMP-124',
      summary: 'Ödeme sistemi entegrasyonu hatası',
      type: 'bug',
      priority: 'highest',
      status: 'to-do',
      assignee: 'Mehmet Demir',
      reporter: 'Fatma Özkan',
      created: '1 gün önce',
      updated: '1 gün önce',
      labels: ['bug', 'payment', 'critical'],
      sprint: 'Sprint 12'
    },
    {
      id: '3',
      key: 'SOB-45',
      summary: 'Satıcı başvuru formu validasyonu',
      type: 'task',
      priority: 'medium',
      status: 'done',
      assignee: 'Ali Veli',
      reporter: 'Fatma Özkan',
      created: '3 gün önce',
      updated: '2 saat önce',
      labels: ['form', 'validation'],
      sprint: 'Sprint 11'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'to-do': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'in-review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'highest': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      case 'lowest': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return '📖';
      case 'bug': return '🐛';
      case 'task': return '✅';
      case 'epic': return '🎯';
      case 'software': return '💻';
      case 'business': return '💼';
      case 'marketing': return '📢';
      case 'support': return '🎧';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">TDC Market Workspace</h1>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Software
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Business
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <BellIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <CogIcon className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveView('projects')}
              className={`px-3 py-2 rounded-lg font-medium ${
                activeView === 'projects' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveView('issues')}
              className={`px-3 py-2 rounded-lg font-medium ${
                activeView === 'issues' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveView('boards')}
              className={`px-3 py-2 rounded-lg font-medium ${
                activeView === 'boards' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Boards
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-3 py-2 rounded-lg font-medium ${
                activeView === 'reports' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reports
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'projects' && (
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ListBulletIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <UserGroupIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getTypeIcon(project.type)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                            <span className="text-sm text-gray-500">({project.key})</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Lead: {project.lead}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <UserGroupIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{project.team.length} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">Updated {project.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Progress</div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Issues</div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.issues.open} open, {project.issues.done} done
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <ChevronDownIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'issues' && (
          <div className="space-y-6">
            {/* Issues Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">To Do</p>
                    <p className="text-2xl font-bold text-gray-900">35</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">28</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ArrowPathIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Review</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Done</p>
                    <p className="text-2xl font-bold text-gray-900">14</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Issues List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Issues</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                      All Issues
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      My Issues
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg">{getTypeIcon(issue.type)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{issue.key}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                              {issue.status.replace('-', ' ')}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                              {issue.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{issue.summary}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Assignee:</span>
                              <span className="text-sm font-medium text-gray-900">{issue.assignee}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Sprint:</span>
                              <span className="text-sm text-gray-900">{issue.sprint}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Updated:</span>
                              <span className="text-sm text-gray-900">{issue.updated}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {issue.labels.map((label, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <PauseIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'boards' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kanban Boards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">To Do</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm">📖</span>
                        <span className="text-sm font-medium">TMP-123</span>
                      </div>
                      <p className="text-sm text-gray-600">Satıcı dashboard performans optimizasyonu</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">In Progress</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm">🐛</span>
                        <span className="text-sm font-medium">TMP-124</span>
                      </div>
                      <p className="text-sm text-gray-600">Ödeme sistemi entegrasyonu hatası</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Done</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm">✅</span>
                        <span className="text-sm font-medium">SOB-45</span>
                      </div>
                      <p className="text-sm text-gray-600">Satıcı başvuru formu validasyonu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports & Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Velocity Chart</h3>
                  <div className="h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Velocity Chart Placeholder</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Burndown Chart</h3>
                  <div className="h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Burndown Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
