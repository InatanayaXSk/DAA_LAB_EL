import React from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const MyLeaveRequests: React.FC = () => {
  const { leaveRequests } = useData();
  const { user } = useAuth();

  const myRequests = leaveRequests.filter(request => request.studentId === user?.id);

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Leave Requests</h1>
        <p className="text-gray-600 mt-1">Track the status of your exam leave requests</p>
      </div>

      <div className="space-y-4">
        {myRequests.map((request) => (
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

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900">{request.reason}</p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Submitted on: {new Date(request.dateSubmitted).toLocaleDateString()}</p>
                </div>

                {request.adminComments && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-1">Admin Comments</p>
                    <p className="text-blue-700">{request.adminComments}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {myRequests.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leave requests submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeaveRequests;