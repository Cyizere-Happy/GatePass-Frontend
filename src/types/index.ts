export interface Visit {
  id: string;
  parentName: string;
  parentPhone: string;
  studentName: string;
  studentId: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'checked-in' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  transactionId: string;
  createdAt: string;
  updatedAt?: string;
  checkedInAt?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address?: string;
  enrollmentDate: string;
  status?: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  visitId: string;
  parentName: string;
  amount: number;
  paymentMethod: 'momo' | 'stripe' | 'flutterwave';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionDate: string;
  reference: string;
}

export interface DashboardStats {
  totalVisitsToday: number;
  pendingApprovals: number;
  activeVisitors: number;
  totalStudents: number;
  visitsThisMonth: number;
  completedVisitsToday: number;
  cancelledVisitsToday: number;
  studentsVisitedToday: number;
  studentsNotVisitedToday: number;
}

export interface SchoolVisit {
  id: string;
  visitTitle: string;
  visitType: 'field_trip' | 'guest_speaker' | 'school_event' | 'inspection' | 'other';
  scheduledDate: string;
  scheduledTime: string;
  duration: string; // e.g., "2 hours", "Full day"
  location: string;
  description: string;
  organizer: string;
  contactPerson: string;
  contactPhone: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: number; // Number of students/staff participating
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface VisitingDay {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxVisitors: number;
  currentVisitors: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}
