// import React, { Fragment, useState, useEffect, useContext} from 'react'
// import { useDispatch } from 'react-redux'
// import { useGetUtilityList } from '../../../api/utility'
// import {
//     CCol,
//     CRow,
//     CDataTable,
//     CDropdown,
//     CDropdownToggle,
//     CDropdownMenu,
//     CDropdownItem,
//     CInputCheckbox,
//     CInput,
//     CCollapse,
//   } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilAudio } from '@coreui/icons'
// import moment from 'moment'
// import { DATE_ISO8601_NO_TIME } from 'src/utils/constant'
// import {
//     CycleDatatable
// } from './sensor-product/index'
// import { useGetDeviceMonitoringByDate } from 'src/api/dashboard'
// import { DeviceHistoryContext } from '../_provider/DeviceHistoryProvider'
// import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'
// import { ExportCsvFromCoreUiDatatable } from '../../../components/export-to-csv-button'

// const SelectionColumnSLot = (props) => {
//     const {onSelected} = props
//     return(
//         <CInput 
//             type="checkbox" 
//             size="sm"
//             onChange={e => {
//                 onSelected(e.target.checked)
//             }}
//         />
//     )
// }

// const SelectionSlot = (props) => {
//     const {data, onSelected} = props
//     return(
//         <td >
//             <CInputCheckbox  
//                 className="mx-auto"
//                 checked={data._checked || false}
//                 onChange={e => {
//                     onSelected(e.target.checked, data.id)
//                 }}
//             />
//         </td>
//     )
// }

// const CycleDetailSlot = ({data, details, historyResult}) => {
//     if(details.id !== data.id)
//     return null
//     return(
//         <CCollapse show={true}>
//                 <CycleDatatable 
//                     rowData={data}
//                     allData={historyResult.cycleDetailEachDay}
//                 />
//         </CCollapse>
//     )
// }

// const ActionButtonSlot = (props) => {
//     const {data, details, detailType, toggleCycleDetail } = props
//     return(
//         <td>
//             <CDropdown>
//                 <CDropdownToggle size='sm'/>
//                 <CDropdownMenu>
//                     <CDropdownItem onClick={() => toggleCycleDetail(data)}>
//                         <CRow>
//                             <CCol>S/H Cycle</CCol>
//                             <CCol className="ml-5">
//                                 <CIcon content={cilAudio} />
//                             </CCol>
//                         </CRow>
//                     </CDropdownItem>
//                 </CDropdownMenu>
//             </CDropdown>
//         </td>
//     )
// }

// const HistoryDeviceDatatable = () => {
//     const dispatch = useDispatch()
//     const {data: rqData, status: rqStatus} = useGetUtilityList()
//     const [details, setDetails] = useState({id: null})
//     const [detailType, setDetailType] = useState('cycle')
//     const [utilityData, setUtilityData] = useState([])
//     const [isSelecAllSelected, setSelecAllSelected] = useState(false)
//     const {selectedStartDate, selectedEndDate, selectedDevice, isNeedToLoading, setIsNeedToLoading} = useContext(DeviceHistoryContext) 
//     const [historyResult, setHistoryResult] = useState(null)
//     const {data: rqDataMonitoring, status: rqStatusMonitoring} = useGetDeviceMonitoringByDate(
//                 selectedDevice.id, moment(selectedStartDate).unix(), moment(selectedEndDate).unix(),
//             )

//     useEffect( () => {
//         async function getHistoryResult() {
//             if((rqStatusMonitoring === 'success') && !historyResult && isNeedToLoading){
//                 setHistoryResult(await rqDataMonitoring)
//                 setIsNeedToLoading(false)
//             }
//         }
//         getHistoryResult()
//         // eslint-disable-next-line
//     }, [rqStatusMonitoring, isNeedToLoading])

//     useEffect(() => {
//         if(!historyResult) return
//         if(!historyResult.summaryEachDay) return
//         if(!historyResult.cycleDetailEachDay) return
//         // dispatch({type: 'exportFromCoreUIDataTable', 
//         //         fields: [
//         //             { key: 'customer', label: 'Customer'},
//         //             { key: 'location', label: "Location"},
//         //             { key: 'date', label: "Date"},
//         //             { key: 'cycle', label: "Total Cycle"},

//         //         ],
//         //         data: historyResult.summaryEachDay,
//         //         fileName: `Summary of ${selectedDevice.name} 
//         //                     from ${moment(selectedStartDate).format(DATE_ISO8601_NO_TIME)} -
//         //                         ${moment(selectedEndDate).format(DATE_ISO8601_NO_TIME)}`
//         // })
//         let cycleDetailArr = []
//         console.log(historyResult)
//         historyResult.cycleDetailEachDay.map((item) => {
//                 item.cycle.map((cycle) => {
//                     cycleDetailArr.push({
//                         id: item.id,
//                         date: item.date,
//                         customer: item.customer,
//                         location: item.location,
//                         date: moment(item.date).format(DATE_ISO8601_NO_TIME),
//                         cycle: cycle.cycle,
//                         start_time: cycle.start_time,
//                         end_time: cycle.end_time,
//                         duration: cycle.duration,
//                         _checked: true
//                     })
//                 }
//             )
//             if(item.cycle.length === 0){
//                 cycleDetailArr.push({
//                     id: item.id,
//                     date: item.date,
//                     customer: item.customer,
//                     location: item.location,
//                     date: moment(item.date).format(DATE_ISO8601_NO_TIME),
//                     cycle: 0,
//                     start_time: null,
//                     end_time: null,
//                     duration: 0,
//                     _checked: true
//                 })
//             }
//         })
//         dispatch({type: 'exportFromCoreUIDataTable', 
//         fields: [
//             { key: 'id', label: "Group ID"},
//             { key: 'date', label: "Date"},
//             { key: 'customer', label: 'Customer'},
//             { key: 'location', label: "Location"},
//             { key: 'cycle', label: 'Cycle'},
//             { key: 'start_time', label: "Start Time"},
//             { key: 'end_time', label: "End Time"},
//             { key: 'duration', label: "Duration (min.)"},
//         ],
//         data: cycleDetailArr,
//         fileName: `Cycle Detail of ${selectedDevice.name} period ${moment(selectedStartDate).format(DATE_ISO8601_NO_TIME)} - ${moment(selectedEndDate).format(DATE_ISO8601_NO_TIME)}`
// })
//     }, [historyResult, dispatch])

//     if(rqStatusMonitoring !== 'success' || !historyResult || isNeedToLoading){
//         return <BigSpinner text={"loading data, can took a while..."}/>
//     }

//     const handleSelectAll = (isSelected) => {
//         setSelecAllSelected(isSelected)
//         setUtilityData(currentData => {
//             return currentData.map(
//                 d => ({...d, _checked: isSelected})
//             )
//         })
//     }
//     const handleSelect = (isSelected, selectedId) => {
//         setUtilityData(currentData => {
//             const findIndex = currentData.findIndex(d => d.id === selectedId)
//             currentData[findIndex]._checked = isSelected
//             return [...currentData]
//         })
//     }

//     const handleCycleDetailToggle = (data) => {
//         if(details.id === data.id){
//             setDetails({...details, id: null})
//           return
//         }
//         setDetailType('cycle')
//         setDetails(data)
//       }

//       const getDetailsSlot = (item) => {
//         if(detailType === 'cycle')
//             return <CycleDetailSlot data={item} details={details} historyResult={historyResult}/>
//     }

//     const fields = [
//         // { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
//         { key: 'customer', label: 'Customer', _style: { width: '15%'}},
//         { key: 'location', label: "Location", _style: { width: '15%'}},
//         { key: 'date', label: "Date", _style: { width: '15%'}},
//         { key: 'cycle', label: "Total Cycle", _style: { width: '15%'}},
//         { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
//     ]   
//     const scopedSlots = {
//         // 'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect} />,
//         // 'utility_wattage': (item) => <WattageSlot data={item} />,
//         'details': (item) => getDetailsSlot(item),
//         'action': (item) => <ActionButtonSlot 
//                                 data={item}
//                                 details={details}
//                                 toggleCycleDetail={handleCycleDetailToggle}
//                             />
//     }
//     const columnFilterSlot = {
//         'selection': <SelectionColumnSLot onSelected={handleSelectAll}/>,
//     }
//     const handleColumnFilterChange = (e) => {
//         if(rqStatus !== 'success'){
//             return
//         }
//         let isFilterEmpty =  true
//         const eKeys = Object.keys(e)
//         for(let i = 0; i < eKeys.length; i++){
//             if(e[eKeys[i]].length > 0){
//                 isFilterEmpty = false
//                 break
//             }
//         }
//         if(isFilterEmpty){
//             setUtilityData(rqData.result)
//         }
//         if(isSelecAllSelected){
//             handleSelectAll(true)
//         }
//     }

//     const handleOnFilteredItemsChange = (items) => {
//         if(rqStatus !== 'success'){
//             return
//         }
//         if(items.length === 0){
//             setUtilityData(rqData.result)
//             return
//         }
//         setUtilityData(items)
//     }


//     return (
//         <CRow>
//             {/* <CDataTable 
//                 items={historyResult.summaryEachDay}
//                 responsive
//                 fields={fields}
//                 columnFilterSlot={columnFilterSlot}
//                 scopedSlots={scopedSlots}
//                 columnFilter
//                 itemsPerPage={15}
//                 loading={rqStatus === 'loading'}
//                 onColumnFilterChange={(e) => handleColumnFilterChange(e)}
//                 onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
//                 hover
//                 sorter
//                 pagination
//             /> */}
//             <CCol>
//                 <ExportCsvFromCoreUiDatatable />
//             </CCol>
//         </CRow>
//     )
// }

// export default HistoryDeviceDatatable