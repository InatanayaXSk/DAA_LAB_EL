import React from 'react';
import { FileText, MessageSquare, Calendar, Clock, AlertCircle, Eye } from 'lucide-react';
import OverviewCard from '../Dashboard/OverviewCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard: React.FC = () => {
  const { exams, leaveRequests, complaints, seatingArrangements } = useData();
  const { user } = useAuth();

  const upcomingExams = exams.filter(exam => exam.status === 'scheduled');
  const myLeaveRequests = leaveRequests.filter(request => request.studentId === user?.id);
  const complaintsAgainstMe = complaints.filter(complaint => 
    complaint.studentRollNumber === user?.rollNumber
  );

  const getSeatingArrangement = (examId: string) => {
    return seatingArrangements.find(arrangement => arrangement.examId === examId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        {user?.rollNumber && (
          <p className="text-sm text-gray-500">Roll Number: {user.rollNumber}</p>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          icon={Calendar}
          color="blue"
        />
        <OverviewCard
          title="Leave Requests"
          value={myLeaveRequests.length}
          icon={FileText}
          color="green"
        />
        <OverviewCard
          title="Pending Requests"
          value={myLeaveRequests.filter(r => r.status === 'pending').length}
          icon={Clock}
          color="orange"
        />
        <OverviewCard
          title="Complaints"
          value={complaintsAgainstMe.length}
          icon={AlertCircle}
          color="red"
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
              {upcomingExams.slice(0, 5).map((exam) => {
                const seatingArrangement = getSeatingArrangement(exam.id);
                
                return (
                  <div key={exam.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{exam.subject}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(exam.date).toLocaleDateString()} at {exam.time}
                        </p>
                        <p className="text-sm text-gray-600">Duration: {exam.duration} minutes</p>
                        <p className="text-sm text-gray-500">Year {exam.year} - Section {exam.section}</p>
                      </div>
                      <div className="text-right space-y-2">
                        {seatingArrangement && (
                          <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                            <Eye className="w-4 h-4" />
                            View Seating
                          </button>
                        )}
                        <button className="block px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcomingExams.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming exams</p>
              )}
            </div>
          </div>
        </div>

        {/* My Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Leave Requests
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {myLeaveRequests.map((request) => (
                <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{request.examSubject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on {new Date(request.dateSubmitted).toLocaleDateString()}
                      </p>
                      {request.adminComments && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Admin:</strong> {request.adminComments}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
              {myLeaveRequests.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No leave requests submitted</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Submit Leave Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Against Me */}
      {complaintsAgainstMe.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200">
          <div className="p-6 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Complaints Against You
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complaintsAgainstMe.map((complaint) => (
                <div key={complaint.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-red-900">{complaint.issue}</h3>
                      <p className="text-sm text-red-700 mt-1">{complaint.description}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Raised by {complaint.facultyName} on {new Date(complaint.dateRaised).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'under_consideration' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'forwarded_to_principal' ? 'bg-orange-100 text-orange-800' :
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
      )}
    </div>
  );
};

export default StudentDashboard;