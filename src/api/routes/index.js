const apiRoutes = {
  getUserList: "/user/list",
  addUser: "/user/register",
  updateStatus: "/user/status",
  updatePassword: "/user/changepassword",
  resendVerifEmail: "/user/reqverifybyadmin",
  getUserDetail: "/user/company/edit",
  updateUserCompany: "/user/company/edit",
  getUserCompanyList: "/user/company/list",

  getBoundary: "/landlord/location/list",
  getBoundaryType: "/landlord/location/type/list",
  addBoundary: "/landlord/location/v2/add",
  updateBoundary: "/landlord/location/v2/edit",
  deleteBoundary: "/landlord/location/delete",

  getUtility: "/landlord/location/utility/list",
  addUtility: "/landlord/location/utility/add",
  updateUtility: "/landlord/location/utility/edit",
  deleteUtility: "/landlord/location/utility/delete",
  getUtilityType: "/landlord/location/utility/type/list",
  getUtilityResource: "/landlord/location/utility/resource/list",
  getUtilityUsageSchedule: "/landlord/location/utility/usage/list",

  getFabricator: "/landlord/sensor/device/fabricator/find",
  getFabList: "/landlord/sensor/fab/list",

  getDevice: "/landlord/sensor/device/find",
  addDevice: "/landlord/sensor/device/put",
  updateDevice: "/landlord/sensor/device/edit",
  deleteDevice: "/landlord/sensor/device/delete",

  getDeviceInstalltion: "/landlord/sensor/install/list",
  addDeviceInstallation: "/landlord/sensor/install/add",
  updateDeviceInstallation: "/landlord/sensor/install/update",
  removeDeviceInstallation: "/landlord/sensor/install/remove",

  getSensor: "/landlord/sensor/list",
  addSensor: "/landlord/sensor/add",
  updateSensor: "/landlord/sensor/edit",
  deleteSensor: "/landlord/sensor/delete",
  getSensorType: "/landlord/sensor/type/list",
  getSensorClass: "/landlord/sensor/class/list",

  getCustomer: "transporter/customer/list",
  addCustomer: "transporter/customer/add",
  updateCustomer: "transporter/customer/edit",
  deleteCustomer: "transporter/customer/delete",

  getBudgetSetting: "/landlord/setting/budget/list",
  budgetSettingUpsert: "/landlord/setting/budget/upsert",

  // KwhAvg Baru
  getKwhAvgNew: "/landlord/sensor/device/monitoring/kwhaverage/v4",
  getKwhAvg: "/landlord/sensor/device/monitoring/kwhaverage/v2",

  // Monitoring Baru
  getDeviceMonitoringNew: "/landlord/sensor/device/v3/monitoring",
  getDeviceMonitoring: "/landlord/sensor/device/monitoring",

  getDeviceGroupList: "/landlord/sensor/device/group/list",
  addDeviceGroup: "/landlord/sensor/device/group/insert",
  updateDeviceGroup: "/landlord/sensor/device/group/edit",
  deleteDeviceGroup: "/landlord/sensor/device/group/delete",

  getDeviceGroupDetailList: "/landlord/sensor/device/group/detail/list",
  addDeviceGroupDetail: "/landlord/sensor/device/group/detail/insert",
  updateDeviceGroupDetail: "/landlord/sensor/device/group/detail/edit",
  deleteDeviceGroupDetail: "/landlord/sensor/device/group/detail/delete",
};
export default apiRoutes;
