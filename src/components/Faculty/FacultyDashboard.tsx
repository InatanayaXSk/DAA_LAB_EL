import React from 'react';
import { Users, MessageSquare, Calendar, Clock, CheckCircle, Eye } from 'lucide-react';
import OverviewCard from '../Dashboard/OverviewCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const FacultyDashboard: React.FC = () => {
  const { complaints, invigilatorAvailability, exams, facultyExamAssignments, seatingArrangements } = useData();
  const { user } = useAuth();

  const myComplaints = complaints.filter(complaint => complaint.facultyId === user?.id);
  const myAvailability = invigilatorAvailability.find(a => a.facultyId === user?.id);
  const upcomingExams = exams.filter(exam => exam.status === 'scheduled');
  const myAssignments = facultyExamAssignments.filter(a => a.facultyId === user?.id);

  const getSeatingArrangement = (examId: string) => {
    return seatingArrangements.find(arrangement => arrangement.examId === examId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="My Complaints"
          value={myComplaints.length}
          icon={MessageSquare}
          color="orange"
        />
        <OverviewCard
          title="Available Days"
          value={myAvailability?.availableDates.length || 0}
          icon={Calendar}
          color="green"
        />
        <OverviewCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          icon={Clock}
          color="blue"
        />
        <OverviewCard
          title="My Assignments"
          value={myAssignments.length}
          icon={CheckCircle}
          color="purple"
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
                const isAssigned = myAssignments.some(a => a.examId === exam.id);
                
                return (
                  <div key={exam.id} className={`p-4 rounded-lg border ${isAssigned ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{exam.subject}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(exam.date).toLocaleDateString()} at {exam.time}
                        </p>
                        <p className="text-sm text-gray-500">{exam.totalStudents} students</p>
                        {isAssigned && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Assigned to me
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {seatingArrangement && (
                          <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors mb-2">
                            <Eye className="w-4 h-4" />
                            View Seating
                          </button>
                        )}
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">{exam.duration} min</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              My Complaints
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {myComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{complaint.studentName}</h3>
                      <p className="text-sm text-gray-600">Roll: {complaint.studentRollNumber}</p>
                      <p className="text-sm text-gray-700 mt-1">{complaint.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Raised on {new Date(complaint.dateRaised).toLocaleDateString()}
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
              {myComplaints.length === 0 && (
                <p className="text-gray-500 text-center py-4">No complaints raised yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            My Availability & Assignments
          </h2>
        </div>
        <div className="p-6">
          {myAvailability ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Available Dates</h3>
                  <div className="flex flex-wrap gap-2">
                    {myAvailability.availableDates.map((date, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Available Times</h3>
                  <div className="flex flex-wrap gap-2">
                    {myAvailability.availableTimes.map((time, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Exam Assignments</h3>
                {myAssignments.length > 0 ? (
                  <div className="space-y-2">
                    {myAssignments.map((assignment, index) => {
                      const exam = exams.find(e => e.id === assignment.examId);
                      return (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="font-medium text-yellow-900">{exam?.subject}</h4>
                          <p className="text-sm text-yellow-700">
                            {exam && new Date(exam.date).toLocaleDateString()} at {exam?.time}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No exam assignments yet</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No availability set yet</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Set Availability
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;