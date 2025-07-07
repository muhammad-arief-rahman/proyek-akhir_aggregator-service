import { internalServerError, response } from "@ariefrahman39/shared-utils"
import axios from "axios"
import type { RequestHandler } from "express"

const fullData: RequestHandler = async (req, res) => {
  try {
    const [unitResponse] = await Promise.allSettled([
      await axios.get(`${process.env.UNIT_SERVICE_URL}/data`),
    ])

    const unitData =
      unitResponse.status === "fulfilled" ? unitResponse.value.data : null

    response(res, 200, "Full data retrieved successfully", {
      data: {
        // Here you can include the full data you want to return
        // For example, you might fetch data from a database or another service
        // This is just a placeholder
        exampleField: unitData,
      },
    })
  } catch (error) {
    internalServerError(res, error)
  }
}

export default fullData
