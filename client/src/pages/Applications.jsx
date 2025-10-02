import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import apiService from '../utils/apiService';

const statusOptions = [
  { key: 'under_review', label: 'Under Review', icon: ClockIcon, color: 'yellow' },
  { key: 'approved', label: 'Approved', icon: CheckCircleIcon, color: 'green' },
  { key: 'rejected', label: 'Rejected', icon: XCircleIcon, color: 'red' },
  { key: 'withdrawn', label: 'Withdrawn', icon: ExclamationTriangleIcon, color: 'gray' },
];

export default function Applications() {
  const [tab, setTab] = useState('my');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noteMap, setNoteMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Mock data for development
  const mockApplications = {
    my: [
      {
        _id: '1',
        propertyId: { title: 'Modern Downtown Apartment', _id: 'prop1' },
        status: 'under_review',
        applicantEmail: 'john.doe@example.com',
        personalInfo: {
          fullName: 'John Doe',
          phone: '+1 (555) 123-4567',
          age: 28,
          occupation: 'Software Engineer',
          annualIncome: 85000
        },
        coverLetter: 'I am very interested in this apartment. I have been working as a software engineer for 5 years and have excellent references.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        documents: ['resume.pdf', 'income_verification.pdf']
      },
      {
        _id: '2',
        propertyId: { title: 'Luxury Villa with Pool', _id: 'prop2' },
        status: 'approved',
        applicantEmail: 'jane.smith@example.com',
        personalInfo: {
          fullName: 'Jane Smith',
          phone: '+1 (555) 987-6543',
          age: 34,
          occupation: 'Marketing Director',
          annualIncome: 120000
        },
        coverLetter: 'Looking for a family home with excellent amenities. We are ready to move in immediately.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        documents: ['application.pdf', 'credit_report.pdf', 'references.pdf']
      }
    ],
    received: [
      {
        _id: '3',
        propertyId: { title: 'Cozy Studio Apartment', _id: 'prop3' },
        status: 'under_review',
        applicantEmail: 'mike.wilson@example.com',
        personalInfo: {
          fullName: 'Mike Wilson',
          phone: '+1 (555) 456-7890',
          age: 25,
          occupation: 'Graphic Designer',
          annualIncome: 55000
        },
        coverLetter: 'Recent graduate looking for a quiet place to live and work from home. Non-smoker, no pets.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        documents: ['portfolio.pdf', 'bank_statement.pdf']
      },
      {
        _id: '4',
        propertyId: { title: 'Family House with Garden', _id: 'prop4' },
        status: 'approved',
        applicantEmail: 'sarah.johnson@example.com',
        personalInfo: {
          fullName: 'Sarah Johnson',
          phone: '+1 (555) 321-0987',
          age: 31,
          occupation: 'Nurse',
          annualIncome: 75000
        },
        coverLetter: 'Family of 4 looking for a long-term rental. Excellent rental history and references available.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        documents: ['family_application.pdf', 'employment_letter.pdf', 'references.pdf'],
        landlordNotes: 'Excellent candidate, approved for immediate move-in.'
      }
    ]
  };

  const load = async (which) => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load from API first
      try {
        const res = which === 'my' 
          ? await apiService.applications.getUserApplications() 
          : await apiService.applications.getPropertyApplications();
        setItems(res.applications || []);
      } catch (apiError) {
        // If API fails, use mock data
        console.log('API failed, using mock data');
        setItems(mockApplications[which] || []);
      }
    } catch (e) {
      setError(e.message || 'Failed to load applications');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]);

  const updateStatus = async (id) => {
    try {
      const status = statusMap[id];
      const notes = noteMap[id];
      if (!status) return;
      
      await apiService.applications.updateStatus(id, status, notes);
      setNoteMap(prev => ({ ...prev, [id]: '' }));
      setStatusMap(prev => ({ ...prev, [id]: '' }));
      load(tab);
    } catch {
      // Update mock data locally
      setItems(prev => prev.map(item => 
        item._id === id 
          ? { 
              ...item, 
              status: status,
              landlordNotes: notes,
              updatedAt: new Date().toISOString()
            } 
          : item
      ));
      setNoteMap(prev => ({ ...prev, [id]: '' }));
      setStatusMap(prev => ({ ...prev, [id]: '' }));
    }
  };

  const getStatusConfig = (status) => {
    const config = statusOptions.find(s => s.key === status) || statusOptions[0];
    const colors = {
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };
    return { ...config, colors: colors[config.color] };
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const appDate = new Date(date);
    const diffInHours = Math.floor((now - appDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return appDate.toLocaleDateString();
  };

  const filteredItems = items.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchTerm && !item.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: items.length,
    under_review: items.filter(i => i.status === 'under_review').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    withdrawn: items.filter(i => i.status === 'withdrawn').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                <p className="text-gray-600">Manage rental applications and tenant screening</p>
              </div>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <button
                onClick={() => setTab('my')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  tab === 'my'
                    ? 'bg-white text-blue-700 shadow-lg border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserIcon className="w-5 h-5 mr-2" />
                My Applications ({mockApplications.my.length})
              </button>
              <button
                onClick={() => setTab('received')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  tab === 'received'
                    ? 'bg-white text-blue-700 shadow-lg border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Received ({mockApplications.received.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Applications</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <DocumentTextIcon className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Under Review</p>
                <p className="text-3xl font-bold">{stats.under_review}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Approved</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Rejected</p>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
              <XCircleIcon className="w-12 h-12 text-red-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100">Withdrawn</p>
                <p className="text-3xl font-bold">{stats.withdrawn}</p>
              </div>
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-200" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {['all', 'under_review', 'approved', 'rejected', 'withdrawn'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredItems.map((application, index) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.propertyId?.title || 'Property'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <CalendarDaysIcon className="w-4 h-4 mr-1" />
                              {formatTimeAgo(application.createdAt)}
                            </div>
                            <div className="flex items-center">
                              <UserIcon className="w-4 h-4 mr-1" />
                              {application.personalInfo?.fullName}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.colors.bg} ${statusConfig.colors.text} ${statusConfig.colors.border}`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Applicant Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{application.applicantEmail}</span>
                          </div>
                          {application.personalInfo?.phone && (
                            <div className="flex items-center text-sm">
                              <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span>{application.personalInfo.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Personal Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Age:</span>
                            <span className="ml-2 font-medium">{application.personalInfo?.age}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Occupation:</span>
                            <span className="ml-2 font-medium">{application.personalInfo?.occupation}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Annual Income:</span>
                            <span className="ml-2 font-medium">
                              ${application.personalInfo?.annualIncome?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                        <p className="text-gray-700 leading-relaxed">{application.coverLetter}</p>
                      </div>
                    )}

                    {/* Documents */}
                    {application.documents && application.documents.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Submitted Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {application.documents.map((doc, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <DocumentTextIcon className="w-3 h-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Landlord Notes */}
                    {application.landlordNotes && (
                      <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Landlord Notes</h4>
                        <p className="text-gray-700">{application.landlordNotes}</p>
                      </div>
                    )}

                    {/* Action Section (only for received applications) */}
                    {tab === 'received' && (
                      <div className="border-t border-gray-100 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Status
                            </label>
                            <select
                              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={statusMap[application._id] || ''}
                              onChange={(e) => setStatusMap(prev => ({ ...prev, [application._id]: e.target.value }))}
                            >
                              <option value="">Select status...</option>
                              {statusOptions.map(option => (
                                <option key={option.key} value={option.key}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notes (Optional)
                            </label>
                            <textarea
                              placeholder="Add notes about this application..."
                              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              value={noteMap[application._id] || ''}
                              onChange={(e) => setNoteMap(prev => ({ ...prev, [application._id]: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => updateStatus(application._id)}
                            disabled={!statusMap[application._id]}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Update Application
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">
              {tab === 'my' 
                ? "You haven't submitted any applications yet. Start browsing properties!" 
                : "No applications received yet. Your properties will attract applicants soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
