const MediaRoutes = require('express').Router();
const { authorize } = require("../../middleware/auth");
const {
    getAll,
    getById,
    getByMediaTitle,
    create,
    update,
    remove
  } = require("./media.controller");

const upload = require("../../middleware/file");

MediaRoutes.get("/", getAll);
MediaRoutes.get("/:id", getById);
MediaRoutes.get("/:mediaTitle", getByMediaTitle);
MediaRoutes.post("/create", [authorize], upload.single("mediaImage"), create);
MediaRoutes.patch("/:id", [authorize], upload.single("mediaImage"), update);
MediaRoutes.delete("/:id", [authorize], remove);

module.exports = MediaRoutes;