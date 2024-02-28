import { client } from "~/utils/clientUtils"

export const createMindmap = async (payload) => {
  try {
    const res = await client.post(`/mindmaps`, payload)
    return res
  } catch (error) {
    console.error(error)
  }
}

export const getAllMindmap = async ({ userId, page, limit }) => {
  try {
    const res = await client.get(
      `/mindmaps?userId=${userId}&page=${page}&limit=${limit}`
    )
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const getAllMindmapDeleted = async ({ userId, page, limit }) => {
  try {
    const res = await client.get(
      `/mindmaps/deleted?userId=${userId}&page=${page}&limit=${limit}`
    )
    console.log("res:", res.data)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const getMindmapDetail = async (id) => {
  try {
    const data = await client.get(`/mindmaps/${id}`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const updateMindmap = async ({ id, payload }) => {
  try {
    const data = await client.patch(`/mindmaps/${id}`, payload)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const deleteMindmap = async (id) => {
  try {
    const data = await client.delete(`/mindmaps/${id}`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const deleteForceMindmap = async (id) => {
  try {
    const data = await client.delete(`/mindmaps/delete/${id}`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const deleteAllMindmap = async ({ ids: listIds }) => {
  try {
    const data = await client.post(`/mindmaps/delete`, { ids: listIds })
    return data
  } catch (error) {
    console.error(error)
  }
}

export const restoreMindmap = async (id) => {
  try {
    const data = await client.get(`/mindmaps/restore/${id}`)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const restoreAllMindmap = async ({ ids: listIds }) => {
  try {
    const data = await client.post(`/mindmaps/restore`, { ids: listIds })
    return data
  } catch (error) {
    console.error(error)
  }
}
