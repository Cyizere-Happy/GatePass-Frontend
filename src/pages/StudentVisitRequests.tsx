import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import animationData from "../Assets/Animation.json";
import NoData from '../Assets/No data.json';
import RequestVisit from "../Assets/RequestVisit.json";
import { Search, Users, Clock, Plus, XCircle, Bell, AlertCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Import modules
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  guardianName: string;
}

interface StudentVisitStatus {
  student: Student;
  lastVisitDate?: string;
  visitCount: number;
  needsVisit: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function StudentVisitRequests() {
  const [studentVisitStatus, setStudentVisitStatus] = useState<StudentVisitStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newVisitRequest, setNewVisitRequest] = useState({
    parentName: '',
    parentPhone: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    notes: ''
  });

  // Mock data
  useEffect(() => {
    const mockStudents: StudentVisitStatus[] = [
      {
        student: { id: '1', name: 'John Smith', grade: 'Grade 5', class: 'A', guardianName: 'Mary Smith' },
        visitCount: 3,
        needsVisit: true,
        priority: 'high',
        lastVisitDate: '2025-10-15'
      },
      {
        student: { id: '2', name: 'Emma Johnson', grade: 'Grade 4', class: 'B', guardianName: 'Robert Johnson' },
        visitCount: 1,
        needsVisit: true,
        priority: 'medium',
        lastVisitDate: '2025-10-28'
      },
      {
        student: { id: '3', name: 'Michael Brown', grade: 'Grade 6', class: 'A', guardianName: 'Sarah Brown' },
        visitCount: 5,
        needsVisit: false,
        priority: 'low',
        lastVisitDate: '2025-11-05'
      },
      {
        student: { id: '4', name: 'Sophia Davis', grade: 'Grade 3', class: 'C', guardianName: 'James Davis' },
        visitCount: 2,
        needsVisit: true,
        priority: 'high',
        lastVisitDate: '2025-10-10'
      }
    ];
    setStudentVisitStatus(mockStudents);
  }, []);

  const handleRequestVisit = () => {
    if (!selectedStudent || !newVisitRequest.parentName || !newVisitRequest.parentPhone || !newVisitRequest.visitDate || !newVisitRequest.visitTime) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Visit requested for ${selectedStudent.name} by ${newVisitRequest.parentName}`);
    setShowRequestModal(false);
    setSelectedStudent(null);
    setNewVisitRequest({
      parentName: '',
      parentPhone: '',
      visitDate: '',
      visitTime: '',
      purpose: '',
      notes: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-[#153d5d]/20 border-[#153d5d]/50',
      medium: 'bg-[#153d5d]/10 border-[#153d5d]/30',
      low: 'bg-[#153d5d]/5 border-[#153d5d]/20',
    };
    return colors[priority as keyof typeof colors] || 'bg-[#153d5d]/5 border-[#153d5d]/20';
  };

  const getUrgencyReason = () => {
    const reasons = [
      'Discipline issue - needs parent meeting',
      'Student is sick - needs to go home',
      'Academic concerns - parent discussion needed',
      'Behavioral problems - urgent attention required',
      'Health emergency - immediate parent contact'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const filteredStudents = studentVisitStatus.filter(status => {
    const matchesSearch = status.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         status.student.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || status.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#153d5d' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-8">
            <div className='flex'>
              <div className="w-48 h-48">
              {filteredStudents.length === 0 ? <Lottie animationData={NoData} loop /> : <Lottie animationData={RequestVisit} loop /> }
              </div>
              <div className='pt-8'>
              <h1 className="text-4xl font-bold mb-2 text-[#153d5d]">Request a visit</h1>
              <p className="text-gray-600 text-sm">“Request a parent visit for any student <br /> with discipline or health-related issues.”</p>
              <button
             onClick={() => setShowRequestModal(true)}
             className="mt-5 px-4 py-2 text-white rounded-lg flex items-center gap-2"
             style={{ backgroundColor: '#153d5d' }}
                          >
             <Plus size={16} /> {/* set a smaller, consistent size */}
             Create New Request
           </button>
              </div>


            </div>
          </div>

          {/* Actions & Notifications */}
          <div className="flex flex-col items-end gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 w-80 border border-gray-200 mt-9">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#153d5d]" /> Notifications
                </h3>
                <button className="text-sm text-[#153d5d] hover:underline">See all</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#153d5d]/10 rounded-xl border border-[#153d5d]/30">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#153d5d]">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#153d5d]">High priority visit needed</p>
                    <p className="text-xs text-[#153d5d]/70 mt-1">Student requires urgent attention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students or guardians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153d5d] transition-all"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className=" px-4 py-2 border pr-10  border-gray-300 rounded-lg text-[#153d5d] bg-white shadow-sm focus:outline-none hover:border-[#153d5d]"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Fixed Carousel */}
        <div className="py-6">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="student-swiper"
          >
            {filteredStudents.length === 0 ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4  rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
              filteredStudents.map((status) => (
                <SwiperSlide key={status.student.id}>
                  <div
                    className={`p-6 rounded-xl border-2 ${getPriorityColor(status.priority)} cursor-pointer hover:shadow-xl transition-all bg-white h-full`}
                    onClick={() => {
                      setSelectedStudent(status.student);
                      setShowRequestModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#153d5d]">{status.student.name}</h3>
                        <p className="text-sm text-[#153d5d]/70">{status.student.grade} {status.student.class}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        status.priority === 'high' ? 'bg-[#153d5d]/30 text-[#153d5d]' :
                        status.priority === 'medium' ? 'bg-[#153d5d]/20 text-[#153d5d]' :
                        'bg-[#153d5d]/10 text-[#153d5d]'
                      }`}>
                        {status.priority.toUpperCase()}
                      </span>
                    </div>
                    {status.needsVisit && (
                      <div className="mt-3 p-3 bg-[#153d5d]/10 rounded-lg border border-[#153d5d]/30">
                        <p className="text-xs font-medium text-[#153d5d]">{getUrgencyReason()}</p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#153d5d]/50">
                      <Clock className="w-4 h-4" />
                      <span>{status.visitCount} previous visits</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>

      {/* Request Visit Modal - UNCHANGED */}
      {showRequestModal && selectedStudent && (
        <div className="">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-custom">
              <div className='absolute w-72 h-72 left-10 bottom-0'>
                <Lottie animationData={animationData} loop={true} />
              </div>

              <div className="bg-blue-50 px-6 py-4 rounded-t-lg flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>Request Parent Visit</h3>
                  {selectedStudent && (
                    <p className="text-sm mt-1" style={{ color: '#153d5d' }}>For <span className="font-medium">{selectedStudent.name}</span></p>
                  )}
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="hover:text-blue-600 p-1 rounded-full transition-colors"
                  title="Close"
                  style={{ color: '#153d5d' }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="px-10 py-6 bg-gray-50 space-y-3">
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selected Student</p>
                    <h3 className="text-base font-semibold text-gray-900">{selectedStudent?.name}</h3>
                    <p className="text-sm text-gray-500">{selectedStudent?.grade} {selectedStudent?.class}</p>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Reason for Parent Visit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newVisitRequest.purpose}
                    onChange={(e) => setNewVisitRequest({ ...newVisitRequest, purpose: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153d5d] focus:border-transparent text-sm bg-white shadow-sm transition-all"
                  >
                    <option value="">Select reason</option>
                    <option value="discipline_issue">Discipline Issue - Student Misbehavior</option>
                    <option value="student_sick">Student is Sick - Needs to Go Home</option>
                    <option value="academic_concerns">Academic Concerns - Poor Performance</option>
                    <option value="behavioral_problems">Behavioral Problems - Urgent Attention</option>
                    <option value="health_emergency">Health Emergency - Immediate Contact</option>
                    <option value="parent_meeting">Parent Meeting - School Matters</option>
                    <option value="other">Other Urgent Matter</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      value={newVisitRequest.parentName}
                      onChange={(e) => setNewVisitRequest({ ...newVisitRequest, parentName: e.target.value })}
                      placeholder="Enter parent/guardian name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={newVisitRequest.parentPhone}
                      onChange={(e) => setNewVisitRequest({ ...newVisitRequest, parentPhone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date *</label>
                    <input
                      type="date"
                      value={newVisitRequest.visitDate}
                      onChange={(e) => setNewVisitRequest({ ...newVisitRequest, visitDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Time *</label>
                    <input
                      type="time"
                      value={newVisitRequest.visitTime}
                      onChange={(e) => setNewVisitRequest({ ...newVisitRequest, visitTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={newVisitRequest.notes}
                    onChange={(e) => setNewVisitRequest({ ...newVisitRequest, notes: e.target.value })}
                    placeholder="Additional details about the situation..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestVisit}
                  className="flex-1 px-4 py-2 text-white rounded-md transition-colors text-sm font-medium"
                  style={{ backgroundColor: '#153d5d' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0f2a42'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#153d5d'}
                >
                  Request Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}