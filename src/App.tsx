import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import FacultyDashboard from './components/Dashboard/FacultyDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';

// Admin Components
import ScheduleExams from './components/Admin/ScheduleExams';
import ManageClassrooms from './components/Admin/ManageClassrooms';
import SeatingArrangements from './components/Admin/SeatingArrangements';
import FacultyAvailability from './components/Admin/FacultyAvailability';
import ManageComplaints from './components/Admin/ManageComplaints';
import ManageLeaveRequests from './components/Admin/ManageLeaveRequests';

// Faculty Components
import UpdateAvailability from './components/Faculty/UpdateAvailability';
import RaiseComplaint from './components/Faculty/RaiseComplaint';

// Student Components
import SubmitLeaveRequest from './components/Student/SubmitLeaveRequest';
import MyLeaveRequests from './components/Student/MyLeaveRequests';
import MyComplaints from './components/Student/MyComplaints';

// Public Dashboard (shows when not logged in)
import PublicDashboard from './components/Dashboard/PublicDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <PublicDashboard />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardRouter />} />
              
              {/* Admin Routes */}
              <Route path="schedule-exams" element={<ScheduleExams />} />
              <Route path="classrooms" element={<ManageClassrooms />} />
              <Route path="seating" element={<SeatingArrangements />} />
              <Route path="faculty-availability" element={<FacultyAvailability />} />
              <Route path="complaints" element={<ManageComplaints />} />
              <Route path="leave-requests" element={<ManageLeaveRequests />} />
              
              {/* Faculty Routes */}
              <Route path="availability" element={<UpdateAvailability />} />
              <Route path="raise-complaint" element={<RaiseComplaint />} />
              
              {/* Student Routes */}
              <Route path="submit-leave" element={<SubmitLeaveRequest />} />
              <Route path="my-leave-requests" element={<MyLeaveRequests />} />
              <Route path="my-complaints" element={<MyComplaints />} />
              
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;