export const accountRoutes = {
  login: "/user/login",
  signin: "/user/signin",
  updateImage: "/user/update/photo",
  block: "/user/block",
  getMyProfile: "/user/profile",
  getMineProfile: "/user/my/user",
  deleteById: "/user/remove",
  updateUser: "/user/update/",
  allUsers: "/user/all-users",
  addLang: "/user/add/lang",
  addEducation: "/user/add/education",
  addExp: "/user/add/exp",
  updateMineUser: "/user/update-my",
  updateResume: "/user/update-resume",
  getCompanies: "/user/employeer/get/company",
  addCompany: "/user/employeer/add/company",
  addImageCandidate: "/user/update-profile",
  getEmployess: "/user/company/employees",
  candidatesWithResume: "/user/canidates/with-resume",
};
export const rolesRoutes = {
  getAll: "/role/all/roles",
  getPermission: "/role/all/permissions",
  update: "/role/update/permissions",
};

export const partNumbersRoutes = {
  partImport: "/part/create",
  getAllParts: "/part/all",
  deletePartById: "/part/delete",
  searchByPart: "part/search/all",
};

export const jobRoutes = {
  createJob: "/jobs/create",
  getBom: "/jobs/get/",
  getSingleJob: "/jobs/jobs/get/",
  apply: "/jobs/apply/",
  getCandidates: "/jobs/get/applicants/employeer/",
  appliedJobsCandidated: "/jobs/applied/jobs",
  updateResumeStatus: "/jobs/resume/apply/",
  getProgressUpdate: "/jobs/progress/",
  createInterview: "/jobs/create/interview/",
  getMineInterviews: "/jobs/fetch/interviews",
  rejectCanidate: "/jobs/reject/candidate/",
  createInvite: "/jobs/create/invite/",
  getInvitesCount: "/jobs/invites/count",
  getFullInviteObjects: "/jobs/invites/get",
  updateInvite: "/jobs/put/invites/",
  getMyCompanyJobs: "/jobs/get/company/",
  getCompanyDistribution: "/jobs/distribution",
};
