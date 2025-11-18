import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  Building2,
  Clock,
  ChevronRight,
  X,
  History,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { Visit } from '../types';
import NoData from '../components/NoData';

const MAIN = "#153d5d";

export default function OutsideVisitors() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [history, setHistory] = useState<Visit[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const { visits } = await apiService.getVisits({
        limit: 200,
        visitorType: 'outside_visitor',
      });
      setVisits(visits);
    } catch (error) {
      console.error('Failed to load outside visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return visits.filter((visit) => {
      if (statusFilter !== 'all' && visit.status !== statusFilter) return false;
      if (!query) return true;

      const fields = [
        visit.parentName,
        visit.parentPhone,
        visit.purpose,
        visit.visitorOrganization,
        ...(visit.visitorMembers?.map(m => m.name + ' ' + m.role) || []),
      ]
        .filter(Boolean)
        .map(f => f!.toLowerCase());

      return fields.some(field => field.includes(query));
    });
  }, [visits, searchTerm, statusFilter]);

  // Modern opacity-based badge system
  const statusConfig: Record<string, { label: string; styles: string }> = {
    pending: {
      label: "Pending",
      styles: "bg-[#153d5d22] text-[#153d5d] border border-[#153d5d33]",
    },
    approved: {
      label: "Approved",
      styles: "bg-[#153d5d33] text-[#153d5d] border border-[#153d5d55]",
    },
    "checked-in": {
      label: "Checked In",
      styles: "bg-[#153d5d44] text-[#153d5d] border border-[#153d5d66]",
    },
    completed: {
      label: "Completed",
      styles: "bg-[#153d5d11] text-[#153d5d] border border-[#153d5d22]",
    },
    cancelled: {
      label: "Cancelled",
      styles: "bg-[#153d5d66] text-white border border-[#153d5d66]",
    },
  };

  const getStatusStyle = (status: string) => statusConfig[status] || statusConfig.completed;

  const handleSelectVisit = async (visit: Visit) => {
    setSelectedVisit(visit);
    if (!visit.visitorOrganization) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const pastVisits = await apiService.getVisitorHistory(visit.visitorOrganization);
      setHistory(pastVisits.filter(v => v.id !== visit.id));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedVisit(null);
    setHistory([]);
  };

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#153d5d]">Outside Visitors</h1>
              <p className="mt-1 text-gray-600">
                Track and manage all external organizations and teams visiting campus
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadVisits}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium transition shadow-sm"
                style={{ backgroundColor: MAIN }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f2c43"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by organization, visitor, purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153d5d] transition"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153d5d] appearance-none cursor-pointer transition"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="checked-in">Checked In</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 text-[#153d5d] animate-spin" />
            </div>
          ) : filteredVisits.length === 0 ? (
            <NoData
              title="No visitors found"
              description="Try adjusting your search or filters."
              variant="compact"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVisits.map((visit) => {
                const status = getStatusStyle(visit.status);
                return (
                  <button
                    key={visit.id}
                    onClick={() => handleSelectVisit(visit)}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-[#153d5d] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {visit.visitorOrganization || 'Independent Visitor'}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-2">
                          {visit.purpose}
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.styles}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{visit.parentName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{visit.visitDate} at {visit.visitTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{visit.visitorMembers?.length || 1} visitor{visit.visitorMembers?.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div
                      className="mt-5 flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all"
                      style={{ color: MAIN }}
                    >
                      <span>View details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Organization
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {selectedVisit.visitorOrganization || selectedVisit.parentName}
                </h2>
                <p className="text-gray-600 mt-1">{selectedVisit.purpose}</p>
              </div>
              <button
                onClick={closeDetails}
                className="p-3 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">

              {/* Visit Details */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Clock, label: 'Date & Time', value: `${selectedVisit.visitDate} · ${selectedVisit.visitTime}` },
                    { icon: Building2, label: 'Host', value: selectedVisit.parentName, sub: selectedVisit.parentPhone },
                    { icon: null, label: 'Status', value: (
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(selectedVisit.status).styles}`}
                      >
                        {getStatusStyle(selectedVisit.status).label}
                      </span>
                    )},
                    { icon: null, label: 'Notes', value: selectedVisit.visitNotes || <span className="text-gray-400 italic">No notes added</span> },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-5">
                      {item.icon && <item.icon className="w-5 h-5 text-gray-400 mb-2" />}
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="mt-1 text-gray-900 font-medium">{item.value}</p>
                      {item.sub && <p className="text-sm text-gray-600 mt-1">{item.sub}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Visitor Members */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5" style={{ color: MAIN }} />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Visitors ({selectedVisit.visitorMembers?.length || 0})
                  </h3>
                </div>

                {selectedVisit.visitorMembers?.length ? (
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    {selectedVisit.visitorMembers.map((member, idx) => (
                      <div
                        key={member.id}
                        className={`p-5 ${idx !== 0 ? 'border-t border-gray-200' : ''}`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-gray-700">{member.contact}</p>
                            {member.notes && <p className="text-gray-500 text-xs mt-1">{member.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No individual visitor details recorded.</p>
                )}
              </section>

              {/* History */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <History className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Previous Visits</h3>
                  {historyLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                </div>

                {history.length === 0 ? (
                  <p className="text-gray-500 italic">
                    {historyLoading ? 'Loading history...' : 'No previous visits from this organization.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {history.map((v) => (
                      <div
                        key={v.id}
                        className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{v.purpose}</p>
                          <p className="text-sm text-gray-600">{v.visitDate} · {v.visitTime}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(v.status).styles}`}>
                          {getStatusStyle(v.status).label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      )}

    </>
  );
}
