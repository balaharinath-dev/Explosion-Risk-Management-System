import express from "express";
import * as controllers from "../controllers/login";

const router=express.Router();

router.post("/login",controllers.checkLogin);

router.post("/session",controllers.checkSession);

router.post("/cookie",controllers.checkCookie);

router.post("/gas",controllers.gasData);

router.post("/oil",controllers.oilData);

router.post("/employeeStatus",controllers.employeeStatus);

router.post("/employeeManagement",controllers.employeeManagement);

router.post("/attendance",controllers.attendance);

router.post("/createDate",controllers.createDate);

router.post("/fetchEvacuator",controllers.fetchEvacuator);

router.post("/evacuator",controllers.evacuator);

router.post("/storeData",controllers.storeData);

router.post("/alert",controllers.alert);

router.post("/logout",controllers.logout);

export default router;