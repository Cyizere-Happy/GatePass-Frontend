import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, TrendingUp, Users, AlertCircle, UserCheck, UserX, Clock, BarChart3 } from 'lucide-react';
import { apiService } from '../services/api';
import type { Visit, Student } from '../types';

interface StudentVisitAnalytics {
  student: Student;
  totalVisits: number;
  lastVisitDate?: string;
  daysSinceLastVisit: number;
  visitFrequency: 'high' | 'medium' | 'low' | 'none';
  needsAttention: boolean;
  visitTrend: 'increasing' | 'decreasing' | 'stable';
}

interface VisitAnalytics {
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  pendingVisits: number;
  studentsVisited: number;
  studentsNotVisited: number;
  averageVisitsPerStudent: number;
  mostVisitedStudents: StudentVisitAnalytics[];
  leastVisitedStudents: StudentVisitAnalytics[];
  studentsNeedingAttention: StudentVisitAnalytics[];
}

export default function StudentVisitReports() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<VisitAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [exportType, setExportType] = useState<'student-visits' | 'visit-summary' | 'student-welfare'>('student-visits');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [visitsData, studentsData] = await Promise.all([
        apiService.getVisits({ limit: 1000 }),
        apiService.getStudents({ limit: 1000 })
      ]);

      const studentAnalytics = studentsData.students.map(student => {
        const studentVisits = visitsData.visits.filter(v => v.studentId === student.id);
        const completed = studentVisits.filter(v => v.status === 'completed');
        const lastVisit = completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const daysSince = lastVisit ? Math.floor((Date.now() - new Date(lastVisit.createdAt).getTime()) / 86400000) : 999;

        let freq: 'high' | 'medium' | 'low' | 'none' = 'none';
        if (completed.length >= 8) freq = 'high';
        else if (completed.length >= 4) freq = 'medium';
        else if (completed.length >= 1) freq = 'low';

        return {
          student,
          totalVisits: completed.length,
          lastVisitDate: lastVisit?.createdAt,
          daysSinceLastVisit: daysSince,
          visitFrequency: freq,
          needsAttention: daysSince > 30 || completed.length === 0,
          visitTrend: 'stable' as const
        };
      });

      const analytics: VisitAnalytics = {
        totalVisits: visitsData.visits.length,
        completedVisits: visitsData.visits.filter(v => v.status === 'completed').length,
        cancelledVisits: visitsData.visits.filter(v => v.status === 'cancelled').length,
        pendingVisits: visitsData.visits.filter(v => v.status === 'pending').length,
        studentsVisited: studentAnalytics.filter(s => s.totalVisits > 0).length,
        studentsNotVisited: studentAnalytics.filter(s => s.totalVisits === 0).length,
        averageVisitsPerStudent: studentAnalytics.reduce((s, a) => s + a.totalVisits, 0) / studentsData.students.length || 0,
        mostVisitedStudents: studentAnalytics.filter(s => s.totalVisits > 0).sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 5),
        leastVisitedStudents: studentAnalytics.sort((a, b) => a.totalVisits - b.totalVisits).slice(0, 5),
        studentsNeedingAttention: studentAnalytics.filter(s => s.needsAttention)
      };

      setAnalytics(analytics);
    } catch (err) {
      console.error('Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Exporting ${exportType.replace('-', ' ')} report (${selectedPeriod})...`);
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#153d5d' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-sm">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#153d5d' }}>Student Visit Reports</h1>
          <p className="text-gray-600 text-xs">Track visit patterns & flag students needing attention</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value as any)}
          className="px-3 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#153d5d]"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: UserCheck, label: 'Visited', value: analytics?.studentsVisited, color: 'text-green-600' },
          { icon: UserX, label: 'Not Visited', value: analytics?.studentsNotVisited, color: 'text-red-600' },
          { icon: AlertCircle, label: 'Need Attention', value: analytics?.studentsNeedingAttention.length, color: 'text-orange-600' },
          { icon: BarChart3, label: 'Avg Visits', value: analytics?.averageVisitsPerStudent.toFixed(1), color: '#153d5d' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-1">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs font-medium" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Students Needing Attention */}
      <div className="bg-white rounded-lg border p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h2 className="font-semibold">Students Needing Attention</h2>
        </div>

        {analytics?.studentsNeedingAttention.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">All students well-visited!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analytics.studentsNeedingAttention.map(s => (
              <div key={s.student.id} className="bg-red-50 border border-red-200 rounded p-3 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex-center">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{s.student.name}</p>
                    <p className="text-gray-600">{s.student.grade} {s.student.class}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-gray-600">Visits:</span> <b>{s.totalVisits}</b></div>
                  <div className="flex justify-between"><span className="text-gray-600">Last:</span> <b>{s.lastVisitDate ? new Date(s.lastVisitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Never'}</b></div>
                  <div className="flex justify-between"><span className="text-gray-600">Days:</span> <b className="text-red-600">{s.daysSinceLastVisit}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most & Least Visited */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Most */}
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold">Most Visited</h2>
          </div>
          <div className="space-y-2.5">
            {analytics?.mostVisitedStudents.map((s, i) => (
              <div key={s.student.id} className="flex items-center justify-between p-2.5 bg-green-50 rounded text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-green-100 rounded-full flex-center text-green-600 font-bold text-xs">#{i + 1}</div>
                  <div>
                    <p className="font-medium">{s.student.name}</p>
                    <p className="text-gray-600">{s.student.grade} {s.student.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{s.totalVisits}</p>
                  <p className="text-gray-500 text-xs">visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least */}
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold">Least Visited</h2>
          </div>
          <div className="space-y-2.5">
            {analytics?.leastVisitedStudents.map((s, i) => (
              <div key={s.student.id} className="flex items-center justify-between p-2.5 bg-orange-50 rounded text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex-center text-orange-600 font-bold text-xs">#{i + 1}</div>
                  <div>
                    <p className="font-medium">{s.student.name}</p>
                    <p className="text-gray-600">{s.student.grade} {s.student.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{s.totalVisits}</p>
                  <p className="text-gray-500 text-xs">visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg border p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" style={{ color: '#153d5d' }} />
          <h2 className="font-semibold">Export Reports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { type: 'student-visits', icon: Users, color: 'blue', title: 'Visit Details' },
            { type: 'visit-summary', icon: BarChart3, color: 'green', title: 'Summary Report' },
            { type: 'student-welfare', icon: AlertCircle, color: 'orange', title: 'Welfare Report' },
          ].map(item => (
            <button
              key={item.type}
              onClick={() => setExportType(item.type as any)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${exportType === item.type ? 'border-[#153d5d] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex-center mb-3`} style={{ backgroundColor: item.color === 'blue' ? '#153d5d' : item.color === 'green' ? '#16a34a' : '#ea580c' }}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600">Detailed {item.title.toLowerCase()} data</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded text-white text-xs font-medium transition-all disabled:opacity-60"
            style={{ backgroundColor: loading ? '#94a3b8' : '#153d5d' }}
          >
            <Download className="w-4 h-4" />
            {loading ? 'Exporting...' : `Export ${exportType.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`}
          </button>
        </div>
      </div>
    </div>
  );
}