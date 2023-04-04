const multer = require('multer');
const path = require('path');
const User = require('../models/user');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../images/profile-pictures');
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const uploadProfilePicture = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const userId = req.userData.userId;
  const imagePath = path.join('images', 'profile-pictures', req.file.filename);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImageUrl = imagePath; // Change this line
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      imagePath: imagePath,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};


module.exports = {
  upload,
  uploadProfilePicture,
};
