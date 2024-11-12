/* eslint-disable react/jsx-no-constructed-context-values */
import './App.css';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import ForgotPassword from 'pages/ForgotPassword/ForgotPassword';
import NotFoundNew from 'pages/NotFound/NotFound';
import LoginNew from 'pages/LoginScreen/LoginScreen';
import FirwareSDKDocumentation from 'pages/FirmwareAndSDK/FirmwareAndSDK';
import { isAuthenticated, logout } from 'utils/';
import UserManagementNew from 'pages/UserManagement/UserManagement';
import AddUser from 'components/AddUser/AddUser';
import DeviceManagement from 'pages/DeviceManagement/DeviceManagement';
import DeviceManageFirmwareAndDID from 'pages/DeviceFirmareAndDID/DeviceFirmareAndDID';
// import ProdDeviceManagement from 'pages/ProdDeviceManagement/ProdDeviceManagement';
// import ProdDeviceManageFirmwareAndDID from 'pages/ProdDeviceFirmware/ProdDeviceFirmware';
import AppVersion from 'pages/AppVersion/AppVersion';
import UpdateDID from 'components/UpdateDID/UpdateDID';
import UploadDatasheet from 'components/UploadDatasheet/UploadDatasheet';
import ResetPassword from 'pages/ResetPassword/ResetPassword';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ImageCarousel from './components/ImageCarousel/ImageCarousel';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Redirect only if user is not authenticated and not on the login/forgot-password page
    if (
      !isAuthenticated() &&
      !['/login', '/forgotPassword', '/resetPassword'].includes(currentPath)
    ) {
      navigate('/login');
      logout();
    }
  }, [navigate]);

  return (
    <div className="App" style={{ height: '100vh' }}>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" Component={LoginNew} />
          <Route path="forgotPassword" Component={ForgotPassword} />
          <Route path="resetPassword" Component={ResetPassword} />

          <Route element={<PrivateRoute />}>
            <Route path="/engineering">
              <Route path="device-management" Component={DeviceManagement} />
              <Route
                path="firmware/:deviceId"
                Component={DeviceManageFirmwareAndDID}
              />
            </Route>

            <Route path="/production">
              <Route path="device-management" Component={DeviceManagement} />

              <Route
                path="firmware/:deviceId"
                Component={DeviceManageFirmwareAndDID}
              />
            </Route>
            <Route
              path="/firmware-management"
              Component={FirwareSDKDocumentation}
            />
            <Route path="/user-management" Component={UserManagementNew} />
            <Route path="/user-management/add-user" Component={AddUser} />
            <Route path="/app-version" Component={AppVersion} />
            <Route path="/image-carousel" Component={ImageCarousel} />
            <Route path="/upload-datasheet" Component={UploadDatasheet} />
            <Route path="force-ota-update" Component={UpdateDID} />
          </Route>
          <Route path="/not-found-new" Component={NotFoundNew} />
          <Route
            path="/"
            element={<Navigate to="/engineering/device-management" />}
          />
          <Route path="*" Component={NotFoundNew} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
