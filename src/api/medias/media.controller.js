const Media = require("./media.model");
const { setError } = require("../../helpers/utils/error");
const { deleteFile } = require("../../middleware/delete-file");
//create, remove, update, getAll, getById

const getAll = async (req, res, next) => {
    try {
      const medias = await Media.find().populate("users")//.sort({ createAt: 'desc' });
      return res.status(200).json({
        message: 'All medias',
        medias
      })
    } catch (error) {
      return next(setError(500, error.message | 'Failed recover all media'));
    }
  }

const getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const media = await (await Media.findById(id)).populate("users");
      if (!media) return next(setError(404, error.message | 'Media not found'));
      return res.status(200).json({
        message: 'media by Id',
        media
      })
  
    } catch (error) {
      return next(setError(500, error.message | 'Failed media id'));
    }
}

const getByMediaTitle = async (req, res, next) => {
  try {
    const {mediaTitle} = req.params;
    const media = await Media.find({mediaTitle:mediaTitle}).populate("users");
    if (!media) return next(setError(404, 'Media not found'));
    return res.json({
        status: 200,
        message: 'Recovered media by mediaTitle',
        data: { media }
    });
} catch (error) {
    return next(setError(500, 'Failed media by mediaTitle'))
}
}

//TODO: VER SI ESTO FUNCIO (ES PROBABLE QUE DE ERRORES xD)
const create = async (req, res, next) => {
    try {
      const newMedia = new Media(req.body);
      if (req.file) {
        newMedia.mediaImage = req.file.path;
      }
      else if (req.file) {
        newMedia.mediaVideo = req.file.path;
      }
      const mediaInDb = await newMedia.save();
      res.status(201).json(mediaInDb);
    } catch (error) {
        return next(setError(500, 'Failed creating media'))
    };
}
//TODO: VER CÓMO SUBIR VARIOS ARCHIVOS (CLOUDINARY, MULTER Y EXPRESS)
const update = async (req, res, next) => {
    try{
    const { id } = req.params;
    const media = new Media(req.body);
    media._id = id;
    if (req.file) {
        media.mediaImage = req.file.path;
      }
      else if (req.file) {
        media.mediaVideo = req.file.path;
      }
    const updatedMedia = await Media.findByIdAndUpdate(id, media);
    if (!updatedMedia) return next(setError(404, 'Media not found'));
    return res.status(201).json({
        message: 'Updated media',
        updatedMedia
    });
}
    catch (error) {
      return next(setError(500, error.message || 'Failed updating media'));
    };
}

const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedMedia = await Media.findOneAndDelete(id);
      if (deletedMedia.mediaImage) {
        deleteFile(deletedMedia.mediaImage);
      }
      else if (deletedMedia.mediaVideo) {
        deleteFile(deletedMedia.mediaVideo);
      }
      if (!deletedMedia) {
        return next(setError(404, "Media not found"));
      }
      return res.status(200).json({
        message: "User deleted",
        deletedMedia,
      });
    } catch (error) {
      return next(setError(500, error.message || "Failed deleting Media"));
    }
  };

  module.exports = {
    getAll,
    getById,
    getByMediaTitle,
    create,
    update,
    remove
  }