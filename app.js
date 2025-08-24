const express = require("express");
const path = require("path");

const app = express();

// set the view engine + static
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// write your middleware here
// Authorise access to the closed page
function workingHoursOnly(req, res, next) {
    const now = new Date();

    // Day: 0=Sunday, 1=Monday, ..., 6=Saturday
    const day = now.getDay();
    const hour = now.getHours();

    const isWeekday = day >=1 && day <=5;
    const isWorkingHour = hour >= 9 && hour < 18

    if (isWeekday && isWorkingHour) {
        return next();
    }

    // Hors horaires ==> page closed
    return res.status(403).render("closed", {
        now // Date & heure now
    });
}

// middleware usage here
app.use(workingHoursOnly);

// home page route here => path : /
app.get("/", (req, res) => {
    res.render("home");
});

// services page route here => path : /services
app.get("/services", (req, res) => {
    res.render("services");
});



// contact page route here => path : /contact
app.get("/contact", (req, res) => {
    res.render("contact");
});



// listen to your application here
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Car Rent app listening on http://localhost:${PORT}`);
});