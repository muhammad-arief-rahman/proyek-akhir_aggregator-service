import { internalServerError, response } from "@ariefrahman39/shared-utils"
import axios from "axios"
import type { RequestHandler } from "express"

export const userWithCustomer: RequestHandler = async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token || ""
      
    const userQuery = axios.get(`${process.env.AUTH_SERVICE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const customerQuery = axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/data`,
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

    const users =
      userResult.status === "fulfilled" ? userResult.value.data?.data : []
    const customers =
      customerResult.status === "fulfilled"
        ? customerResult.value.data?.data
        : []

    // Map a customer to user if the customer has a userId that matches the user's id
    // A user can only have one customer
    const aggregatedData = users.map((user: any) => {
      const userCustomer = customers.find((customer: any) => customer.userId === user.id)
      return {
        ...user,
        customer: userCustomer || null,
      }
    })

    response(res, 200, "Users with Customers retrieved successfully", aggregatedData)
  } catch (error) {
    console.error("Error in userWithCustomer:", error)

    internalServerError(res, error)
  }
}
