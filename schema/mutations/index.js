const {
  addUser,
  updateUser,
  deleteUser,
  addUserEmail,
  deleteUserEmail
} = require('./userMutations.js');
const { addSchoolDetail, updateSchoolDetail } = require('./schoolMutations.js');
const {
  addStudentDetail,
  updateStudentDetail
} = require('./studentMutations.js');

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addUserEmail,
  deleteUserEmail,
  addSchoolDetail,
  updateSchoolDetail,
  addStudentDetail,
  updateStudentDetail
};
