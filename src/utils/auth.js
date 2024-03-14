import { PERSIST_KEY_NAME } from './constant'

const getPresistStorage = () => {
    let ls = localStorage.getItem(`persist:${PERSIST_KEY_NAME}`);
    return JSON.parse(ls)
}

const deletePresistStorage = () => {
    localStorage.removeItem(`persist:${PERSIST_KEY_NAME}`)
}

export const getAuthToken = async () => {
    let ps = getPresistStorage()
    if(!ps) return null
    let auth = await JSON.parse(ps.auth)
    let {token} = auth.data || {}
    return token
}
  
export const logout = () => {
    deletePresistStorage()
    window.location.reload()
}