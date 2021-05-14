import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertMeme = payload => api.post(`/meme`, payload)
export const saveFile = payload => api.post(`/file`, payload)
export const getAllMemes = () => api.get(`/memes`)
export const getAllFiles = () => api.get(`/files`)
export const searchMeme = term => api.post(`/meme/search/${term}`)
export const updateMemeById = (id, payload) => api.put(`/meme/update/${id}`, payload)
export const deleteMemeById = id => api.delete(`/meme/${id}`)
export const getMemeById = id => api.get(`/meme/${id}`)

const apis = {
    insertMeme,
    saveFile,
    getAllMemes,
    getAllFiles,
    searchMeme,
    updateMemeById,
    deleteMemeById,
    getMemeById,
}

export default apis