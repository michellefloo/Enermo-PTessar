const initialState = {
    initialValues: [],
    callbackOnSuccess: null,
    modalName: '',
}
  
const modalState = (state = initialState, { type, ...rest }) => {
    switch (type) {
      case 'CALL_MODAL':
        return {...state, ...rest }
      case 'CLOSE_MODAL':
        return initialState
      default:
        return state
    }
  }

export default modalState