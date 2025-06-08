export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  rollNumber?: string;
  department?: string;
  year?: number;
  section?: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  totalStudents: number;
  classroomId?: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  year?: number;
  section?: string;
}

export interface Classroom {
  id: string;
  name: string;
  type: 'room' | 'seminar_hall';
  capacity: number;
  benches?: number;
  benchCapacity?: number;
  rows?: number;
  columns?: number;
  seatsPerRow?: number;
  available: boolean;
  examDate?: string;
}

export interface Complaint {
  id: string;
  studentName: string;
  studentRollNumber: string;
  facultyId: string;
  facultyName: string;
  issue: string;
  status: 'pending' | 'under_consideration' | 'forwarded_to_principal' | 'resolved';
  dateRaised: string;
  description: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  examId: string;
  examSubject: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_review';
  dateSubmitted: string;
  adminComments?: string;
}

export interface InvigilatorAvailability {
  id: string;
  facultyId: string;
  facultyName: string;
  availableDates: string[];
  availableTimes: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: number;
  section: string;
  department: string;
}

export interface SeatingArrangement {
  id: string;
  examId: string;
  classroomId: string;
  seats: {
    position: string;
    student: Student | null;
    benchNumber?: number;
    seatNumber?: number;
    row?: number;
    column?: number;
  }[];
}

export interface FacultyExamAssignment {
  id: string;
  examId: string;
  facultyId: string;
  facultyName: string;
  assignedDate: string;
}