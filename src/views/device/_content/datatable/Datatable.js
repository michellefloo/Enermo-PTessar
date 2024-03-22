import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetDeviceList } from "../../../../api/device";
import {
  CCol,
  CRow,
  CDataTable,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CInputCheckbox,
  CInput,
  CCollapse,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilAudio, cilChart } from "@coreui/icons";
import SensorDatatableDetail from "./SensorDatatableDetail";
import InstallationDatatableDetail from "./InstallationDatatableDetail";
import { useHistory } from "react-router-dom";

const SelectionColumnSLot = (props) => {
  const { onSelected } = props;
  return (
    <CInput
      type="checkbox"
      size="sm"
      onChange={(e) => {
        onSelected(e.target.checked);
      }}
    />
  );
};

const SelectionSlot = (props) => {
  const { data, onSelected } = props;
  return (
    <td>
      <CInputCheckbox
        className="mx-auto"
        checked={data._checked || false}
        onChange={(e) => {
          onSelected(e.target.checked, data.id);
        }}
      />
    </td>
  );
};

const DeviceDescSlot = ({ data }) => {
  return (
    <td>
      {data.device_desc}&nbsp;
      {data.is_main_panel ? <CBadge color="info">main</CBadge> : null}
    </td>
  );
};

const SensorDetailSlot = ({ data, details }) => {
  if (details.id !== data.id) return null;
  return (
    <CCollapse show={true}>
      <SensorDatatableDetail idDevice={data.id} />
    </CCollapse>
  );
};

const InstallationDetailSlot = ({ data, details }) => {
  if (details.id !== data.id) return null;
  return (
    <CCollapse show={true}>
      <InstallationDatatableDetail idDevice={data.id} />
    </CCollapse>
  );
};

const ActionButtonSlot = (props) => {
  const {
    toggleSensorDetails,
    toggleInstallationDetails,
    toggleDeviceHistory,
    toggleAddInstallation,
    onUpdateClick,
    detailType,
    toggleDeviceHistoryChart,
    onDeleteClick,
    data,
    details,
  } = props;
  return (
    <td>
      <CDropdown>
        <CDropdownToggle size="sm" />
        <CDropdownMenu>
          <CDropdownItem onClick={() => onUpdateClick(data)}>
            <CRow>
              <CCol>Edit</CCol>
              <CCol className="ml-5">
                <CIcon name={"cilPencil"} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => onDeleteClick(data)}>
            <CRow>
              <CCol>Delete</CCol>
              <CCol className="ml-5">
                <CIcon name={"cilTrash"} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => toggleSensorDetails(data)}>
            <CRow>
              <CCol>
                {details.id === data.id && detailType === "sensor"
                  ? "Hide"
                  : "Show"}{" "}
                Sensors
              </CCol>
              <CCol className="ml-5">
                <CIcon content={cilAudio} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => toggleInstallationDetails(data)}>
            <CRow>
              <CCol>
                {details.id === data.id && detailType === "installation"
                  ? "Hide"
                  : "Show"}{" "}
                Installations
              </CCol>
              <CCol className="ml-5">
                &nbsp;&nbsp;
                <CIcon name={"cilCalendar"} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => toggleAddInstallation(data)}>
            <CRow>
              <CCol>Add Installations</CCol>
              <CCol className="ml-5">
                &nbsp;&nbsp;
                <CIcon name={"cilCalendar"} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => toggleDeviceHistory(data)}>
            <CRow>
              <CCol>Device History</CCol>
              <CCol className="ml-5">
                &nbsp;&nbsp;
                <CIcon name={"cilCalendar"} />
              </CCol>
            </CRow>
          </CDropdownItem>
          <CDropdownItem onClick={() => toggleDeviceHistoryChart(data)}>
            <CRow>
              <CCol>History Chart</CCol>
              <CCol className="ml-5">
                &nbsp;&nbsp;
                <CIcon content={cilChart} />
              </CCol>
            </CRow>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </td>
  );
};

const DeviceDatatable = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { data: rqData, status: rqStatus } = useGetDeviceList();
  const [details, setDetails] = useState({ id: null });
  const [detailType, setDetailType] = useState("sensor");
  const [deviceData, setDeviceData] = useState([]);
  const [isSelecAllSelected, setSelecAllSelected] = useState(false);

  const handleSensorToggleDetails = (data) => {
    if (details.id === data.id) {
      setDetails({ ...details, id: null });
      return;
    }
    setDetailType("sensor");
    setDetails(data);
  };

  const handleInstallationToggleDetails = (data) => {
    if (details.id === data.id) {
      setDetails({ ...details, id: null });
      return;
    }
    setDetailType("installation");
    setDetails(data);
  };

  const handleAddInstallationToggle = (data) => {
    history.push({
      pathname: "/device/installation/list",
      state: {
        device_id: data.id,
        device_name: data.device_desc,
      },
    });
  };

  const handleDeviceHistoryToggleDetails = (data) => {
    history.push({
      pathname: "/device/history/list",
      state: {
        device_id: data.id,
        device: data,
        device_name: data.device_desc,
      },
    });
  };

  const handleDeviceHistoryToggleChart = (data) => {
    history.push({
      pathname: "/device/history/chart",
      state: {
        device_id: data.id,
        device: data,
        device_name: data.device_desc,
      },
    });
  };

  const handleOnUpdateClick = async (item) => {
    item.id_dev_fab = {
      label: item.fabricator_name,
      value: item.id_device_fabricator,
    };
    delete item.id_main_customer;
    delete item.id_location;
    delete item.customer;
    delete item.created_on;
    dispatch({
      type: "CALL_MODAL",
      modalName: "editDeviceModal",
      initialValues: item,
    });
  };
  const handleOnDeleteClick = async (item) => {
    dispatch({
      type: "CALL_MODAL",
      modalName: "deleteDeviceModal",
      initialValues: item,
    });
  };
  const handleSelectAll = (isSelected) => {
    setSelecAllSelected(isSelected);
    setDeviceData((currentData) => {
      return currentData.map((d) => ({ ...d, _checked: isSelected }));
    });
  };
  const handleSelect = (isSelected, selectedId) => {
    setDeviceData((currentData) => {
      const findIndex = currentData.findIndex((d) => d.id === selectedId);
      currentData[findIndex]._checked = isSelected;
      return [...currentData];
    });
  };

  const fields = [
    { key: "selection", label: "", filter: false, _style: { width: "2%" } },
    { key: "device_desc", label: "Device Name", _style: { width: "15%" } },
    { key: "device_name", label: "Device Code", _style: { width: "15%" } },
    { key: "serial_number", label: "Serial Number", _style: { width: "15%" } },
    { key: "fabricator_name", label: "Fabricator", _style: { width: "15%" } },
    { key: "action", label: "Action", filter: false, _style: { width: "10%" } },
  ];

  const getDetailsSlot = (item) => {
    if (detailType === "sensor")
      return <SensorDetailSlot data={item} details={details} />;
    if (detailType === "installation")
      return <InstallationDetailSlot data={item} details={details} />;
  };

  const scopedSlots = {
    selection: (item) => (
      <SelectionSlot data={item} onSelected={handleSelect} />
    ),
    device_desc: (item) => <DeviceDescSlot data={item} />,
    details: (item) => getDetailsSlot(item),
    action: (item) => (
      <ActionButtonSlot
        data={item}
        details={details}
        detailType={detailType}
        onUpdateClick={handleOnUpdateClick}
        onDeleteClick={handleOnDeleteClick}
        toggleSensorDetails={handleSensorToggleDetails}
        toggleInstallationDetails={handleInstallationToggleDetails}
        toggleAddInstallation={handleAddInstallationToggle}
        toggleDeviceHistory={handleDeviceHistoryToggleDetails}
        toggleDeviceHistoryChart={handleDeviceHistoryToggleChart}
      />
    ),
  };
  const columnFilterSlot = {
    selection: <SelectionColumnSLot onSelected={handleSelectAll} />,
  };

  useEffect(() => {
    if (rqStatus === "success") {
      if (!rqData) return;
      if (!rqData.result) return;
      setDeviceData(rqData.result);
    }
  }, [rqData, rqStatus]);

  useEffect(() => {
    dispatch({
      type: "exportFromCoreUIDataTable",
      fields: [
        { key: "device_desc", label: "Device Name" },
        { key: "device_name", label: "Device Code" },
        { key: "serial_number", label: "Serial Number" },
        { key: "device_fabricator", label: "Fabricator" },
      ],
      data: deviceData,
      fileName: "Device List",
    });
  }, [deviceData, dispatch]);

  const handleColumnFilterChange = (e) => {
    if (rqStatus !== "success") {
      return;
    }
    let isFilterEmpty = true;
    const eKeys = Object.keys(e);
    for (let i = 0; i < eKeys.length; i++) {
      if (e[eKeys[i]].length > 0) {
        isFilterEmpty = false;
        break;
      }
    }
    if (isFilterEmpty) {
      setDeviceData(rqData.result);
    }
    if (isSelecAllSelected) {
      handleSelectAll(true);
    }
  };

  const handleOnFilteredItemsChange = (items) => {
    if (rqStatus !== "success") {
      return;
    }
    if (items.length === 0) {
      setDeviceData(rqData.result);
      return;
    }
    setDeviceData(items);
  };

  return (
    <Fragment>
      <CDataTable
        items={deviceData}
        responsive
        striped
        fields={fields}
        columnFilterSlot={columnFilterSlot}
        scopedSlots={scopedSlots}
        columnFilter
        itemsPerPage={15}
        loading={rqStatus === "loading"}
        onColumnFilterChange={(e) => handleColumnFilterChange(e)}
        onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
        hover
        sorter
        pagination
      />
    </Fragment>
  );
};

export default DeviceDatatable;
