import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertImage = payload => api.post(`/image`, payload)
export const saveFile = payload => api.post(`/file`, payload)
export const getAllImages = () => api.get(`/images`)
export const getAllFiles = () => api.get(`/files`)
export const searchImage = (term, mode) => api.post(`/image/search/${term}/${mode}`)
export const updateImageById = (id, payload) => api.put(`/image/update/${id}`, payload)
export const deleteImageById = (id, name) => api.delete(`/image/${id}/${name}`)
export const getImageById = id => api.get(`/image/${id}`)

const apis = {
    insertImage,
    saveFile,
    getAllImages,
    getAllFiles,
    searchImage,
    updateImageById,
    deleteImageById,
    getImageById,
}

export default apis