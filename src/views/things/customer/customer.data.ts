import { BasicColumn, FormSchema } from '/@/components/Table';

export const customerColumn: BasicColumn[] = [
  {
    title: '客户id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '客户名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '客户邮箱',
    dataIndex: 'email',
    width: 100,
  },
  {
    title: '省份',
    dataIndex: 'province',
    width: 100,
  },
  {
    title: '城市',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: '区县',
    dataIndex: 'country',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 100,
  },
  {
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '客户名称',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'email',
    label: '客户邮箱',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'province',
    label: '所在省份',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'city',
    label: '所在城市',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'country',
    label: '所在区县',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '客户id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '客户名称',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'email',
    label: '邮箱地址',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'province',
    label: '省份',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'city',
    label: '城市',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'country',
    label: '区县',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'addressDetail',
    label: '详细地址',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'zipcode',
    label: '邮编',
    component: 'Input',
    colProps: { span: 12 },
  },
];
