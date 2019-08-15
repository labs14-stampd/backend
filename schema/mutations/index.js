const { addUser, updateUser, deleteUser } = require('./userMutations.js');
const { addSchoolDetail, updateSchoolDetail } = require('./schoolMutations.js');
const {
  addStudentDetail,
  updateStudentDetail
} = require('./studentMutations.js');

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addSchoolDetail,
  updateSchoolDetail,
  addStudentDetail,
  updateStudentDetail
};
