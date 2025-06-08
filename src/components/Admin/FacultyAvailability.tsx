import React, { useState } from 'react';
import { UserCheck, Calendar, Clock, Plus, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';

const FacultyAvailability: React.FC = () => {
  const { invigilatorAvailability, exams, assignFacultyToExam, facultyExamAssignments } = useData();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');

  const upcomingExams = exams.filter(exam => exam.status === 'scheduled');

  const checkTimeConflict = (facultyId: string, examDate: string, examTime: string) => {
    const faculty = invigilatorAvailability.find(f => f.facultyId === facultyId);
    if (!faculty) return true; // Not available if no availability set

    // Check if faculty is available on the exam date
    const isDateAvailable = faculty.availableDates.some(date => 
      new Date(date).toDateString() === new Date(examDate).toDateString()
    );

    if (!isDateAvailable) return true; // Date conflict

    // Check if faculty is available at the exam time
    const examTimeHour = parseInt(examTime.split(':')[0]);
    const isTimeAvailable = faculty.availableTimes.some(time => {
      const availableTimeHour = parseInt(time.split(':')[0]);
      return Math.abs(examTimeHour - availableTimeHour) < 3; // 3-hour window
    });

    return !isTimeAvailable; // Return true if there's a conflict
  };

  const handleAssignFaculty = () => {
    if (selectedExam && selectedFaculty) {
      const exam = exams.find(e => e.id === selectedExam);
      const faculty = invigilatorAvailability.find(f => f.facultyId === selectedFaculty);
      
      if (exam && faculty) {
        const hasConflict = checkTimeConflict(selectedFaculty, exam.date, exam.time);
        
        if (hasConflict) {
          alert('Faculty is not available during this exam time!');
          return;
        }

        assignFacultyToExam(selectedExam, selectedFaculty, faculty.facultyName);
        alert('Faculty assigned successfully!');
        setSelectedExam('');
        setSelectedFaculty('');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Availability</h1>
        <p className="text-gray-600 mt-1">Manage faculty availability and exam assignments</p>
      </div>

      {/* Assign Faculty to Exam */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Assign Faculty to Exam
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an exam</option>
              {upcomingExams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.subject} - {new Date(exam.date).toLocaleDateString()} at {exam.time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose faculty</option>
              {invigilatorAvailability.map(faculty => {
                const exam = exams.find(e => e.id === selectedExam);
                const hasConflict = exam ? checkTimeConflict(faculty.facultyId, exam.date, exam.time) : false;
                
                return (
                  <option 
                    key={faculty.facultyId} 
                    value={faculty.facultyId}
                    disabled={hasConflict}
                  >
                    {faculty.facultyName} {hasConflict ? '(Not Available)' : '(Available)'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssignFaculty}
              disabled={!selectedExam || !selectedFaculty}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Assign Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Availability List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Faculty Availability Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {invigilatorAvailability.map((faculty) => {
              const assignments = facultyExamAssignments.filter(a => a.facultyId === faculty.facultyId);
              
              return (
                <div key={faculty.facultyId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{faculty.facultyName}</h3>
                      <p className="text-sm text-gray-600">
                        Available on {faculty.availableDates.length} dates
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Available Dates
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {faculty.availableDates.slice(0, 3).map((date, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {new Date(date).toLocaleDateString()}
                          </span>
                        ))}
                        {faculty.availableDates.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{faculty.availableDates.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Available Times
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {faculty.availableTimes.slice(0, 3).map((time, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {time}
                          </span>
                        ))}
                        {faculty.availableTimes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{faculty.availableTimes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {assignments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Assigned Exams
                        </h4>
                        <div className="space-y-1">
                          {assignments.map((assignment, index) => {
                            const exam = exams.find(e => e.id === assignment.examId);
                            return (
                              <div key={index} className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded">
                                {exam?.subject} - {exam && new Date(exam.date).toLocaleDateString()}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {invigilatorAvailability.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No faculty availability set yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAvailability;