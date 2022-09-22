const UserRoutes = require("express").Router();
const { authorize } = require("../../middleware/auth");
const upload = require("../../middleware/file")

const { 
    getAll, 
    getById,
    getByUsername,
    getProjectsByUsername,
    getFavProjectsByUsername,
    getMediasByUsername,
    getByCompany,
    getByLocation,
    getByWebsite,
    getByTwitter,
    getByLinkedIn,
    register, 
    login, 
    update, 
    remove } = require("./user.controller");

UserRoutes.get('/', getAll);
UserRoutes.get('/:id', getById);
UserRoutes.get('/username/:username', getByUsername);
UserRoutes.get('/projects/:username', getProjectsByUsername);
UserRoutes.get('/favouriteprojects/:username', getFavProjectsByUsername);
UserRoutes.get('/medias/:username', getMediasByUsername);
UserRoutes.get('/company/:username', getByCompany);
UserRoutes.get('/location/:username', getByLocation);
UserRoutes.get('/website/:username', getByWebsite);
UserRoutes.get('/twitter/:username', getByTwitter);
UserRoutes.get('/linkedin/:username', getByLinkedIn);
UserRoutes.post('/register', upload.single("avatar"), register);
UserRoutes.post('/login', login);
UserRoutes.patch('/:id', [authorize], upload.single("avatar"), update);
UserRoutes.delete('/:id', [authorize], remove);

module.exports = UserRoutes;