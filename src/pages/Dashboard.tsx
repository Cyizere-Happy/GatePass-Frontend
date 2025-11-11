import { useEffect, useState } from 'react';
import { Users, CalendarCheck, Clock, TrendingUp, AlertCircle, UserCheck, UserX } from 'lucide-react';
import StatCard from '../components/StatCard';
import { apiService } from '../services/api';
import type { DashboardStats, Visit } from '../types';
import VisitingDays from './VisitingDays';
import StudentVisitRequests from './StudentVisitRequests';



export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, visitsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getVisits({ limit: 5 })
      ]);
      setStats(statsData);
      setRecentVisits(visitsData.visits);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

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
      <div className="flex items-center justify-between gap-8 mb-8">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#153d5d' }}>Gate<span className='text-black'>Pass.</span> Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Monitor parent visits and student interactions at your school
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex-shrink-0 w-32 h-32">
          <img
            src="src/Assets/Dashboard.png"
            alt="Dashboard Overview"
            className=" object-contain"
          />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-xl border p-6" style={{ background: 'white', borderColor: '#153d5d' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#153d5d' }}>Quick Actions</h2>
            <p style={{ color: '#153d5d' }}>Request parents to visit for urgent matters and verify parents at the gate</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.href = '#student-visits'}
              className="px-4 py-2 text-white rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
              style={{ backgroundColor: '#153d5d' }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0f2a42'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#153d5d'}
            >
              <CalendarCheck className="w-4 h-4" />
              Request Parent Visit
            </button>
            <button 
              onClick={() => {return <VisitingDays />}}
              className="px-4 py-2 border rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
              style={{ backgroundColor: 'white', borderColor: '#153d5d', color: '#153d5d' }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f0f4f8'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'white'}
            >
              <UserCheck className="w-4 h-4" />
              Gate Verification
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Visits Today"
          value={stats?.totalVisitsToday || 0}
          icon={CalendarCheck}
          iconColor="bg-primary-900"
          variant="gradient"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Students to be Visited"
          value={stats?.studentsVisitedToday || 0}
          icon={UserCheck}
          iconColor="bg-green-500"
          variant="default"
        />
        <StatCard
          title="Students Not Visited"
          value={stats?.studentsNotVisitedToday || 0}
          icon={UserX}
          iconColor="bg-red-500"
          variant="default"
        />
      </div>

      {/* Recent Parent Visits Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" style={{ color: '#153d5d' }} />
            Recent Parent Visits
          </h2>
          <span className="text-sm text-gray-500">
            {recentVisits.length} recent visits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentVisits.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent parent visits</p>
            </div>
          ) : (
            recentVisits.map((visit) => (
              <div key={visit.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{visit.parentName}</h3>
                    <p className="text-sm text-gray-500">Visiting: {visit.studentName}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{visit.visitTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{visit.purpose}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Student ID: {visit.studentId}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Visits</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No recent visits
                    </td>
                  </tr>
                ) : (
                  recentVisits.map((visit) => (
                    <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{visit.parentName}</p>
                          <p className="text-xs text-gray-500">{visit.parentPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{visit.studentName}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{visit.visitTime}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          visit.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {visit.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Stats</h3>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Visits</span>
                  <span className="font-semibold text-gray-900">{stats?.visitsThisMonth || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-900 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Students</span>
                  <span className="font-semibold text-gray-900">{stats?.totalStudents || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6" style={{ backgroundColor: '#f0f4f8', borderColor: '#153d5d' }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#153d5d' }} />
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#153d5d' }}>Quick Tip</h3>
                <p className="text-sm" style={{ color: '#153d5d' }}>
                  Use the Gate Verification page when parents arrive at the school. They can enter their Visit ID or phone number to confirm their approved visit and check in safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
