import React, { useState } from 'react';
import { ClipboardList, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const SubmitLeaveRequest: React.FC = () => {
  const { addLeaveRequest, exams } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    examId: '',
    reason: ''
  });

  const upcomingExams = exams.filter(exam => exam.status === 'scheduled');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedExam = exams.find(exam => exam.id === formData.examId);
    
    if (user && selectedExam) {
      addLeaveRequest({
        studentId: user.id,
        studentName: user.name,
        studentRollNumber: user.rollNumber || '',
        examId: formData.examId,
        examSubject: selectedExam.subject,
        reason: formData.reason,
        status: 'pending',
        dateSubmitted: new Date().toISOString().split('T')[0]
      });

      setFormData({
        examId: '',
        reason: ''
      });

      alert('Leave request submitted successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit Leave Request</h1>
        <p className="text-gray-600 mt-1">Request leave for upcoming exams</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Leave Request Form</h2>
              <p className="text-sm text-gray-600">Submit your request for exam leave</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Exam
              </label>
              <select
                value={formData.examId}
                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose an exam</option>
                {upcomingExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.subject} - {new Date(exam.date).toLocaleDateString()} at {exam.time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Leave
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Please provide a detailed reason for your leave request (e.g., medical emergency, family emergency, etc.)"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Leave requests must be submitted at least 24 hours before the exam. 
                    Approval is subject to admin review and valid documentation may be required.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ClipboardList className="w-4 h-4" />
                Submit Leave Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitLeaveRequest;