/**
 * Admin Moderation Panel
 * Manages content moderation cases and image similarity detection
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Filter,
  Search,
  RefreshCw,
  Image as ImageIcon,
  Users,
  BarChart3
} from 'lucide-react';

interface ModerationCase {
  id: string;
  tenantId: string;
  productId?: string;
  sellerId?: string;
  caseType: string;
  status: string;
  priority: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageHash?: string;
  similarityScore?: number;
  similarityThreshold: number;
  detectedIssues: string[];
  assignedTo?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  reviewDecision?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  actionTaken?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ModerationStats {
  totalCases: number;
  pendingCases: number;
  resolvedCases: number;
  flaggedCases: number;
  averageResolutionTime: number;
  casesByType: Record<string, number>;
  casesByStatus: Record<string, number>;
  casesByPriority: Record<string, number>;
}

export default function ModerationPage() {
  const [cases, setCases] = useState<ModerationCase[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    caseType: '',
    priority: '',
    search: '',
  });
  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);
  const [reviewDecision, setReviewDecision] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Fetch moderation cases
  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.caseType) params.append('caseType', filters.caseType);
      if (filters.priority) params.append('priority', filters.priority);
      
      const response = await fetch(`/api/moderation/cases?tenantId=admin-tenant&${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCases(data.data.cases);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch moderation stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/moderation/stats?tenantId=admin-tenant');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchStats();
  }, [filters]);

  // Handle case review
  const handleReviewCase = async (caseId: string, decision: string, notes?: string) => {
    try {
      const response = await fetch(`/api/moderation/cases/${caseId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision,
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh cases
        fetchCases();
        setSelectedCase(null);
        setReviewDecision('');
        setReviewNotes('');
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle case assignment
  const handleAssignCase = async (caseId: string, moderatorId: string) => {
    try {
      const response = await fetch(`/api/moderation/cases/${caseId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moderatorId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCases();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FLAGGED': return 'bg-orange-100 text-orange-800';
      case 'RESOLVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get case type icon
  const getCaseTypeIcon = (caseType: string) => {
    switch (caseType) {
      case 'IMAGE_SIMILARITY': return <ImageIcon className="h-4 w-4" />;
      case 'CONTENT_REVIEW': return <Eye className="h-4 w-4" />;
      case 'SPAM_DETECTION': return <AlertTriangle className="h-4 w-4" />;
      case 'INAPPROPRIATE': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">Manage content moderation cases and image similarity detection</p>
        </div>
        <Button onClick={fetchCases} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{stats.totalCases}</p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingCases}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedCases}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-2xl font-bold text-red-600">{stats.flaggedCases}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="FLAGGED">Flagged</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Case Type</label>
              <Select value={filters.caseType} onValueChange={(value) => setFilters({ ...filters, caseType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="IMAGE_SIMILARITY">Image Similarity</SelectItem>
                  <SelectItem value="CONTENT_REVIEW">Content Review</SelectItem>
                  <SelectItem value="SPAM_DETECTION">Spam Detection</SelectItem>
                  <SelectItem value="INAPPROPRIATE">Inappropriate</SelectItem>
                  <SelectItem value="COPYRIGHT">Copyright</SelectItem>
                  <SelectItem value="TRADEMARK">Trademark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No moderation cases found</p>
            </CardContent>
          </Card>
        ) : (
          cases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCaseTypeIcon(case_.caseType)}
                      <h3 className="font-semibold">{case_.title || `Case ${case_.id}`}</h3>
                      <Badge className={getStatusBadgeColor(case_.status)}>
                        {case_.status}
                      </Badge>
                      <Badge className={getPriorityBadgeColor(case_.priority)}>
                        {case_.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {case_.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Type: {case_.caseType.replace('_', ' ')}</span>
                      {case_.similarityScore && (
                        <span>Similarity: {(case_.similarityScore * 100).toFixed(1)}%</span>
                      )}
                      <span>Created: {new Date(case_.createdAt).toLocaleDateString()}</span>
                      {case_.assignedTo && (
                        <span>Assigned to: {case_.assignedTo}</span>
                      )}
                    </div>
                    
                    {case_.detectedIssues.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {case_.detectedIssues.map((issue) => (
                            <Badge key={issue} variant="outline" className="text-xs">
                              {issue.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCase(case_)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Case: {selectedCase.id}</CardTitle>
              <CardDescription>
                {selectedCase.caseType.replace('_', ' ')} - {selectedCase.priority} Priority
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCase.imageUrl && (
                <div>
                  <label className="text-sm font-medium">Image</label>
                  <div className="mt-2">
                    <img
                      src={selectedCase.imageUrl}
                      alt="Case image"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCase.description || 'No description available'}
                </p>
              </div>
              
              {selectedCase.similarityScore && (
                <div>
                  <label className="text-sm font-medium">Similarity Score</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(selectedCase.similarityScore * 100).toFixed(1)}% (Threshold: {(selectedCase.similarityThreshold * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Review Decision</label>
                <Select value={reviewDecision} onValueChange={setReviewDecision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVE">Approve</SelectItem>
                    <SelectItem value="REJECT">Reject</SelectItem>
                    <SelectItem value="MODIFY">Request Modification</SelectItem>
                    <SelectItem value="ESCALATE">Escalate</SelectItem>
                    <SelectItem value="IGNORE">Ignore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                  placeholder="Add review notes..."
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCase(null);
                    setReviewDecision('');
                    setReviewNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReviewCase(selectedCase.id, reviewDecision, reviewNotes)}
                  disabled={!reviewDecision}
                >
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

