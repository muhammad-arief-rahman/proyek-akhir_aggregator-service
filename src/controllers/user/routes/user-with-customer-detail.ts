import { internalServerError, response } from "@ariefrahman39/shared-utils"
import axios from "axios"
import type { RequestHandler } from "express"
import { getToken } from "../../../lib/utils"

export const userWithCustomerDetail: RequestHandler = async (req, res) => {
  try {
    const token = getToken(req)
    const userId = req.params.id

    const userQuery = axios.get(
      `${process.env.AUTH_SERVICE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const customerQuery = axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/data?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const [userResult, customerResult] = await Promise.allSettled([
      userQuery,
      customerQuery,
    ])

    const user =
      userResult.status === "fulfilled" ? userResult.value.data?.data : null
    const customer =
      customerResult.status === "fulfilled" ? customerResult.value.data?.data?.[0] : null

    if (!user) {
      response(res, 404, "User not found")
      return
    }

    const aggregatedData = {
      ...user,
      customer: customer || null,
    }

    response(res, 200, "User with customer detail retrieved successfully", aggregatedData)
  } catch (error) {
    internalServerError(res, error)
  }
}
