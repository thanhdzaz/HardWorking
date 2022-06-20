export class EntityDto<T = number>
{
  id!: T;
}
export class EntityDtoUser<T = string>
{
  id!: T;
}

export class codeDto<T = string>
{
  code!: T;
}

export class nameDto<T = string>
{
  name!: T;
}


export class ResponseDto<T = any>
{
  status?: boolean;
  message?: string;
  data?: T;
}
