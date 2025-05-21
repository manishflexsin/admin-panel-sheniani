const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export const LOGIN = `${API_BASE_URL}/admin/login`//
export const LOGOUT = `${API_BASE_URL}/admin/logout`//
export const PROFILE = `${API_BASE_URL}/admin/profile`//
export const GET_USER = `${API_BASE_URL}/admin/getUser`
export const UPDATE_USER = `${API_BASE_URL}/admin/updateUser`



export const GET_CATEGORY = `${API_BASE_URL}/admin/getCategories`//
export const ADD_CATEGORY = `${API_BASE_URL}/admin/addCategory`//
export const UPDATE_CATEGORY = `${API_BASE_URL}/admin/updateCategory`
export const DELETE_CATEGORY = `${API_BASE_URL}/admin/deleteCategory`


export const GET_VENDOR = `${API_BASE_URL}/admin/getVendors`
export const ADD_VENDOR = `${API_BASE_URL}/admin/addVendor`
export const UPDATE_VENDOR = `${API_BASE_URL}/admin/updateVendor`
export const DELETE_VENDOR = `${API_BASE_URL}/admin/deleteVendor`