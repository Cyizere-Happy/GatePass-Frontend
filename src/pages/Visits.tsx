import { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Calendar, Plus } from 'lucide-react';
import { apiService } from '../services/api';
import type { Visit, Student } from '../types';
import NoData from '../components/NoData';

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newVisitRequest, setNewVisitRequest] = useState({
    parentName: '',
    parentPhone: '',
    studentId: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    loadVisits();
  }, [statusFilter, dateFilter]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      if (searchTerm) params.search = searchTerm;

      const [visitsData, studentsData] = await Promise.all([
        apiService.getVisits(params),
        apiService.getStudents({ limit: 100 })
      ]);
      setVisits(visitsData.visits);
      setStudents(studentsData.students);
    } catch (error) {
      console.error('Failed to load visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiService.approveVisit(id);
      loadVisits();
    } catch (error) {
      console.error('Failed to approve visit:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await apiService.cancelVisit(id, 'Cancelled by school admin');
      loadVisits();
    } catch (error) {
      console.error('Failed to cancel visit:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Visits Management</h1>
          <p className="text-gray-600 mt-1">View and manage all parent visit requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by parent name, student, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadVisits()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="checked-in">Checked In</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visit ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <NoData
                        title="No Visits Found"
                        description="No parent visits have been recorded yet. Visits will appear here once parents start booking appointments."
                        actionText="View Calendar"
                        onAction={() => console.log('View calendar clicked')}
                        variant="compact"
                      />
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        #{visit.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{visit.parentName}</p>
                          <p className="text-xs text-gray-500">{visit.parentPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{visit.studentName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{visit.visitDate}</p>
                          <p className="text-xs text-gray-500">{visit.visitTime}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">
                        {visit.purpose}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          visit.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {visit.paymentAmount} RWF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedVisit(visit)}
                            className="p-1.5 text-gray-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {visit.status === 'pending' && visit.paymentStatus === 'completed' && (
                            <>
                              <button
                                onClick={() => handleApprove(visit.id)}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancel(visit.id)}
                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit ID</label>
                  <p className="text-gray-900 font-mono">#{selectedVisit.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVisit.status)}`}>
                      {selectedVisit.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Parent Name</label>
                  <p className="text-gray-900">{selectedVisit.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedVisit.parentPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-gray-900">{selectedVisit.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-gray-900">{selectedVisit.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit Date</label>
                  <p className="text-gray-900">{selectedVisit.visitDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Visit Time</label>
                  <p className="text-gray-900">{selectedVisit.visitTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedVisit.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedVisit.paymentStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-gray-900">{selectedVisit.paymentAmount} RWF</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Purpose of Visit</label>
                  <p className="text-gray-900">{selectedVisit.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedVisit.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                  <p className="text-gray-900">{selectedVisit.createdAt}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
