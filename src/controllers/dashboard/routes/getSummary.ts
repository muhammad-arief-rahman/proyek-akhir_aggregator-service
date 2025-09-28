import {
  getAuthToken,
  internalServerError,
  response,
} from "@ariefrahman39/shared-utils"
import axios from "axios"
import type { Request, RequestHandler } from "express"

async function getUnitData(req: Request, params: Record<string, any>) {
  const response = await axios.get(
    `${process.env.UNIT_SERVICE_URL}/data/summary-dashboard`,
    {
      withCredentials: true,
      params,
      headers: {
        Authorization: `Bearer ${getAuthToken(req)}`,
      },
    }
  )

  return response.data
}

async function getMaintenanceData(req: Request, params: Record<string, any>) {
  const response = await axios.get(
    `${process.env.MAINTENANCE_SERVICE_URL}/data-summary-dashboard`,
    {
      withCredentials: true,
      params,
      headers: {
        Authorization: `Bearer ${getAuthToken(req)}`,
      },
    }
  )

  return response.data
}

const getSummary: RequestHandler = async (req, res) => {
  try {
    const params = req.query as Record<string, string>

    const responseList = await Promise.allSettled([
      getUnitData(req, params),
      getMaintenanceData(req, params),
    ])

    const [unitDataResponse, maintenanceDataResponse] = responseList
      .map((result) => (result.status === "fulfilled" ? result.value : null))
      .filter((data) => data !== null)

      const mappedData= {
        activeUnits: unitDataResponse?.data?.activeUnits ?? 0,
        upcomingServices: maintenanceDataResponse?.data?.upcomingServices ?? 0,
        overdueServices: maintenanceDataResponse?.data?.overdueServices ?? 0,
      }

    response(res, 200, "Fetched aggregated data successfully", 
      mappedData
    )
  } catch (error) {
    internalServerError(res, error)
  }
}

export default getSummary
