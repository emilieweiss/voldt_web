import { Routes, Route } from 'react-router'
import Navbar from './components/Nav'

import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import CreateJob from './pages/CreateJob'
import JobList from './pages/JobList'
import EditJobList from './pages/EditJobList'

function App() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/job-list" element={<JobList />} />
          <Route path="/edit-job/:id" element={<EditJobList />} />
        </Routes>
      </div>
    </div>
  )
}

export default App