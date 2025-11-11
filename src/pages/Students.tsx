import { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, GraduationCap } from 'lucide-react';
import { apiService } from '../services/api';
import type { Student } from '../types';
import NoData from '../components/NoData';
import { XCircle } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../Assets/Logo.json";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, [gradeFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (gradeFilter !== 'all') params.grade = gradeFilter;
      if (searchTerm) params.search = searchTerm;

      const data = await apiService.getStudents(params);
      setStudents(data.students);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Students Management</h1>
          <p className="text-gray-600 mt-1">View and manage student information</p>
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
              placeholder="Search by student name, ID, or guardian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadStudents()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-gray-300 transition-all duration-200"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Grades</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Class</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guardian</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <NoData
                        title="No Students Found"
                        description="We couldn’t find any students with that name or ID."
                        onAction={() => console.log('Add student clicked')}
                        variant="compact"
                      />
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        {student.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary-900" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{student.grade}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{student.class}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{student.guardianName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{student.guardianPhone}</p>
                          <p className="text-xs text-gray-500">{student.guardianEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 text-gray-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

{selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-custom relative">
      
      {/* Optional Lottie Animation */}
      <div className="absolute w-64 h-64 right-0 bottom-0 opacity-50">
        <Lottie animationData={animationData} loop={true} />
      </div>

      {/* Modal Header */}
      <div className="bg-blue-50 px-6 py-4 rounded-t-lg flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#153d5d' }}>Student Details</h3>
          <p className="text-sm mt-1" style={{ color: '#153d5d' }}>Information for <span className="font-medium">{selectedStudent.name}</span></p>
        </div>
        <button
          onClick={() => setSelectedStudent(null)}
          className="hover:text-blue-600 p-1 rounded-full transition-colors"
          title="Close"
          style={{ color: '#153d5d' }}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="px-10 py-6 bg-gray-50 space-y-4">
        
        {/* Student Info */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-md">
            <GraduationCap className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Selected Student</p>
            <h3 className="text-base font-semibold text-gray-900">{selectedStudent.name}</h3>
            <p className="text-sm text-gray-500">{selectedStudent.grade} {selectedStudent.class}</p>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <p className="text-gray-900 font-mono">{selectedStudent.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <p className="text-gray-900">{selectedStudent.grade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <p className="text-gray-900">{selectedStudent.class}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
            <p className="text-gray-900">{selectedStudent.enrollmentDate}</p>
          </div>
        </div>

        {/* Guardian Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
            <p className="text-gray-900">{selectedStudent.guardianName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-gray-900">{selectedStudent.guardianPhone}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <p className="text-gray-900">{selectedStudent.guardianEmail}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={() => setSelectedStudent(null)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
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
