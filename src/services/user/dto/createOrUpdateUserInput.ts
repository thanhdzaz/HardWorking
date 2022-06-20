export interface CreateOrUpdateUserInput {
  userName: string,
  fullName: string,
  emailAddress: string,
  phoneNumber: number,
  // lastLoginTime: Date,
  // creationTime: Date,
  roleNames: string[],
  idEmployee: string,
  department: string,
  subdivision: string,
  postition: string,
  password: string,
  isResetPassword: boolean,
  isStopWork: boolean
}
