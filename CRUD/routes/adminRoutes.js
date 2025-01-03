const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/auth");

router.get("/students", authMiddleware.isAdmin, studentController.getStudents);
router.get("/students/new", authMiddleware.isAdmin, studentController.getStudentForm);
router.get("/students/edit/:id", authMiddleware.isAdmin, studentController.editStudentForm);
router.post("/students/add", authMiddleware.isAdmin, studentController.addStudent);
router.post("/students/edit/:id", authMiddleware.isAdmin, studentController.updateStudent);
router.get("/students/delete/:id", authMiddleware.isAdmin, studentController.deleteStudent); // Ensure this route is defined as GET
router.get("/students/view/:id", authMiddleware.isAdmin, studentController.viewStudent);

module.exports = router;
