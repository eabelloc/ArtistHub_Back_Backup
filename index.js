const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const { connectDb } = require('./src/helpers/database/db');
const { setUpCloudinary } = require('./src/helpers/utils/cloudinary');

const UserRoutes = require("./src/api/users/user.routes");
const ProjectRoutes = require("./src/api/projects/project.routes");
const MediaRoutes = require("./src/api/medias/media.routes");

dotenv.config()

const PORT = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
connectDb();
setUpCloudinary();

app.use(cors({ origin: (_origin, callback) => callback(null, true), credentials: true }));

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.set("secretKey", JWT_SECRET);


app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/medias", MediaRoutes);


app.use((error, _req, res, _next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

app.use('*', (_req, _res, next) => {
    const error = new Error()
    error.status = 404
    error.message = 'Route not found'
    return next(error)
});

app.listen(PORT, () => {
    console.log('Server is running in http://localhost:' + PORT)
})