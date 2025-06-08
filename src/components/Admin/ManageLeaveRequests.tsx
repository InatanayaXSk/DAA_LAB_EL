import React, { useState } from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageLeaveRequests: React.FC = () => {
  const { leaveRequests, updateLeaveRequest } = useData();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminComments, setAdminComments] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending_review':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    updateLeaveRequest(requestId, newStatus as any, adminComments);
    setSelectedRequest(null);
    setAdminComments('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Leave Requests</h1>
        <p className="text-gray-600 mt-1">Review and approve student leave requests</p>
      </div>

      <div className="space-y-4">
        {leaveRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(request.status)}
                  <h3 className="text-lg font-semibold text-gray-900">{request.examSubject}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Details</p>
                    <p className="font-medium text-gray-900">{request.studentName}</p>
                    <p className="text-sm text-gray-600">Roll: {request.studentRollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request Details</p>
                    <p className="text-sm text-gray-600">Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900">{request.reason}</p>
                </div>

                {request.adminComments && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Admin Comments</p>
                    <p className="text-gray-900">{request.adminComments}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="space-y-3">
                    {selectedRequest === request.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={adminComments}
                          onChange={(e) => setAdminComments(e.target.value)}
                          placeholder="Add comments (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'pending_review')}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Pending Review
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(null);
                              setAdminComments('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedRequest(request.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Review Request
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {leaveRequests.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leave requests to review</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLeaveRequests;