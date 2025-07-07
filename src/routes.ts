import { Router } from "express"
import { MainController, UnitController, UserController } from "./controllers"
import SparePartController from "./controllers/spare-part"
import { AuthMiddleware } from "@ariefrahman39/shared-utils"

const router = Router()

router.get("/", MainController.root)

router.get("/units", UnitController.fullData)

router.get(
  "/user-with-customer",
  AuthMiddleware.authenticate("admin"),
  UserController.userWithCustomer
)

router.get(
  "/user-with-customer/:id",
  AuthMiddleware.authenticate("admin"),
  UserController.userWithCustomerDetail
)

router.get("/spare-part-with-units", SparePartController.getAllWithUnit)

router.get('/unit-details-with-customer/:id', UnitController.unitDetailsWithCustomer)

export default router
