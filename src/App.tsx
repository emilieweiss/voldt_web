import { Routes, Route, useLocation } from 'react-router';
import Navbar from './components/Nav';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import CreateJob from './pages/CreateJob';
import JobList from './pages/JobList';
import EditJobList from './pages/EditJobList';
import RequireAuth from './context/RequireAuth';
import { Toaster } from 'sonner';
import TempImageUploader from './pages/TempUploader';
import ApproveUserJob from './pages/ApproveUserJob';
import EditJobListDefault from './pages/EditJobListDefault';

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <Toaster />
      <div
        className={
          isAuthPage
            ? 'flex-1 flex items-center justify-center p-6'
            : 'flex-1 p-6 lg:px-30'
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/temp" element={<TempImageUploader />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/create-job"
            element={
              <RequireAuth>
                <CreateJob />
              </RequireAuth>
            }
          />
          <Route
            path="/job-list"
            element={
              <RequireAuth>
                <JobList />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-job"
            element={
              <RequireAuth>
                <EditJobListDefault />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <RequireAuth>
                <EditJobList />
              </RequireAuth>
            }
          />
          <Route
            path="/approve"
            element={
              <RequireAuth>
                <ApproveUserJob />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
