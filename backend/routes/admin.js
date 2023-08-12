const mongoose = require("mongoose");
const express = require("express");
const { User, Course, Admin } = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middleware/auth")
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateJWT, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
        res.status(403).json({ message: "Admin dosen't exist" })
        return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(admin) {
        if (admin) {
            res.status(403).json({ message: 'Admin already exists' });
        } else {
            const obj = { username: username, password: password };
            const newAdmin = new Admin(obj);
            newAdmin.save();

            const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'Admin created successfully', token });
        }

    }
    Admin.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: "Logged in  successfully", token });
    } else {
        res.status(403).json({ message: 'Invalid credentials' });
    }
});

// post a new course
router.post('/courses', authenticateJWT, async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    req.json({ message: 'course created successfully', courseId: course.id });
});

// update a particular course 
router.put('/courses/:courseId', authenticateJWT, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found ' });
    }
});

//get all the courses
router.get('/courses', authenticateJWT, async (req, res) => {
    const courseId = req.params.courseId;
    res.json({ courses });
});

// get a particular course by its courseId 
router.get('/course/:courseId', authenticateJWT, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
});

module.exports = router