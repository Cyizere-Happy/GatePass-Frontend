import { useState, useEffect } from 'react';
import { Search, CheckCircle, UserCheck, Clock, AlertCircle, UserSearch, Shield, Calendar, Phone, User, GraduationCap, CreditCard, Hash } from 'lucide-react';
import { apiService } from '../services/api';
import type { Visit } from '../types';
import Lottie from "lottie-react";
import animationData from "../Assets/Digital Payment.json";
import animation from "../Assets/Posting Picture.json";
import pending from "../Assets/Pending.json";

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Auto-focus search input on component mount
  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  // Validate search input
  const validateSearchInput = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return 'Please enter a visit ID or phone number';
    if (trimmed.length < 3) return 'Search term must be at least 3 characters';
    return null;
  };

  const handleSearch = async () => {
    const validationError = validateSearchInput(searchQuery);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setVisit(null);
    setSuccessMessage('');

    try {
      const data = await apiService.getVisits({ search: searchQuery.trim(), limit: 1 });
      if (data.visits.length > 0) {
        setVisit(data.visits[0]);
        // Add to search history
        setSearchHistory(prev => {
          const newHistory = [searchQuery.trim(), ...prev.filter(item => item !== searchQuery.trim())];
          return newHistory.slice(0, 5); // Keep only last 5 searches
        });
      } else {
        setError('No visit found with this ID or phone number. Please check your input and try again.');
      }
    } catch (err) {
      setError('Failed to search for visit. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!visit) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedVisit = await apiService.checkInVisit(visit.id);
      setVisit(updatedVisit);
      setSuccessMessage('Visitor checked in successfully!');
      setTimeout(() => {
        setSearchQuery('');
        setVisit(null);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to check in visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canCheckIn = visit && visit.status === 'approved' && visit.paymentStatus === 'completed';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: '#153d5d' }}>Gate Verification</h1>
        <p className="text-gray-600 mt-1">Verify parents arriving at the school gate</p>

      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm items-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
  id="search-input"
  type="text"
  placeholder="Enter Visit ID or Parent Phone Number"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-lg
             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-gray-300 transition-all duration-200"
  aria-label="Search for visit by ID or phone number"
/>

            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="px-4 py-2 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              style={{ backgroundColor: '#153d5d' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2a42'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#153d5d'}
              aria-label="Search for visitor"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-3 h-3" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && !visit && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}
        </div>
      </div>

      {visit && (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
    {/* Status Header */}
    <div className={`p-6 ${
      canCheckIn ? 'bg-green-50 border-b border-green-200' :
      visit.status === 'completed' ? 'bg-blue-50 border-b border-blue-200' :
      'bg-yellow-50 border-b border-yellow-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            canCheckIn ? 'bg-green-600' :
            visit.status === 'completed' ? 'bg-[#153d5d]' :
            'bg-yellow-600'
          }`}>
            {canCheckIn ? (
              <UserCheck className="w-8 h-8 text-white" />
            ) : visit.status === 'completed' ? (
              <CheckCircle className="w-8 h-8 text-white bg-[#153d5d]" />
            ) : (
              <Clock className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {canCheckIn ? 'Ready to Check In' :
               visit.status === 'completed' ? 'Already Checked In' :
               visit.status === 'pending' ? 'Pending Approval' :
               'Visit Status: ' + visit.status}
            </h2>
            <p className="text-gray-600">
              {canCheckIn ? 'This visitor is approved and ready to enter' :
               visit.status === 'completed' ? 'This visitor has already been checked in' :
               'This visit requires approval before check-in'}
            </p>
          </div>
        </div>
        {canCheckIn && (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Check In Now
          </button>
        )}
      </div>
    </div>

    {/* Visitor & Student Info */}
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Visitor Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            Visitor Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Parent Name</label>
                <p className="text-lg font-semibold text-gray-900">{visit.parentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Phone Number</label>
                <p className="text-gray-900 font-mono">{visit.parentPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Student Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Student Name</label>
                <p className="text-lg font-semibold text-gray-900">{visit.studentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Student ID</label>
                <p className="text-gray-900 font-mono text-lg">{visit.studentId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Lottie Animation */}
      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
        {visit.status === 'completed' ? (
              <Lottie animationData={animation} loop={true} />
            ) : (
              <Lottie animationData={pending} loop={true} />
            )}
        
      </div>
    </div>

    {/* Checked-in Info */}
    {visit.checkedInAt && (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Checked in at:</span> {visit.checkedInAt}
        </p>
      </div>
    )}
  </div>
)}


      {!visit && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Lottie animationData={animationData} loop={true} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Verify Parents</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            When parents arrive at the school gate, they can enter their Visit ID or phone number to verify their approved visit and check in.
            This ensures only authorized visitors enter the school.
          </p>
        </div>
      )}
    </div>
  );
}
