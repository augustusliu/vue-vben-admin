import { BasicColumn, FormSchema } from '/@/components/Table';

export const userColumn: BasicColumn[] = [
  {
    title: '用户id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '租户id',
    dataIndex: 'tenantId',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '客户id',
    dataIndex: 'customerId',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '用户名称',
    dataIndex: 'username',
  },
  {
    title: '所属租户',
    dataIndex: 'tenantName',
  },
  {
    title: '所属客户',
    dataIndex: 'customerName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '真实名称',
    dataIndex: 'realName',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    title: '更新时间',
    dataIndex: 'modifiedTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'realName',
    label: '真实姓名',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    colProps: { span: 12 },
  },
];

// 创建用户
export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'username',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'realName',
    label: '真实名称',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'email',
    label: '邮箱地址',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: '用户描述',
    label: 'description',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    field: '用户头像',
    label: 'avatar',
    component: 'Input',
    colProps: { span: 22 },
  },
];
