const {
  addUser,
  updateUser,
  deleteUser,
  addUserEmail
} = require('./userMutations.js');
const { addSchoolDetail, updateSchoolDetail } = require('./schoolMutations.js');
const { addStudentDetail, updateStudentDetail } = require('./studentMutations');

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addUserEmail,
  addSchoolDetail,
  updateSchoolDetail,
  addStudentDetail,
  updateStudentDetail
};
