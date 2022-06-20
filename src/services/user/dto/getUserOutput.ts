export interface GetUserOutput {
  userName: string,
  fullName: string,
  emailAddress: string,
  lastLoginTime: Date,
  creationTime: Date,
  roleNames: string[],
  idEmployee: string,
  department: string,
  subdivision: string,
  postition: string,
  isStopWork: boolean,
  id: number
  phoneNumber: string,
}
