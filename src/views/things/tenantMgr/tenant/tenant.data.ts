import { BasicColumn, FormSchema } from '/@/components/Table';
import { listTenantProfileAll } from '/@/api/things/tenant/tenantApi';
// 列表显示字段
export const tenantColumn: BasicColumn[] = [
  {
    title: '租户名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 80,
  },
  {
    title: '省份',
    dataIndex: 'province',
    width: 50,
  },
  {
    title: '城市',
    dataIndex: 'city',
    width: 50,
  },
  {
    title: '当前状态',
    dataIndex: 'enabled',
    width: 50,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'enabled')) {
        record.isDefault = false;
      }
      if (record.isDefault) {
        return '是';
      }
      return '否';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'modifiedTime',
    width: 120,
  },
];

// 搜索字段
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'email',
    label: '租户邮箱',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'phone',
    label: '租户手机号',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'enabled',
    label: '租户状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
    colProps: { span: 12 },
  },
];

// 添加新租户字段
export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '租户ID',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
    colProps: { span: 22 },
    required: true,
  },
  {
    field: 'tenantProfileId',
    label: '配置模板',
    component: 'ApiSelect',
    componentProps: {
      api: listTenantProfileAll,
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 22 },
    required: true,
  },
  {
    field: 'enabled',
    label: '租户状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
    required: true,
    colProps: { span: 22 },
  },
  {
    field: 'email',
    label: '租户邮箱',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    field: 'phone',
    label: '租户手机号',
    component: 'Input',
    colProps: { span: 22 },
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
    label: '所在区/县',
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
