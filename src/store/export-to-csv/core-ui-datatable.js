const initialState = {
    fields: [],
    data: [],
    fileName: ''
}
  
const exportToCsv = (state = initialState, { type, ...rest }) => {
    switch (type) {
      case 'exportFromCoreUIDataTable':
        rest.data = rest.data.filter((d) => d._checked)
        return {...state, ...rest }
      default:
        return state
    }
  }

export default exportToCsv