import React from 'react';
import { Users, FileText, Building2, MessageSquare, Calendar, Clock, TrendingUp, UserCheck } from 'lucide-react';
import OverviewCard from './OverviewCard';
import { useData } from '../../context/DataContext';

const AdminDashboard: React.FC = () => {
  const { exams, classrooms, complaints, leaveRequests, students, invigilatorAvailability } = useData();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of exam management system</p>
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
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    View Seating
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Availability */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Faculty Availability
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {invigilatorAvailability.map((availability) => (
                <div key={availability.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{availability.facultyName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Available on {availability.availableDates.length} dates
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {availability.availableTimes.slice(0, 3).map((time, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {time}
                          </span>
                        ))}
                        {availability.availableTimes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{availability.availableTimes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Available
                    </span>
                  </div>
                </div>
              ))}
              {invigilatorAvailability.length === 0 && (
                <p className="text-gray-500 text-center py-4">No faculty availability set</p>
              )}
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
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Reject
                    </button>
                  </div>
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
  );
};

export default AdminDashboard;