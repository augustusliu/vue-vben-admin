import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";
import {listAuthorityWithPager} from "/@/api/things/roles/roleApi";

export const customerColumn: BasicColumn[] = [
  {
    title: '客户id',
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
    title: '客户名称',
    dataIndex: 'name',
  },
  {
    title: '客户邮箱',
    dataIndex: 'email',
  },
  // {
  //   title: '租户名称',
  //   dataIndex: 'tenantName',
  // },
  {
    title: '区域',
    dataIndex: 'areaName',
  },
  {
    title: '行业',
    dataIndex: 'industryName',
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
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },

];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '客户名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'email',
    label: '客户邮箱',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
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
    required: true,
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'phone',
    label: '手机号',
    required: true,
    component: 'Input',
    colProps: { span: 11 },
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
    colProps: { span: 11 },
  },
  {
    field: 'authorityId',
    label: '选择角色',
    component: 'SingleSearchSelect',
    colProps: { span: 11 },
    required: true,
    componentProps: {
      api: listAuthorityWithPager,
      placeholder: '搜索角色信息',
      params: {
        name: '',
        enabled: true,
      },
      resultField: 'items',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      immediate: false,
      showSearch: true,
    },
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
    colProps: { span: 11 },
  },
];
