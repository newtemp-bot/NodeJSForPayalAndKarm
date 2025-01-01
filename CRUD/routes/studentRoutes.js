const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.getStudents);
router.get("/new", studentController.getStudentForm);
router.get("/edit/:id", studentController.editStudentForm);
router.post("/edit/:id", studentController.updateStudent);
router.post("/add", studentController.addStudent);
router.get("/view/:id", studentController.viewStudent);
router.get("/delete/:id", studentController.deleteStudent);

module.exports = router;
