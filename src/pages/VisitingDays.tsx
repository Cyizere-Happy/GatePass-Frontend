import { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, Users, MapPin, Edit, XCircle, Filter, Download, Settings } from 'lucide-react';
import Lottie from "lottie-react";
import animationData from "../Assets/Logo.json";
import { apiService } from '../services/api';

interface VisitingDay {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  maxVisitors: number;
  currentVisitors: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  audience: 'parents' | 'outside_visitors';
}

export default function VisitingDays() {
  const [visitingDays, setVisitingDays] = useState<VisitingDay[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<VisitingDay | null>(null);
  const [visitType, setVisitType] = useState<'parent' | 'outside_visitor'>('parent');
  const [newVisit, setNewVisit] = useState({
    parentName: '',
    studentName: '',
    studentClass: '',
    visitorOrganization: '',
    visitDepartment: '',
    contactNumber: '',
    purpose: '',
    visitDate: '',
    visitTime: ''
  });
  const [newVisitingDay, setNewVisitingDay] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    maxVisitors: 50,
    audience: 'parents' as 'parents' | 'outside_visitors'
  });

  useEffect(() => {
    const mockVisitingDays: VisitingDay[] = [
      {
        id: '1',
        date: '2025-01-15',
        startTime: '09:00',
        endTime: '12:00',
        location: 'School Auditorium',
        description: 'Monthly Parent-Teacher Conference',
        maxVisitors: 100,
        currentVisitors: 75,
        status: 'scheduled',
        createdAt: '2024-01-01',
        audience: 'parents'
      },
      {
        id: '2',
        date: '2025-01-20',
        startTime: '14:00',
        endTime: '17:00',
        location: 'School Library',
        description: 'Open House for New Parents',
        maxVisitors: 50,
        currentVisitors: 50,
        status: 'active',
        createdAt: '2024-01-05',
        audience: 'parents'
      },
      {
        id: '3',
        date: '2025-01-25',
        startTime: '10:00',
        endTime: '15:00',
        location: 'Main Campus',
        description: 'School Tour Day',
        maxVisitors: 80,
        currentVisitors: 45,
        status: 'scheduled',
        createdAt: '2024-01-10',
        audience: 'outside_visitors'
      },
      {
        id: '4',
        date: '2024-12-15',
        startTime: '09:00',
        endTime: '16:00',
        location: 'Sports Complex',
        description: 'Annual Sports Day',
        maxVisitors: 200,
        currentVisitors: 200,
        status: 'completed',
        createdAt: '2024-12-01',
        audience: 'outside_visitors'
      },
      {
        id: '5',
        date: '2025-02-01',
        startTime: '13:00',
        endTime: '16:00',
        location: 'Science Lab',
        description: 'Science Fair Viewing',
        maxVisitors: 60,
        currentVisitors: 15,
        status: 'scheduled',
        createdAt: '2024-01-15',
        audience: 'parents'
      }
    ];
    setVisitingDays(mockVisitingDays);
  }, []);

  const handleCreateVisitingDay = () => {
    if (!newVisitingDay.date || !newVisitingDay.startTime || !newVisitingDay.endTime || !newVisitingDay.location) {
      alert('Please fill in all required fields');
      return;
    }

    const newDay: VisitingDay = {
      id: Date.now().toString(),
      ...newVisitingDay,
      currentVisitors: 0,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    setVisitingDays(prev => [...prev, newDay]);
    setShowCreateModal(false);
    setNewVisitingDay({
      date: '', startTime: '', endTime: '', location: '', description: '', maxVisitors: 50
    });
  };

  const toggleSelectDay = (id: string) => {
    setSelectedDays(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getCapacityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'text-red-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const totalDays = visitingDays.length;
  const totalVisitors = visitingDays.reduce((sum, d) => sum + d.currentVisitors, 0);
  const activeDays = visitingDays.filter(d => d.status === 'active').length;
  const avgCapacity = totalDays ? Math.round(visitingDays.reduce((sum, d) => sum + (d.currentVisitors / d.maxVisitors) * 100, 0) / totalDays) : 0;

  const openVisitModal = (day: VisitingDay) => {
    setSelectedDay(day);
    setVisitType(day.audience === 'outside_visitors' ? 'outside_visitor' : 'parent');
    setNewVisit({
      parentName: '',
      studentName: '',
      studentClass: '',
      visitorOrganization: '',
      visitDepartment: '',
      contactNumber: '',
      purpose: '',
      visitDate: day.date,
      visitTime: ''
    });
    setShowVisitModal(true);
  };

  const handleSaveVisit = async () => {
    if (!newVisit.visitDate || !newVisit.visitTime || !newVisit.purpose) {
      alert('Please fill in the required fields: purpose, date and time.');
      return;
    }

    try {
      if (visitType === 'parent') {
        await apiService.createVisit({
          visitorType: 'parent',
          parentName: newVisit.parentName,
          parentPhone: newVisit.contactNumber,
          visitDate: newVisit.visitDate,
          visitTime: newVisit.visitTime,
          purpose: newVisit.purpose,
          studentId: '',
          studentName: `${newVisit.studentName} (${newVisit.studentClass})`
        });
      } else {
        await apiService.createVisit({
          visitorType: 'outside_visitor',
          parentName: newVisit.parentName,
          parentPhone: newVisit.contactNumber,
          visitDate: newVisit.visitDate,
          visitTime: newVisit.visitTime,
          purpose: newVisit.purpose,
          visitorOrganization: newVisit.visitorOrganization,
          visitDepartment: newVisit.visitDepartment
        });
      }

      setShowVisitModal(false);
    } catch (error) {
      console.error('Failed to save visit:', error);
      alert('Failed to save visit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-sm">
      {/* Compact Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#153d5d' }}>Visiting Days</h1>
        <p className="text-gray-600">Manage school visiting days & parent attendance</p>
      </div>

      {/* Compact Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Table
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 text-white rounded font-medium flex items-center gap-1.5 text-xs"
              style={{ backgroundColor: '#153d5d' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Day
            </button>
          </div>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Days', value: totalDays, icon: Calendar },
          { label: 'Total Visitors', value: totalVisitors, icon: Users },
          { label: 'Active', value: activeDays, icon: Calendar },
          { label: 'Avg. Capacity', value: `${avgCapacity}%`, icon: MapPin },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xl font-bold" style={{ color: '#153d5d' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Compact Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2 text-left"><input type="checkbox" className="rounded" onChange={(e) => setSelectedDays(e.target.checked ? visitingDays.map(d => d.id) : [])} /></th>
                <th className="px-3 py-2 text-left">Day</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">For</th>
                <th className="px-3 py-2 text-left">Visitors</th>
                <th className="px-3 py-2 text-left">Capacity</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visitingDays.map(day => (
                <tr key={day.id} className={`hover:bg-gray-50 ${selectedDays.includes(day.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2.5"><input type="checkbox" className="rounded" checked={selectedDays.includes(day.id)} onChange={() => toggleSelectDay(day.id)} /></td>
                  <td className="px-3 py-2.5 font-medium">{day.description}</td>
                  <td className="px-3 py-2.5">{new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-3 py-2.5">{day.startTime} - {day.endTime}</td>
                  <td className="px-3 py-2.5">{day.location}</td>
                  <td className="px-3 py-2.5">
                    {day.audience === 'parents' ? 'Parents / Guardians' : 'Outside Visitors'}
                  </td>
                  <td className="px-3 py-2.5">{day.currentVisitors}</td>
                  <td className={`px-3 py-2.5 font-medium ${getCapacityColor(day.currentVisitors, day.maxVisitors)}`}>
                    {Math.round((day.currentVisitors / day.maxVisitors) * 100)}%
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(day.status)}`}>
                      {day.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                        onClick={() => openVisitModal(day)}
                      >
                        Register Visit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDays.length > 0 && (
          <div className="bg-gray-50 border-t px-4 py-2 flex items-center justify-between text-xs">
            <span>{selectedDays.length} selected</span>
            <div className="flex gap-3">
              <button className="text-gray-700 hover:text-gray-900">Edit</button>
              <button className="text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        )}

        <div className="bg-white border-t px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <select className="border rounded px-2 py-1"><option>10</option><option>25</option></select>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border rounded hover:bg-gray-50">Prev</button>
            <button className="px-2 py-1 rounded text-white" style={{ backgroundColor: '#153d5d' }}>1</button>
            <button className="px-2 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Compact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className='absolute bottom-0 right-0 w-72 h-72'>
           <Lottie animationData={animationData} loop={true} />
          </div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-blue-50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-base" style={{ color: '#153d5d' }}>Schedule Visiting Day</h3>
              <button onClick={() => setShowCreateModal(false)} className="hover:opacity-70">
                <XCircle className="w-5 h-5" style={{ color: '#153d5d' }} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date <span className="text-red-500">*</span></label>
                  <input type="date" value={newVisitingDay.date} onChange={e => setNewVisitingDay(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Visit Type <span className="text-red-500">*</span></label>
                  <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        setNewVisitingDay(prev => ({ ...prev, audience: 'parents' }))
                      }
                      className={`px-3 py-1 rounded-full font-medium ${
                        newVisitingDay.audience === 'parents'
                          ? 'bg-white text-[#153d5d] shadow-sm'
                          : 'text-gray-500'
                      }`}
                    >
                      Parent Visits
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewVisitingDay(prev => ({ ...prev, audience: 'outside_visitors' }))
                      }
                      className={`px-3 py-1 rounded-full font-medium ${
                        newVisitingDay.audience === 'outside_visitors'
                          ? 'bg-white text-[#153d5d] shadow-sm'
                          : 'text-gray-500'
                      }`}
                    >
                      Outside Visitors
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Location <span className="text-red-500">*</span></label>
                  <input type="text" value={newVisitingDay.location} onChange={e => setNewVisitingDay(prev => ({ ...prev, location: e.target.value }))} placeholder="Auditorium" className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Start <span className="text-red-500">*</span></label>
                  <input type="time" value={newVisitingDay.startTime} onChange={e => setNewVisitingDay(prev => ({ ...prev, startTime: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">End <span className="text-red-500">*</span></label>
                  <input type="time" value={newVisitingDay.endTime} onChange={e => setNewVisitingDay(prev => ({ ...prev, endTime: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea rows={2} value={newVisitingDay.description} onChange={e => setNewVisitingDay(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-1.5 border rounded text-xs resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Max Visitors</label>
                  <input type="number" value={newVisitingDay.maxVisitors} onChange={e => setNewVisitingDay(prev => ({ ...prev, maxVisitors: parseInt(e.target.value) || 50 }))} className="w-full px-3 py-1.5 border rounded text-xs" />
                </div>
              </div>
            </div>

            <div className="border-t px-4 py-3 flex gap-2">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50 text-xs font-medium">Cancel</button>
              <button onClick={handleCreateVisitingDay} className="flex-1 px-3 py-1.5 text-white rounded text-xs font-medium" style={{ backgroundColor: '#153d5d' }}>Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Visit Modal */}
      {showVisitModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>
                  Register Visit
                </h3>
                <p className="text-xs mt-1 text-gray-600">
                  Visiting day: {new Date(selectedDay.date).toLocaleDateString('en-GB')} ·{' '}
                  {selectedDay.startTime} - {selectedDay.endTime}
                </p>
              </div>
              <button
                onClick={() => setShowVisitModal(false)}
                className="hover:opacity-70"
              >
                <XCircle className="w-5 h-5" style={{ color: '#153d5d' }} />
              </button>
            </div>

            <div className="px-6 pt-4">
              <label className="block text-xs font-semibold mb-1">
                Visit Type <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setVisitType('parent')}
                  className={`px-3 py-1 rounded-full font-medium ${
                    visitType === 'parent'
                      ? 'bg-white text-[#153d5d] shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  Parent Visit
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('outside_visitor')}
                  className={`px-3 py-1 rounded-full font-medium ${
                    visitType === 'outside_visitor'
                      ? 'bg-white text-[#153d5d] shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  Outside Visitor
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {visitType === 'parent' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Parent / Guardian Name</label>
                      <input
                        type="text"
                        value={newVisit.parentName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, parentName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Student Name</label>
                      <input
                        type="text"
                        value={newVisit.studentName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, studentName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Class</label>
                      <input
                        type="text"
                        value={newVisit.studentClass}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, studentClass: e.target.value }))
                        }
                        placeholder="e.g. Grade 5 A"
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Purpose</label>
                      <input
                        type="text"
                        value={newVisit.purpose}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, purpose: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Visitor Name</label>
                      <input
                        type="text"
                        value={newVisit.parentName}
                        onChange={e =>
                          setNewVisit(prev => ({ ...prev, parentName: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Organization</label>
                      <input
                        type="text"
                        value={newVisit.visitorOrganization}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            visitorOrganization: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Department / Person Visited
                      </label>
                      <input
                        type="text"
                        value={newVisit.visitDepartment}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            visitDepartment: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Contact Number</label>
                      <input
                        type="tel"
                        value={newVisit.contactNumber}
                        onChange={e =>
                          setNewVisit(prev => ({
                            ...prev,
                            contactNumber: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Purpose</label>
                    <input
                      type="text"
                      value={newVisit.purpose}
                      onChange={e =>
                        setNewVisit(prev => ({ ...prev, purpose: e.target.value }))
                      }
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={newVisit.visitDate}
                    onChange={e =>
                      setNewVisit(prev => ({ ...prev, visitDate: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Visit Time</label>
                  <input
                    type="time"
                    value={newVisit.visitTime}
                    onChange={e =>
                      setNewVisit(prev => ({ ...prev, visitTime: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex gap-2">
              <button
                onClick={() => setShowVisitModal(false)}
                className="flex-1 px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVisit}
                className="flex-1 px-3 py-1.5 text-white rounded text-xs font-medium"
                style={{ backgroundColor: '#153d5d' }}
              >
                Save Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
