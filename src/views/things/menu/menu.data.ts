import { BasicColumn, FormSchema } from '/@/components/Table';
import {h} from "vue";
import {Icon} from "/@/components/Icon";
import {Tag} from "ant-design-vue";

// 菜单列表
export const menuColumn: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'nameSearch',
    width: 200,
  },
  {
    title: '菜单目录',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '路由地址',
    dataIndex: 'path',
  },
  {
    title: '跳转路径',
    dataIndex: 'redirect',
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
  },
  {
    title: '启用状态',
    dataIndex: 'disabled',
    customRender: ({ record }) => {
      const disabled = record.disabled;
      const color = disabled ? 'red' : 'green';
      const text = disabled ? '禁用' : '启用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '是否显示',
    dataIndex: 'hideMenu',
    customRender: ({ record }) => {
      const hideMenu = record.hideMenu;
      const color = hideMenu ? 'red' : 'green';
      const text = hideMenu ? '隐藏' : '显示';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '固定导航',
    dataIndex: 'hideBreadcrumb',
    customRender: ({ record }) => {
      const hideBreadcrumb = record.hideBreadcrumb;
      const text = hideBreadcrumb ? '不固定' : '固定';
      return h(Tag, () => text);
    },
  },
];

// 菜单搜索项
export const menuSearchFormSchema: FormSchema[] = [
  {
    field: 'nameSearch',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'disabled',
    label: '启用状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: false },
        { label: '禁用', value: true },
      ],
    },
    colProps: { span: 8 },
  },
];


export const menuCreateOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '菜单id',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '菜单目录',
    component: 'Input',
    required: true,
  },
  {
    field: 'nameSearch',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'nameSearch',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: true,
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    required: true,
  },
  {
    field: 'redirect',
    label: '跳转地址',
    component: 'Input',
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
  },
  {
    field: 'i18nTitle',
    label: '国际化引用',
    component: 'Input',
  },
  {
    field: 'disabled',
    label: '启用状态',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '启用', value: false },
        { label: '禁用', value: true },
      ],
    },
  },
  {
    field: 'hideMenu',
    label: '是否显示菜单',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
    },
  },
  {
    field: 'hideBreadcrumb',
    label: '是否固定导航',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '固定', value: false },
        { label: '不固定', value: true },
      ],
    },
  },
];
