import React from 'react';
import { Users, FileText, Building2, MessageSquare, Calendar, Clock, TrendingUp, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OverviewCard from './OverviewCard';
import { useData } from '../../context/DataContext';

const PublicDashboard: React.FC = () => {
  const { exams, classrooms, complaints, leaveRequests, students } = useData();
  const navigate = useNavigate();

  const upcomingExams = exams.filter(exam => exam.status === 'scheduled');
  const availableClassrooms = classrooms.filter(room => room.available);
  const pendingComplaints = complaints.filter(complaint => complaint.status === 'pending');
  const pendingLeaveRequests = leaveRequests.filter(request => request.status === 'pending');

  // Student distribution data
  const studentsBySection = students.reduce((acc, student) => {
    const key = `Year ${student.year} - Section ${student.section}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ExamHub Dashboard</h1>
        <p className="text-gray-600 mb-4">Comprehensive Exam Management System Overview</p>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <LogIn className="w-5 h-5" />
          Login to Access Full Features
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Students"
          value={students.length}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <OverviewCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          icon={FileText}
          color="green"
        />
        <OverviewCard
          title="Available Classrooms"
          value={availableClassrooms.length}
          icon={Building2}
          color="purple"
        />
        <OverviewCard
          title="Pending Complaints"
          value={pendingComplaints.length}
          icon={MessageSquare}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Exams
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingExams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{exam.subject}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(exam.date).toLocaleDateString()} at {exam.time}
                    </p>
                    <p className="text-sm text-gray-500">{exam.totalStudents} students</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Duration</span>
                    <p className="text-sm font-medium text-gray-900">{exam.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students by Section Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Students by Section
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(studentsBySection).map(([section, count]) => (
                <div key={section} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{section}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(studentsBySection))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Complaints
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complaints.slice(0, 3).map((complaint) => (
                <div key={complaint.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{complaint.studentName}</h3>
                      <p className="text-sm text-gray-600">Roll: {complaint.studentRollNumber}</p>
                      <p className="text-sm text-gray-700 mt-1">{complaint.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">By {complaint.facultyName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'under_consideration' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Leave Requests
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingLeaveRequests.map((request) => (
                <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{request.studentName}</h3>
                      <p className="text-sm text-gray-600">Roll: {request.studentRollNumber}</p>
                      <p className="text-sm text-gray-700 mt-1">Exam: {request.examSubject}</p>
                      <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                  </div>
                </div>
              ))}
              {pendingLeaveRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending leave requests</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Full Features</h3>
        <p className="text-gray-600 mb-4">Login as Admin, Faculty, or Student to access role-specific features</p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <h4 className="font-medium text-gray-900">Admin</h4>
            <p className="text-sm text-gray-600">Schedule exams, manage classrooms, seating arrangements</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900">Faculty</h4>
            <p className="text-sm text-gray-600">Update availability, raise complaints</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900">Student</h4>
            <p className="text-sm text-gray-600">Submit leave requests, view complaints</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;