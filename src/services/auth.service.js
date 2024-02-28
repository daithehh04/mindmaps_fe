import { api } from "~/utils/api"
import { client } from "~/utils/clientUtils"

export const login = async (payload) => {
  try {
    const res = await client.post(`/auth/login`, payload)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const handleLoginWithGoogle = async () => {
  try {
    const res = await client.get(`/auth/google`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const handleLoginWithGoogleCallback = async (query) => {
  try {
    const res = await fetch(`${api}/auth/google/callback${query}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export const register = async (payload) => {
  try {
    const res = await client.post(`/auth/signup`, payload)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const logout = async () => {
  try {
    const res = await client.post(`/auth/logout`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const handlerRefreshToken = async (payload) => {
  try {
    const res = await fetch(`${api}/auth/handlerRefreshToken`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
export const handleForgotPassword = async (payload) => {
  try {
    const res = await client.post(`/auth/handleForgotPassword`, payload)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const handleResetPassword = async ({ password, idReset }) => {
  try {
    const res = await client.post(`/auth/handleResetPassword`, {
      password,
      idReset,
    })
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const handleChangePassword = async ({ password, idUser }) => {
  try {
    const res = await client.post(`/auth/handleChangePassword`, {
      password,
      idUser,
    })
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const getUserFromToken = async () => {
  try {
    const res = await client.post(`/auth/getUserFromToken`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}
