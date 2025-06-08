import React from 'react';
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageComplaints: React.FC = () => {
  const { complaints, updateComplaint } = useData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under_consideration':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'forwarded_to_principal':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_consideration':
        return 'bg-blue-100 text-blue-800';
      case 'forwarded_to_principal':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    updateComplaint(complaintId, newStatus as any);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Complaints</h1>
        <p className="text-gray-600 mt-1">Review and update complaint status</p>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(complaint.status)}
                  <h3 className="text-lg font-semibold text-gray-900">{complaint.issue}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Details</p>
                    <p className="font-medium text-gray-900">{complaint.studentName}</p>
                    <p className="text-sm text-gray-600">Roll: {complaint.studentRollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reported By</p>
                    <p className="font-medium text-gray-900">{complaint.facultyName}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(complaint.dateRaised).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{complaint.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(complaint.id, 'under_consideration')}
                    disabled={complaint.status === 'under_consideration'}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Under Consideration
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(complaint.id, 'forwarded_to_principal')}
                    disabled={complaint.status === 'forwarded_to_principal'}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Forward to Principal
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                    disabled={complaint.status === 'resolved'}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {complaints.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No complaints to review</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;