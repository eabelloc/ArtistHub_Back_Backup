const Project = require("./project.model");
const { setError } = require("../../helpers/utils/error");
const { deleteFile } = require("../../middleware/delete-file");
//create, remove, update, getAll, getById

const getAll = async (req, res, next) => {
    try {
      const projects = await Project.find().populate("users")//.sort({createdAt: "desc"})
      return res.status(200).json({
        message: 'All projects',
        projects
      })
    } catch (error) {
      return next(setError(500, error.message | 'Failed recover all projects'));
    }
  }

  const getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = await (await Project.findById(id)).populate("users");
      if (!project) return next(setError(404, error.message | 'Project not found'));
      return res.status(200).json({
        message: 'project by Id',
        project
      })
    } catch (error) {
      return next(setError(500, error.message | 'Failed project id'));
    }
  }

  const getByProjectTitle = async (req, res, next) => {
    try {
      const {projectTitle} = req.params;
      const project = await Project.find({projectTitle:projectTitle}).populate("users");
      if (!project) return next(setError(404, 'Project not found'));
      return res.json({
          status: 200,
          message: 'Recovered project by projectTitle',
          data: { project }
      });
  } catch (error) {
      return next(setError(500, 'Failed project by projectTitle'))
  }
  }

//TODO: VER SI ESTO FUNCIO (ES PROBABLE QUE DE ERRORES xD)
const create = async (req, res, next) => {
    try {
      const newProject = new Project(req.body);
      if (req.file) {
        newProject.projectImage = req.file.path;
      }
      const projectInDb = await newProject.save();
      res.status(201).json(projectInDb);
    } catch (error) {
        return next(setError(500, 'Failed creating project'))
    };
}
//TODO: VER SI FUNCINA
const update = async (req, res, next) => {
    try{
    const { id } = req.params;
    const project = new Project(req.body);
    project._id = id;
    if (req.file) {
        project.projectImage = req.file.path;
      }
    const updatedProject = await Project.findByIdAndUpdate(id, project)
    if (!updatedProject) return next(setError(404, 'Project not found'));
    return res.status(201).json({
        message: 'Updated project',
        updatedProject
    });
}
    catch (error) {
        return next(setError(500, error.message || 'Failed updating project'));
    };
}

const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedProject = await Project.findOneAndDelete(id);
      if (deletedProject.projectImage) {
        deleteFile(deletedProject.projectImage);
      }
      if (!deletedProject) {
        return next(setError(404, "Project not found"));
      }
      return res.status(200).json({
        message: "User deleted",
        deletedProject,
      });
    } catch (error) {
      return next(setError(500, error.message || "Failed deleting Project"));
    }
  };

  //TODO: ) byDate
  module.exports = {
    getAll,
    getById,
    getByProjectTitle,
    create,
    update,
    remove
  }