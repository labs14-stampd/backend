const { addUser, updateUser, deleteUser } = require('./userMutations.js');
const { addSchoolDetail, updateSchoolDetail } = require('./schoolMutations.js');

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addSchoolDetail,
  updateSchoolDetail
};
