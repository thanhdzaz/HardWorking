export interface GetAllUserOutput {
  userName: string,
  fullName: string,
  emailAddress: string,
  lastLoginTime: Date,
  creationTime: Date,
  roleNames: string[],
  idEmployee: number,
  department: string,
  subdivision: string,
  postition: string,
  isStopWork: boolean,
  id: number
}
