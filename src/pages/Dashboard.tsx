import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import DashboardAnimation from "../Assets/Promo Code.json";
import { apiService } from "../services/api";
import type { DashboardStats, Visit } from "../types";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl shadow-sm p-5 ${className}`}>{children}</div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW: Carousel state for both sections
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [summaryIndex, setSummaryIndex] = useState(0);

  // Mock data for Today's Summary (since it's static in your design)
  const summaryItems = [
    { color: "bg-pink-500", title: "Homework", count: "3 Parents" },
    { color: "bg-blue-500", title: "Learning Progress Review", count: "2 Parents" },
    { color: "bg-green-500", title: "Behavior & Discipline", count: "1 Parent" },
    { color: "bg-cyan-500", title: "Report Card Discussion", count: "1 Parent" },
    { color: "bg-purple-500", title: "Other/Parent Request", count: "2 Parents" },
    { color: "bg-orange-500", title: "Attendance Concern", count: "1 Parent" },
    { color: "bg-red-500", title: "Urgent Matter", count: "1 Parent" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const [statsData, visitsData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getVisits({ limit: 20 }) // get more for carousel
        ]);
        setStats(statsData);
        setRecentVisits(visitsData.visits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-rotate Upcoming Visits every 8 seconds
  useEffect(() => {
    if (recentVisits.length <= 4) return;
    const interval = setInterval(() => {
      setUpcomingIndex((prev) => (prev + 4) % recentVisits.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [recentVisits.length]);

  // Auto-rotate Today's Summary every 8 seconds
  useEffect(() => {
    if (summaryItems.length <= 4) return;
    const interval = setInterval(() => {
      setSummaryIndex((prev) => (prev + 4) % summaryItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Helper to get current 4 items
  const getCurrentItems = (items: any[], startIndex: number) => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = (startIndex + i) % items.length;
      result.push(items[index]);
    }
    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans">

      <div className="lg:col-span-3 space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hi, Admin</h2>
            <p className="text-gray-500">Let's manage your visits today!</p>
          </div>
          {/* <button className="p-2 rounded-full bg-indigo-100 text-[#153d5d] hover:bg-indigo-200 transition">Bell</button> */}
        </div>

        <Card className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#afcde5] to-[#faf0f0] text-gray-900">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Today's Visits</h3>
            <p className="mb-3">Check your scheduled visits and parent interactions.</p>
            <button className="px-4 py-2 rounded-lg bg-[#153d5d] text-white hover:bg-indigo-700 transition">
              View Schedule
            </button>
          </div>
          <div className="md:w-1/2 w-full h-64 md:h-72">
            <Lottie animationData={DashboardAnimation} loop />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <p className="text-sm text-gray-500">Total Visits Today</p>
            <h3 className="text-xl font-bold text-gray-900">{stats?.totalVisitsToday || 0}</h3>
          </Card>
          <Card className="bg-white">
            <p className="text-sm text-gray-500">Students Visited</p>
            <h3 className="text-xl font-bold text-green-600">{stats?.studentsVisitedToday || 0}</h3>
          </Card>
          <Card className="bg-white">
            <p className="text-sm text-gray-500">Students Not Visited</p>
            <h3 className="text-xl font-bold text-red-600">{stats?.studentsNotVisitedToday || 0}</h3>
          </Card>
        </div>

        <Card className="bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Parent Visits</h3>
          <div className="space-y-3">
            {recentVisits.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent visits</p>
            ) : (
              recentVisits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                  <div>
                    <p className="font-medium text-gray-900">{visit.parentName}</p>
                    <p className="text-sm text-gray-500">{visit.studentName}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800`}>
                      {visit.status}
                    </span>
                    <span className="text-sm text-gray-400">{visit.visitTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <Card className="flex flex-col items-center text-center bg-white">
          <img src="src/Assets/avatar.jpg" alt="Admin" className="w-16 h-16 rounded-full mb-2" />
          <h3 className="font-semibold text-gray-900">Admin Name</h3>
          <p className="text-gray-500 text-sm">School Manager</p>
        </Card>

        {/* UPCOMING VISITS - Only 4 at a time, rotates */}
        <Card className="bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming</h3>
          <p className="text-sm text-gray-500 mb-4">Tuesday, 28 March, 2023</p>
          <div className="space-y-4">
            {getCurrentItems(recentVisits, upcomingIndex).map((visit, i) => (
              <div
                key={visit.id}
                className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-1 h-14 rounded-full ${
                  visit.status === "pending" ? "bg-[#dcbebe]" :
                  visit.status === "approved" ? "bg-blue-400" :
                  visit.status === "checked-in" ? "bg-green-500" :
                  "bg-[#153d5d]"
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{visit.parentName}</p>
                  <p className="text-xs text-gray-500">{visit.purpose || "Parent Meeting"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* TODAY'S SUMMARY - Only 4 at a time, rotates */}
        <Card className="bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-4">
            {getCurrentItems(summaryItems, summaryIndex).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-1 h-14 rounded-full ${item.color}`} />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}