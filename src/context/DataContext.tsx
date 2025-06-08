import React, { createContext, useContext, useState } from 'react';
import { Exam, Classroom, Complaint, LeaveRequest, InvigilatorAvailability, Student, SeatingArrangement, FacultyExamAssignment } from '../types';

interface DataContextType {
  exams: Exam[];
  classrooms: Classroom[];
  complaints: Complaint[];
  leaveRequests: LeaveRequest[];
  invigilatorAvailability: InvigilatorAvailability[];
  students: Student[];
  seatingArrangements: SeatingArrangement[];
  facultyExamAssignments: FacultyExamAssignment[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id'>) => void;
  updateComplaint: (id: string, status: Complaint['status']) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveRequest: (id: string, status: LeaveRequest['status'], comments?: string) => void;
  updateInvigilatorAvailability: (availability: Omit<InvigilatorAvailability, 'id'>) => void;
  addSeatingArrangement: (arrangement: Omit<SeatingArrangement, 'id'>) => void;
  assignFacultyToExam: (examId: string, facultyId: string, facultyName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', rollNumber: 'CS2021001', year: 3, section: 'A', department: 'Computer Science' },
  { id: '2', name: 'Bob Smith', rollNumber: 'CS2021002', year: 3, section: 'A', department: 'Computer Science' },
  { id: '3', name: 'Carol Davis', rollNumber: 'CS2022001', year: 2, section: 'B', department: 'Computer Science' },
  { id: '4', name: 'David Wilson', rollNumber: 'CS2022002', year: 2, section: 'B', department: 'Computer Science' },
  { id: '5', name: 'Eve Brown', rollNumber: 'CS2023001', year: 1, section: 'A', department: 'Computer Science' },
  { id: '6', name: 'Frank Miller', rollNumber: 'CS2023002', year: 1, section: 'A', department: 'Computer Science' },
  { id: '7', name: 'Grace Lee', rollNumber: 'CS2021003', year: 3, section: 'A', department: 'Computer Science' },
  { id: '8', name: 'Henry Clark', rollNumber: 'CS2022003', year: 2, section: 'A', department: 'Computer Science' },
  { id: '9', name: 'Ivy Martinez', rollNumber: 'CS2023003', year: 1, section: 'B', department: 'Computer Science' },
  { id: '10', name: 'Jack Taylor', rollNumber: 'CS2021004', year: 3, section: 'B', department: 'Computer Science' },
];

const mockExams: Exam[] = [
  {
    id: '1',
    subject: 'Data Structures & Algorithms',
    date: '2024-02-15',
    time: '09:00',
    duration: 180,
    totalStudents: 85,
    status: 'scheduled',
    year: 3,
    section: 'A'
  },
  {
    id: '2',
    subject: 'Database Management Systems',
    date: '2024-02-18',
    time: '14:00',
    duration: 180,
    totalStudents: 92,
    status: 'scheduled',
    year: 2,
    section: 'B'
  },
  {
    id: '3',
    subject: 'Computer Networks',
    date: '2024-02-20',
    time: '09:00',
    duration: 180,
    totalStudents: 78,
    status: 'scheduled',
    year: 1,
    section: 'A'
  }
];

const mockClassrooms: Classroom[] = [
  {
    id: '1',
    name: 'Room 101',
    type: 'room',
    capacity: 30,
    benches: 15,
    benchCapacity: 2,
    available: true
  },
  {
    id: '2',
    name: 'Seminar Hall A',
    type: 'seminar_hall',
    capacity: 100,
    rows: 10,
    columns: 10,
    seatsPerRow: 10,
    available: true
  },
  {
    id: '3',
    name: 'Room 205',
    type: 'room',
    capacity: 45,
    benches: 15,
    benchCapacity: 3,
    available: false
  }
];

const mockComplaints: Complaint[] = [
  {
    id: '1',
    studentName: 'John Smith',
    studentRollNumber: 'CS2021001',
    facultyId: '2',
    facultyName: 'Dr. Sarah Johnson',
    issue: 'Cheating',
    status: 'pending',
    dateRaised: '2024-02-10',
    description: 'Student was caught looking at another student\'s paper during the midterm exam.'
  },
  {
    id: '2',
    studentName: 'Alice Johnson',
    studentRollNumber: 'CS2022001',
    facultyId: '2',
    facultyName: 'Dr. Sarah Johnson',
    issue: 'Misbehavior',
    status: 'under_consideration',
    dateRaised: '2024-02-08',
    description: 'Student was disruptive during lecture and refused to follow instructions.'
  }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentId: '3',
    studentName: 'John Smith',
    studentRollNumber: 'CS2021001',
    examId: '1',
    examSubject: 'Data Structures & Algorithms',
    reason: 'Medical emergency - hospitalization required',
    status: 'pending',
    dateSubmitted: '2024-02-12'
  }
];

const mockInvigilatorAvailability: InvigilatorAvailability[] = [
  {
    id: '1',
    facultyId: '2',
    facultyName: 'Dr. Sarah Johnson',
    availableDates: ['2024-02-15', '2024-02-18', '2024-02-20'],
    availableTimes: ['09:00', '14:00', '16:00']
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [invigilatorAvailability, setInvigilatorAvailability] = useState<InvigilatorAvailability[]>(mockInvigilatorAvailability);
  const [students] = useState<Student[]>(mockStudents);
  const [seatingArrangements, setSeatingArrangements] = useState<SeatingArrangement[]>([]);
  const [facultyExamAssignments, setFacultyExamAssignments] = useState<FacultyExamAssignment[]>([]);

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: Date.now().toString() };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, examData: Partial<Exam>) => {
    setExams(prev => prev.map(exam => exam.id === id ? { ...exam, ...examData } : exam));
  };

  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    const newClassroom = { ...classroom, id: Date.now().toString() };
    setClassrooms(prev => [...prev, newClassroom]);
  };

  const updateClassroom = (id: string, updates: Partial<Classroom>) => {
    setClassrooms(prev => prev.map(classroom => 
      classroom.id === id ? { ...classroom, ...updates } : classroom
    ));
  };

  const addComplaint = (complaint: Omit<Complaint, 'id'>) => {
    const newComplaint = { ...complaint, id: Date.now().toString() };
    setComplaints(prev => [...prev, newComplaint]);
  };

  const updateComplaint = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id ? { ...complaint, status } : complaint
    ));
  };

  const addLeaveRequest = (request: Omit<LeaveRequest, 'id'>) => {
    const newRequest = { ...request, id: Date.now().toString() };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const updateLeaveRequest = (id: string, status: LeaveRequest['status'], comments?: string) => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status, adminComments: comments } : request
    ));
  };

  const updateInvigilatorAvailability = (availability: Omit<InvigilatorAvailability, 'id'>) => {
    const existingIndex = invigilatorAvailability.findIndex(a => a.facultyId === availability.facultyId);
    if (existingIndex >= 0) {
      setInvigilatorAvailability(prev => prev.map((a, index) => 
        index === existingIndex ? { ...availability, id: a.id } : a
      ));
    } else {
      const newAvailability = { ...availability, id: Date.now().toString() };
      setInvigilatorAvailability(prev => [...prev, newAvailability]);
    }
  };

  const addSeatingArrangement = (arrangement: Omit<SeatingArrangement, 'id'>) => {
    const newArrangement = { ...arrangement, id: Date.now().toString() };
    setSeatingArrangements(prev => [...prev, newArrangement]);
  };

  const assignFacultyToExam = (examId: string, facultyId: string, facultyName: string) => {
    const newAssignment: FacultyExamAssignment = {
      id: Date.now().toString(),
      examId,
      facultyId,
      facultyName,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    setFacultyExamAssignments(prev => [...prev, newAssignment]);
  };

  return (
    <DataContext.Provider value={{
      exams,
      classrooms,
      complaints,
      leaveRequests,
      invigilatorAvailability,
      students,
      seatingArrangements,
      facultyExamAssignments,
      addExam,
      updateExam,
      addClassroom,
      updateClassroom,
      addComplaint,
      updateComplaint,
      addLeaveRequest,
      updateLeaveRequest,
      updateInvigilatorAvailability,
      addSeatingArrangement,
      assignFacultyToExam
    }}>
      {children}
    </DataContext.Provider>
  );
};