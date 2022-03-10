/**
 * 后端接口返回的响应状态码
 */
export enum ResultEnum {
  SUCCESS = 1,
  ERROR = 0,
  EXPIRED = 20,
  AUTHENTICATION_FAILED = 11,
  LOGIN_FAILED = 12,
  BAD_REQUEST_PARAMS = 31,
  BIZ_ERROR = 35,

  TIMEOUT = 401,

  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
