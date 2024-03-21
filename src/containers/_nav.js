import React from "react";
import CIcon from "@coreui/icons-react";
import { cilAudio, cilBolt, cilBuilding } from "@coreui/icons";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Devices",
    to: "/device",
    icon: <CIcon content={cilBolt} customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Device List",
        to: "/device/list",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Device Installation List",
        to: "/device/installation/list",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Device Group List",
        to: "/device/group/list",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Device Realtime Summary",
        to: "/device/realtime/summary",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Sensors",
    to: "/sensor",
    icon: <CIcon content={cilAudio} customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Sensor List",
        to: "/sensor/list",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Customers",
    to: "/customer",
    icon: <CIcon content={cilBuilding} customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Customer List",
        to: "/customer/list",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Boundaries",
    to: "/boundary",
    icon: <CIcon name="cil-layers" customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Boundary List",
        to: "/boundary/list",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Utilities",
    to: "/utility",
    icon: <CIcon name="cil-input-power" customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Utility List",
        to: "/utility/list",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Settings",
    to: "/settings",
    icon: <CIcon name="cilSettings" customClasses="c-sidebar-nav-icon" />,
  },
];

export default _nav;
