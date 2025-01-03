module.exports = (req, res, next) => {
    let { name, dob, courses } = req.body; // Changed from const to let
    console.log(req.body);

    if (!name || !dob || !courses || (Array.isArray(courses) && courses.length === 0)) {
        req.session.errorMessage = "All fields are required and courses must be selected.";
        return res.redirect("back");
    }

    if (!Array.isArray(courses)) {
        courses = [courses];
    }

    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear(); // Changed from const to let
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }
    if (age < 12) {
        req.session.errorMessage = "Student must be at least 12 years old.";
        return res.redirect("back");
    }
    next();
};
