import React from 'react';
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const MyComplaints: React.FC = () => {
  const { complaints } = useData();
  const { user } = useAuth();

  const myComplaints = complaints.filter(complaint => 
    complaint.studentRollNumber === user?.rollNumber
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under_consideration':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'forwarded_to_principal':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complaints Against Me</h1>
        <p className="text-gray-600 mt-1">View complaints raised by faculty members</p>
      </div>

      <div className="space-y-4">
        {myComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(complaint.status)}
                  <h3 className="text-lg font-semibold text-red-900">{complaint.issue}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-red-700 mb-1">Description</p>
                  <p className="text-red-900">{complaint.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
                  <div>
                    <p className="font-medium">Reported By</p>
                    <p>{complaint.facultyName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date Raised</p>
                    <p>{new Date(complaint.dateRaised).toLocaleDateString()}</p>
                  </div>
                </div>

                {complaint.status === 'resolved' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      This complaint has been resolved. If you have any concerns, please contact the administration.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {myComplaints.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
            <p className="text-gray-500">No complaints raised against you</p>
            <p className="text-sm text-gray-400 mt-1">Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;