/* eslint-disable no-unused-vars */
import Cookies from "js-cookie"
import { handlerRefreshToken } from "~/services/auth.service"

export const client = {
  serverApi: import.meta.env.VITE_SERVER_API,
  token: Cookies.get("accessToken"),
  x_client_id: Cookies.get("idUser"),
  setUrl: function (url) {
    this.serverApi = url
  },
  setToken: function (token) {
    this.token = token
  },
  setIdUser: function (id) {
    this.x_client_id = id
  },
  send: async function (url, method = "GET", body = null) {
    // url = SERVER_API + url;
    url = `${this.serverApi}${url}`
    const headers = {
      "Content-Type": "application/json",
    }
    if (this.token) {
      headers["authorization"] = `${this.token}`
      headers["x-client-id"] = `${this.x_client_id}`
    }
    const options = {
      method,
      headers,
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
    const response = await fetch(url, options)
    if (this.token && response.status === 401) {
      const payload = {
        refreshToken: Cookies.get("refreshToken"),
      }
      const res = await handlerRefreshToken(payload)
      if (res.status === 200) {
        this.token = res.metadata.tokens.accessToken
        Cookies.set("accessToken", res.metadata.tokens.accessToken, {
          expires: 60 * 60 * 24 * 7,
        })
        Cookies.set("idUser", res.metadata.userId, {
          expires: 60 * 60 * 24 * 7,
        })
        Cookies.set("refreshToken", res.metadata.tokens.refreshToken, {
          expires: 60 * 60 * 24 * 30,
        })
        return this.send("/auth/getUserFromToken", method, body)
      } else {
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        Cookies.remove("idUser")
        window.location.href = "/"
        return false
      }
    }
    const data = await response.json()
    return { response, data }
  },

  get: function (url) {
    return this.send(url)
  },

  post: function (url, body) {
    return this.send(url, "POST", body)
  },

  put: function (url, body) {
    return this.send(url, "PUT", body)
  },

  patch: function (url, body) {
    return this.send(url, "PATCH", body)
  },

  delete: function (url) {
    return this.send(url, "DELETE")
  },
}
