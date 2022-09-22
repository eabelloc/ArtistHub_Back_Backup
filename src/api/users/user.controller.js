const User = require('./user.model');

const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/utils/token-action");
const { setError } = require("../../helpers/utils/error");
const { deleteFile } = require('../../middleware/delete-file');

const getAll = async (req, res, next) => {
    try {
        const users = await User.find().populate("projects medias favProjects");
        return res.status(200).json({
            message: 'All Users',
            users
        })
    } catch (error) {
        return next(setError(500, error.message | 'Failed recover all users'));
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("projects medias favProjects");
        if (!user) return next(setError(404, "User not found"));
        return res.status(200).json(user);
    } catch (error) {
        return next(setError(500, error.message || 'Failed recover User'));
        }
};

const getByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.find({username:username}).populate("projects medias favProjects");
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by username',
        data: { user }
    });
} catch (error) {
    return next(setError(500, error.message || 'Failed user by username'))
}
};

const getProjectsByUsername = async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({username:username}).populate("projects");
    const {projects} = user
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
      status: 200,
      message: 'Recovered projects by username',
      data: {username: username, projects}
  });

  } catch (error) {
    return next(setError(500, error.message || 'Failed to recover projects by username')) 
  }
};

const getFavProjectsByUsername = async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({username:username}).populate("favProjects");
    const {favProjects} = user
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
      status: 200,
      message: 'Recovered favourite projects by username',
      data: {username: username, favProjects}
  });

  } catch (error) {
    return next(setError(500, error.message || 'Failed to recover favourite projects by username')) 
  }
};

const getMediasByUsername = async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({username:username}).populate("medias");
    const {medias} = user
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
      status: 200,
      message: 'Recovered medias by username',
      data: {username: username, medias}
  });

  } catch (error) {
    return next(setError(500, error.message || 'Failed to recover medias by username')) 
  }
};

const getByCompany = async (req, res, next) => {
  try {
    const {company} = req.params;
    const user = await User.find({company:company});
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by company',
        data: { user }
    });
} catch (error) {
    return next(setError(500, 'Failed user by company'))
}
};

const getByLocation = async (req, res, next) => {
  try {
    const {location} = req.params;
    const user = await User.find({location:location});
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by location',
        data: { user }
    });
} catch (error) {
    return next(setError(500, 'Failed user by location'))
}
};

const getByWebsite = async (req, res, next) => {
  try {
    const {website} = req.params;
    const user = await User.find({website:website});
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by website',
        data: { user }
    });
} catch (error) {
    return next(setError(500, 'Failed user by website'))
}
};

const getByTwitter = async (req, res, next) => {
  try {
    const {twitter} = req.params;
    const user = await User.find({twitter:twitter});
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by twitter',
        data: { user }
    });
} catch (error) {
    return next(setError(500, 'Failed user by twitter'))
}
};

const getByLinkedIn = async (req, res, next) => {
  try {
    const {linkedin} = req.params;
    const user = await User.find({linkedin:linkedin});
    if (!user) return next(setError(404, 'User not found'));
    return res.json({
        status: 200,
        message: 'Recovered user by linkedin',
        data: { user }
    });
} catch (error) {
    return next(setError(500, 'Failed user by linkedin'))
}
};

const register = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        const usernameExist = await User.findOne({ username: newUser.username });
        const emailExist = await User.findOne({ email: newUser.email });
        if (usernameExist || emailExist) return next(setError(409, "This username || email already exist"));
        if(req.file) {
            newUser.avatar = req.file.path
        }
        const userInDb = await newUser.save();
        res.status(201).json(userInDb);
    } catch (error) {
        return next(setError(500, error.message || 'Failed create User'));
    }
};

const login = async (req, res, next) => {
    try {
      const userInDb = await User.findOne({ username: req.body.username });
      if (!userInDb) return next(setError(404, "User not found"));
      if (bcrypt.compareSync(req.body.password, userInDb.password)) {
        const token = createToken(userInDb._id, userInDb.username);
        return res.status(200).json({ userInDb, token })
      } else {
        return next(setError(401, "Invalid Password"));
      }
    } catch (error) {
      return next(setError(500, error.message || 'Unexpected error at login'));
    }
};

const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = new User(req.body);
      user._id = id;
      if(req.file) {
        user.avatar = req.file.path
      }
      const updatedUser = await User.findByIdAndUpdate(id, user);
      if (!updatedUser) return next(setError(404, 'User not found'));
      return res.status(201).json({
        message: 'Updated User',
        updatedUser
      })
  
    } catch (error) {
      return next(setError(500, error.message | 'Failed updated user'));
    }
  };

const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser.avatar) {
        deleteFile(deletedUser.avatar)
      }
      if (!deletedUser) return next(setError(404, 'User not found'));
      return res.status(200).json({
        message: 'Delete User',
        deletedUser
      })
    } catch (error) {
      return next(setError(500, error.message || 'Failed deleted user'));
    }
  };
  
  module.exports = { 
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
    remove };