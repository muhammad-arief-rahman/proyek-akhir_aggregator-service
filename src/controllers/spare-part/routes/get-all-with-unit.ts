import {
  type APIResponse,
  internalServerError,
  response,
} from "@ariefrahman39/shared-utils"
import axios from "axios"
import type { RequestHandler } from "express"
import type { SparePartData } from "../../../types/spare-part/data"
import type { BaseUnitData } from "../../../types/unit/base-data"

const getAllWithUnit: RequestHandler = async (req, res) => {
  try {
    const [sparePartResult, unitResult] = await Promise.allSettled([
      axios.get<APIResponse<SparePartData[]>>(
        `${process.env.MAINTENANCE_SERVICE_URL}/spare-parts`
      ),
      axios.get<APIResponse<BaseUnitData[]>>(
        `${process.env.UNIT_SERVICE_URL}/base-data?withCompound=true&noPagination=true`
      ),
    ])

    if (sparePartResult.status === "rejected") {
      response(res, 500, "Failed to fetch initial spare parts")
      return
    }

    const baseUnitsData =
      unitResult.status === "fulfilled" ? unitResult.value.data.data : []

    const aggregatedData = sparePartResult.value.data.data.map((sparePart) => ({
      ...sparePart,
      unit: baseUnitsData.find((unit) => unit.id === sparePart.unitId) || null,
    }))

    response(
      res,
      200,
      "Spare parts with units fetched successfully",
      aggregatedData
    )
  } catch (error) {
    console.log(error)

    internalServerError(res, error)
  }
}

export default getAllWithUnit
