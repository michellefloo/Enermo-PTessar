const initialState = {
    sidebarShow: 'responsive',
    infoHeaderShow: false,
    theObjectNotFound: null,
    objectNoFoundDataLink: null,
}
  
const coreUiState = (state = initialState, { type, ...rest }) => {
    switch (type) {
      case 'set':
        return {...state, ...rest }
      default:
        return state
    }
  }

export default coreUiState