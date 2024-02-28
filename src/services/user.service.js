import { client } from "~/utils/clientUtils"

export const checkUserFromIdReset = async ({ idReset }) => {
  try {
    const res = await client.post(`/auth/checkUserFromIdReset`, { idReset })
    return res
  } catch (error) {
    console.error(error)
  }
}

export const updateProfile = async ({ name, picture, desc, userId }) => {
  try {
    const res = await client.post(`/user/updateProfile`, {
      name,
      picture,
      desc,
      userId,
    })
    return res
  } catch (error) {
    console.error(error)
  }
}
