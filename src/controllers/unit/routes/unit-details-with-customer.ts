import {
  internalServerError,
  response,
  type APIResponse,
} from "@ariefrahman39/shared-utils"
import axios, { AxiosError } from "axios"
import type { RequestHandler } from "express"
import type { UnitInstanceDetailData } from "../../../types/unit/details"
import type { CustomerData } from "../../../types/customer/data"

const unitDetailsWithCustomer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    let unitInstance: UnitInstanceDetailData | null = null

    try {
      const unit = await axios.get<APIResponse<UnitInstanceDetailData>>(
        `${process.env.UNIT_SERVICE_URL}/data/instance/${id}`
      )

      if (unit.data.data) {
        unitInstance = unit.data.data
      }
    } catch (error) {}

    if (!unitInstance) {
      response(res, 404, "Unit instance not found")
      return
    }

    let customer: CustomerData | null = null

    try {
      const customerData = await axios.get<APIResponse<CustomerData>>(
        `${process.env.CUSTOMER_SERVICE_URL}/data/details/${unitInstance.organizationId}`
      )

      customer = customerData.data.data
    } catch (error) {
      console.error("Error fetching customer data:", error)
    }

    const aggregatedData = {
      ...unitInstance,
      customer,
    }

    response(res, 200, "Fetched unit with customer details", aggregatedData)
  } catch (error) {
    internalServerError(res, error)
  }
}

export default unitDetailsWithCustomer
