import React, { useState } from 'react';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const RaiseComplaint: React.FC = () => {
  const { addComplaint } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentName: '',
    studentRollNumber: '',
    issue: '',
    description: ''
  });

  const issueTypes = [
    'Cheating',
    'Misbehavior',
    'Disruption',
    'Attendance Issues',
    'Academic Misconduct',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      addComplaint({
        studentName: formData.studentName,
        studentRollNumber: formData.studentRollNumber,
        facultyId: user.id,
        facultyName: user.name,
        issue: formData.issue,
        status: 'pending',
        dateRaised: new Date().toISOString().split('T')[0],
        description: formData.description
      });

      setFormData({
        studentName: '',
        studentRollNumber: '',
        issue: '',
        description: ''
      });

      alert('Complaint raised successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Raise Complaint</h1>
        <p className="text-gray-600 mt-1">Report student misconduct or issues</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Complaint Form</h2>
              <p className="text-sm text-gray-600">Please provide detailed information about the incident</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={formData.studentRollNumber}
                  onChange={(e) => setFormData({ ...formData, studentRollNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter roll number (e.g., CS2021001)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type *
              </label>
              <select
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select issue type</option>
                {issueTypes.map((issue) => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Provide a detailed description of the incident, including date, time, and circumstances"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please ensure the student name and roll number are accurate. This complaint will be visible to the admin and the student.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;