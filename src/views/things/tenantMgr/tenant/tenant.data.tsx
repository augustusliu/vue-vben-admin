import { BasicColumn, FormSchema } from '/@/components/Table';
import { listTenantProfileAll } from '/@/api/things/tenant/tenantApi';
import moment from "moment";
import {Tag} from "ant-design-vue";
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
  },
  {
    title: '区域',
    dataIndex: 'areaName',
  },
  {
    title: '行业',
    dataIndex: 'industryName',
  },
  {
    title: '租户配置',
    dataIndex: 'tenantProfileName',
  },
  {
    title: '当前状态',
    dataIndex: 'enabled',
    customRender: ({ record }) => {
      return record.enabled ? <Tag color="purple">启用</Tag> : <Tag color="cyan">禁用</Tag>;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '更新时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

// 搜索字段
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'email',
    label: '租户邮箱',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '租户手机号',
    component: 'Input',
    colProps: { span: 8 },
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
    colProps: { span: 8 },
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
    field: 'areaCode',
    label: '所在地区',
    component: 'Cascader',
    colProps: { span: 11 },
    required: true,
    componentProps: {
      fieldNames: {
        label: 'name',
        value: 'code',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'industryCode',
    label: '所在行业',
    component: 'Cascader',
    colProps: { span: 11 },
    required: true,
    componentProps: {
      fieldNames: {
        label: 'name',
        value: 'code',
      },
      getPopupContainer: () => document.body,
    },
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
  }
];
