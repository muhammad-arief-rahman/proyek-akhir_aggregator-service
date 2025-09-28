import { Router } from "express"
import {
  DashboardController,
  MainController,
  UnitController,
  UserController,
} from "./controllers"
import SparePartController from "./controllers/spare-part"
import { AuthMiddleware } from "@ariefrahman39/shared-utils"

const router = Router()
const authenticated = Router().use(AuthMiddleware.authenticate())

router.get("/", MainController.root)

router.get("/units", UnitController.fullData)

router.get("/spare-part-with-units", SparePartController.getAllWithUnit)

router.get(
  "/unit-details-with-customer/:id",
  UnitController.unitDetailsWithCustomer
)

authenticated.get("/user-with-customer", UserController.userWithCustomer)

authenticated.get(
  "/user-with-customer/:id",
  UserController.userWithCustomerDetail
)

authenticated.get("/dashboard/summary", DashboardController.getSummary)

router.use(authenticated)

export default router
