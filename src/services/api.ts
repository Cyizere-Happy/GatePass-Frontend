import type { Visit, Student, Transaction, DashboardStats, VisitingDay } from '../types';


const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    grade: 'Grade 5',
    class: 'A',
    guardianName: 'Jane Doe',
    guardianPhone: '+250 788 123 456',
    guardianEmail: 'jane.doe@email.com',
    address: 'Kigali, Rwanda',
    enrollmentDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mary Smith',
    grade: 'Grade 6',
    class: 'B',
    guardianName: 'Robert Smith',
    guardianPhone: '+250 789 234 567',
    guardianEmail: 'robert.smith@email.com',
    address: 'Kigali, Rwanda',
    enrollmentDate: '2023-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'David Johnson',
    grade: 'Grade 4',
    class: 'C',
    guardianName: 'Sarah Johnson',
    guardianPhone: '+250 790 345 678',
    guardianEmail: 'sarah.johnson@email.com',
    address: 'Kigali, Rwanda',
    enrollmentDate: '2023-03-10',
    status: 'active'
  },
];

const mockVisits: Visit[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    parentName: 'Jane Doe',
    parentPhone: '+250 788 123 456',
    visitDate: '2024-01-15',
    visitTime: '10:00',
    purpose: 'Parent meeting',
    status: 'completed',
    paymentStatus: 'completed',
    paymentAmount: 1000,
    transactionId: 'txn_001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Mary Smith',
    parentName: 'Robert Smith',
    parentPhone: '+250 789 234 567',
    visitDate: '2024-01-16',
    visitTime: '14:00',
    purpose: 'Academic discussion',
    status: 'pending',
    paymentStatus: 'pending',
    paymentAmount: 1000,
    transactionId: 'txn_002',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z'
  }
];

const mockDashboardStats: DashboardStats = {
  totalVisitsToday: 5,
  pendingApprovals: 3,
  activeVisitors: 2,
  totalStudents: 150,
  visitsThisMonth: 45,
  completedVisitsToday: 2,
  cancelledVisitsToday: 1,
  studentsVisitedToday: 3,
  studentsNotVisitedToday: 147
};

const mockVisitingDays: VisitingDay[] = [
  {
    id: '1',
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '15:00',
    maxVisitors: 50,
    currentVisitors: 12,
    status: 'scheduled',
    notes: 'Regular visiting day',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-25',
    startTime: '10:00',
    endTime: '16:00',
    maxVisitors: 30,
    currentVisitors: 8,
    status: 'scheduled',
    notes: 'Special visiting day for parents',
    createdAt: '2024-01-16T10:00:00Z'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(500); // Simulate network delay
    return mockDashboardStats;
  },

  async getVisits(params?: {
    status?: string;
    date?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ visits: Visit[]; total: number }> {
    await delay(300);
    let filteredVisits = [...mockVisits];
    
    if (params?.status) {
      filteredVisits = filteredVisits.filter(visit => visit.status === params.status);
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredVisits = filteredVisits.filter(visit => 
        visit.parentName.toLowerCase().includes(searchTerm) ||
        visit.purpose.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      visits: filteredVisits,
      total: filteredVisits.length
    };
  },

  async getVisitById(id: string): Promise<Visit> {
    await delay(200);
    const visit = mockVisits.find(v => v.id === id);
    if (!visit) throw new Error('Visit not found');
    return visit;
  },

  async approveVisit(id: string): Promise<Visit> {
    await delay(300);
    const visit = mockVisits.find(v => v.id === id);
    if (!visit) throw new Error('Visit not found');
    visit.status = 'approved';
    visit.updatedAt = new Date().toISOString();
    return visit;
  },

  async checkInVisit(id: string): Promise<Visit> {
    await delay(300);
    const visit = mockVisits.find(v => v.id === id);
    if (!visit) throw new Error('Visit not found');
    visit.status = 'checked-in';
    visit.updatedAt = new Date().toISOString();
    return visit;
  },

  async completeVisit(id: string): Promise<Visit> {
    await delay(300);
    const visit = mockVisits.find(v => v.id === id);
    if (!visit) throw new Error('Visit not found');
    visit.status = 'completed';
    visit.updatedAt = new Date().toISOString();
    return visit;
  },

  async cancelVisit(id: string, _reason: string): Promise<Visit> {
    await delay(300);
    const visit = mockVisits.find(v => v.id === id);
    if (!visit) throw new Error('Visit not found');
    visit.status = 'cancelled';
    visit.updatedAt = new Date().toISOString();
    return visit;
  },

  async getStudents(params?: {
    search?: string;
    grade?: string;
    page?: number;
    limit?: number;
  }): Promise<{ students: Student[]; total: number }> {
    await delay(300);
    let filteredStudents = [...mockStudents];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.guardianName.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params?.grade) {
      filteredStudents = filteredStudents.filter(student => student.grade === params.grade);
    }
    
    return {
      students: filteredStudents,
      total: filteredStudents.length
    };
  },

  async getStudentById(id: string): Promise<Student> {
    await delay(200);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  },

  async getTransactions(_params?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    await delay(300);
    // Return empty transactions for now
    return {
      transactions: [],
      total: 0
    };
  },

  async exportReport(type: 'visits' | 'transactions' | 'students', format: 'csv' | 'pdf'): Promise<Blob> {
    await delay(1000);
    // Create a simple text blob for demo
    const content = `Report: ${type}\nFormat: ${format}\nGenerated: ${new Date().toISOString()}`;
    return new Blob([content], { type: 'text/plain' });
  },

  // Visiting Days API
  async getVisitingDays(params?: {
    date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ visitingDays: VisitingDay[]; total: number }> {
    await delay(300);
    let filteredDays = [...mockVisitingDays];
    
    if (params?.status) {
      filteredDays = filteredDays.filter(day => day.status === params.status);
    }
    
    return {
      visitingDays: filteredDays,
      total: filteredDays.length
    };
  },

  async createVisitingDay(data: {
    date: string;
    startTime: string;
    endTime: string;
    maxVisitors: number;
    notes?: string;
  }): Promise<VisitingDay> {
    await delay(500);
    const newDay: VisitingDay = {
      id: Date.now().toString(),
      ...data,
      currentVisitors: 0,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    mockVisitingDays.push(newDay);
    return newDay;
  },

  async updateVisitingDay(id: string, data: Partial<VisitingDay>): Promise<VisitingDay> {
    await delay(300);
    const dayIndex = mockVisitingDays.findIndex(d => d.id === id);
    if (dayIndex === -1) throw new Error('Visiting day not found');
    
    mockVisitingDays[dayIndex] = { ...mockVisitingDays[dayIndex], ...data };
    return mockVisitingDays[dayIndex];
  },

  async cancelVisitingDay(id: string, _reason: string): Promise<VisitingDay> {
    await delay(300);
    const dayIndex = mockVisitingDays.findIndex(d => d.id === id);
    if (dayIndex === -1) throw new Error('Visiting day not found');
    
    mockVisitingDays[dayIndex].status = 'cancelled';
    return mockVisitingDays[dayIndex];
  },
};