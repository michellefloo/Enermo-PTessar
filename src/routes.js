import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const UserManagement = React.lazy(() => import("./views/user-management/UserManagement"));
const BoundaryList = React.lazy(() => import('./views/boundary/Boundary'));
const UtilityList = React.lazy(() => import('./views/utility/Utility'));
const Sensor = React.lazy(() => import('./views/sensor/Sensor'));
const Device = React.lazy(() => import('./views/device/Device'));
const DeviceInstallation = React.lazy(() => import('./views/device-installation/DeviceInstallation'));
const DeviceHistory = React.lazy(() => import('./views/device-history/'));
const DeviceGroup = React.lazy(() => import('./views/device-group/DeviceGroup'))
const Customer = React.lazy(() => import('./views/customers/Customer'));
const Settings = React.lazy(() => import('./views/settings/Settings'));
const DeviceHistoryChart = React.lazy(() => import('./views/device-history-chart/'));
const DeviceSummaryTable = React.lazy(() => import('./views/device-summary-table/DeviceSummaryTable'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/boundary/list', name: 'Boundaries / Boundary List', component: BoundaryList },
  { path: '/utility/list', name: 'Utilities / Utility List', component: UtilityList },
  { path: '/sensor/list', name: 'Sensors / Sensor List', component: Sensor },
  { path: '/device/list', name: 'Devices / Device List', component: Device },
  { path: '/device/installation/list', name: 'Device Installation List', component: DeviceInstallation },
  { path: '/device/history/list', name: 'Device History List', component: DeviceHistory},
  { path: '/device/group/list', name: 'Device Group List', component: DeviceGroup },
  { path: '/customer/list', name: 'Customers / Customer List', component: Customer },
  { path: "/user/management", name: "User Management", component: UserManagement },
  { path: "/settings", name: "Settings", component: Settings },
  { path: "/device/history/chart", name: "Device History Chart", component: DeviceHistoryChart },
  { path: "/device/summary", name: "Device Summary Table", component: DeviceSummaryTable },

];

export default routes;