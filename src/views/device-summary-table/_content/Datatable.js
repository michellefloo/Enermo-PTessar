import React, { Fragment, useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import CIcon from "@coreui/icons-react";
import { cilChart } from "@coreui/icons";
import {
  CDataTable,
  CInputCheckbox,
  CInput,
  CButton,
  CContainer,
  CBadge,
} from "@coreui/react";

import { useHistory } from "react-router-dom";
// import { useGetDeviceList } from "src/api/device";
import { useGetDeviceMonitoring } from "src/api/dashboard";
import { TimeConfigProviderContext } from "../../dashboard/_provider/TimeConfigProvider";
import { DeviceSummaryContext } from "../_provider/DeviceSummaryProvider";
import BigSpinner from "src/components/ui/big-spinner/BigSpinner";
import Status from "src/views/device-summary-table/_content/parameters/Status";

const SelectionColumnSlot = ({ onSelected }) => {
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

const SelectionSlot = ({ data, onSelected }) => {
  return (
    <td>
      <CInputCheckbox
        className="mx-auto"
        checked={data._checked || false}
        onChange={(e) => {
          onSelected(e.target.checked, data.id_device);
        }}
      />
    </td>
  );
};

const ActionButtonSlot = (props) => {
  const { toggleDeviceSummaryDetail, data } = props;
  return (
    <td>
      <CContainer className="d-flex justify-content-end" fluid>
        <div className="p-1">
          <CButton
            color="info"
            block
            className="d-flex align-items-center"
            onClick={() => toggleDeviceSummaryDetail(data)}
          >
            <CIcon content={cilChart} />
            <span>&nbsp;Detail</span>
          </CButton>
        </div>
      </CContainer>
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

const StatusSlot = ({ data }) => {
  return (
    <td style={{ textAlign: "center" }}>
      <Status data={data} id_device={data.id_device} />
    </td>
  );
};

const DeviceSummaryDataTable = ({ id_device }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
  const { isNeedToLoading } = useContext(DeviceSummaryContext);
  const [deviceSummaryResult, setDeviceSummaryResult] = useState([]);
  const [isSelectAllSelected, setSelectAllSelected] = useState(false);
  const { data: monitorData, status: monitorStatus } = useGetDeviceMonitoring(
    id_device, // Id perangkat, bisa diabaikan karena ingin menampilkan semua perangkat
    null,
    deviceMonitorTime.start,
    deviceMonitorTime.end
  );

  /*
  KOMENTAR MICHELLE
  - Di sini, kita mengambil data monitoring tanpa menggunakan id_device karena kita ingin menampilkan semua perangkat.
  - id_device diambil saat membuat variabel deviceSummaryResult, di mana kita memanggil data monitor dan menyimpan id-nya di variabel id_device.
  - Kemudian, deviceSummaryResult akan digunakan sebagai item di CDataTable.
  - Item tersebut digunakan di scopedSlots. Jika dilihat, scopedSlots memanggil ActionButtonSlot.
  - ActionButtonSlot menerima prop berupa data: item dan toggleDeviceSummaryDetail: handleDeviceSummaryTable.
  - Nah, handleDeviceSummaryTable adalah fungsi yang memanggil tombol detail, di mana kita memanggil device_id: data.id_device (ingat: data => item => deviceSummaryResult).
*/

  const handleDeviceSummaryTable = (data) => {
    history.push({
      pathname: "/device/realtime/summary/chart",
      state: {
        // hasil parsingan id_device dari deviceSummaryResult
        // data diambil dari items di ActionButtonSlot dari scopedSlots
        // itemsnya diambil dari deviceSummaryResult
        device_id: data.id_device,
        device: data,
        device_name: data.device_desc,
      },
    });
  };

  const handleSelectAll = (isSelected) => {
    setSelectAllSelected(isSelected);
    const updatedData = deviceSummaryResult.map((item) => ({
      ...item,
      _checked: isSelected,
    }));
    setDeviceSummaryResult(updatedData);
  };

  const handleSelect = (isSelected, selectedId) => {
    setDeviceSummaryResult((currentData) => {
      const findIndex = currentData.findIndex(
        (d) => d.id_device === selectedId
      );
      if (findIndex !== -1) {
        const updatedData = [...currentData];
        updatedData[findIndex] = {
          ...updatedData[findIndex],
          _checked: isSelected,
        };
        return updatedData;
      }
      return currentData;
    });
  };

  const handleColumnFilterChange = (e) => {
    if (monitorStatus !== "success") {
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
      setDeviceSummaryResult(monitorData.result);
    }
    if (isSelectAllSelected) {
      handleSelectAll(true);
    }
  };

  const handleOnFilteredItemsChange = (items) => {
    if (monitorStatus !== "success") {
      return;
    }
    if (items.length === 0) {
      setDeviceSummaryResult(monitorData.result);
      return;
    }
    setDeviceSummaryResult(items);
  };

  const fields = [
    { key: "selection", label: "", filter: false, _style: { width: "2%" } },
    {
      key: "id_main_customer",
      label: "Customer ID",
      _style: { width: "15%", textAlign: "center" },
    },
    {
      key: "device_desc",
      label: "Device Name",
      _style: { width: "15%", textAlign: "center" },
    },
    {
      key: "device_name",
      label: "Device Code",
      _style: { width: "25%", textAlign: "center" },
    },
    {
      key: "status",
      label: "Status",
      _style: { width: "5%", textAlign: "center" },
    },
    {
      key: "cycle",
      label: "Cycle",
      _style: { width: "2%", textAlign: "center" },
    },
    {
      key: "billing",
      label: "Billing",
      _style: { width: "15%", textAlign: "center" },
    },
    {
      key: "action",
      label: "Action",
      filter: false,
      _style: { width: "10%", textAlign: "center" },
    },
  ];

  const columnFilterSlot = {
    selection: <SelectionColumnSlot onSelected={handleSelectAll} />,
  };

  const scopedSlots = {
    selection: (item) => (
      <SelectionSlot data={item} onSelected={handleSelect} />
    ),
    device_desc: (item) => <DeviceDescSlot data={item} />,
    action: (item) => (
      <ActionButtonSlot
        data={item}
        toggleDeviceSummaryDetail={handleDeviceSummaryTable}
      />
    ),
    status: (item) => <StatusSlot data={item} />,
    _style: { textAlign: "center" },
  };

  useEffect(() => {
    // Jika pengambilan data pemantauan berhasil dan data tersedia
    if (monitorStatus === "success" && monitorData && monitorData.result) {
      const deviceSummaryData = monitorData.result.map((item) => ({
        // Mengolah data pemantauan menjadi format yang sesuai untuk ditampilkan
        id_device: item.id,
        id_main_customer: item.id_main_customer,
        device_desc: item.device_desc,
        device_name: item.device_name,
        device_serial_number: item.sensors_details[0]?.device_serial_number,
        cycle: item.cycle_count_summarys[0]?.cycle || 0,
        billing: item.billing,
        is_main_panel: item.is_main_panel,
      }));
      // Dispatch aksi untuk mengekspor data ke dalam format CSV
      dispatch({
        type: "exportFromCoreUIDataTable",
        fields: [
          { key: "id_main_customer", label: "Customer ID" },
          { key: "device_desc", label: "Device Name" },
          { key: "device_name", label: "Device Code" },
          { key: "status", label: "Status" },
          { key: "cycle", label: "Cycle" },
          { key: "billing", label: "Billing" },
        ],
        data: deviceSummaryData,
        fileName: "Device List",
      });
      setDeviceSummaryResult(deviceSummaryData);
    }
  }, [monitorData, monitorStatus, dispatch]);

  console.log(
    "🚀 ~ DeviceSummaryDataTable ~ deviceSummaryResult:",
    deviceSummaryResult
  );

  // Menampilkan spinner jika data masih dalam proses pengambilan atau jika data pemantauan belum tersedia
  if (monitorStatus !== "success" || !deviceSummaryResult || isNeedToLoading) {
    return <BigSpinner text={"Loading data, can took a while..."} />;
  }

  return (
    <Fragment>
      <CDataTable
        items={deviceSummaryResult}
        responsive
        striped
        fields={fields}
        columnFilterSlot={columnFilterSlot}
        scopedSlots={scopedSlots}
        columnFilter
        itemsPerPage={15}
        loading={monitorStatus === "loading"}
        onColumnFilterChange={(e) => handleColumnFilterChange(e)}
        onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
        hover
        sorter
        pagination
      />
    </Fragment>
  );
};

export default DeviceSummaryDataTable;
