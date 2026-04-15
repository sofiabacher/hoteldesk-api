import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import SessionExpiredSnackbar from './components/SessionExpiredSnackbar'
import UserDeletedAlert from './components/UserDeletedAlert'

import LoginSignUp from './pages/Auth'
import Home from './pages/Home'
import Activate from './pages/ActivateUser'
import ResetPassword from './pages/ResetPassword'
import UserProfile from './pages/UserProfile'

import Booking from './pages/Booking'
import MyReservations from './pages/MyReservations'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'

import UsersPage from './pages/UsersPage'
import AdminDashboard from './pages/AdminDashboard'
import CleaningDashboard from './pages/CleaningDashboard'
import ReportDetailPage from './pages/ReportDetailPage'
import RoomManagement from './pages/RoomManagement'
import BitacoraManagement from './pages/BitacoraManagement'
import RoleManagement from './pages/RoleManagement'
import AssignRole from './pages/AssignRole'
import PermissionManagement from './pages/PermissionManagement'
import AssignPermission from './pages/AssignPermission'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import ReceptionistCheckIn from './pages/ReceptionistCheckIn'
import ReceptionistCheckOut from './pages/ReceptionistCheckOut'


function App() {
  return (
    <>
      <SessionExpiredSnackbar />
      <UserDeletedAlert />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<LoginSignUp/>} />
        <Route path="/activate" element={<Activate/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        
        <Route path="/rooms" element={<Rooms/>} />
        <Route path="/rooms/:id" element={<RoomDetail/>} />

        <Route path="/profile" element={<PrivateRoute allowRoles={['admin', 'recepcionist', 'cleaning', 'guest']}>  <UserProfile/> </PrivateRoute>} />

        <Route path="/recepcionist" element={<PrivateRoute allowRoles={['recepcionist']}> <ReceptionistDashboard/> </PrivateRoute>} />
        <Route path="/recepcionist/checkin" element={<PrivateRoute allowRoles={['recepcionist']}> <ReceptionistCheckIn /> </PrivateRoute>} />
        <Route path="/recepcionist/checkout" element={<PrivateRoute allowRoles={['recepcionist']}> <ReceptionistCheckOut /> </PrivateRoute>} />

        <Route path='/booking' element={<PrivateRoute allowRoles={['guest']}> <Booking /> </PrivateRoute>} />
        <Route path="/my-reservations" element={<PrivateRoute allowRoles={['guest']}> <MyReservations /> </PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute allowRoles={['admin']}> <AdminDashboard /> </PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute allowRoles={['admin']}> <UsersPage /> </PrivateRoute>} />
        <Route path="/admin/reports/:reportId" element={<PrivateRoute allowRoles={['admin']}> <ReportDetailPage /> </PrivateRoute>} />
        <Route path="/admin/rooms" element={<PrivateRoute allowRoles={['admin']}> <RoomManagement /> </PrivateRoute>} />
        <Route path="/admin/bitacora" element={<PrivateRoute allowRoles={['admin']}> <BitacoraManagement /> </PrivateRoute>} />
        <Route path="/admin/roles" element={<PrivateRoute allowRoles={['admin']}> <RoleManagement /> </PrivateRoute>} />
        <Route path="/admin/role-management" element={<PrivateRoute allowRoles={['admin']}> <RoleManagement /> </PrivateRoute>} />
        <Route path="/admin/assign-role" element={<PrivateRoute allowRoles={['admin']}> <AssignRole /> </PrivateRoute>} />
        <Route path="/admin/permissions" element={<PrivateRoute allowRoles={['admin']}> <PermissionManagement /> </PrivateRoute>} />
        <Route path="/admin/assign-permission" element={<PrivateRoute allowRoles={['admin']}> <AssignPermission /> </PrivateRoute>} />

        <Route path="/cleaning" element={<PrivateRoute allowRoles={['admin', 'cleaning']}> <CleaningDashboard /> </PrivateRoute>} />

      </Routes>
    </>
  )
}



export default App