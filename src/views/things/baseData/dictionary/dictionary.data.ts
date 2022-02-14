import { BasicColumn, FormSchema } from '/@/components/Table';
import {h} from "vue";
import {Tag} from "ant-design-vue";
import moment from "moment";

export const dictionaryColumn: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '编码',
    dataIndex: 'code',
  },
  {
    title: '字典类型',
    dataIndex: 'dictionaryType',
  },
  {
    title: '是否系统默认',
    dataIndex: 'systemDefault',
    customRender: ({ record }) => {
      const isDefault = record.systemDefault;
      const text = isDefault ? '系统默认' : '用户定义';
      return h(Tag, () => text);
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
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  }
]

export const dictionarySearchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'dictionaryType',
    label: '字典类型',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'systemDefault',
    label: '是否系统默认',
    component: 'Select',
    componentProps: {
      options: [
        { label: '系统默认', value: true },
        { label: '用户定义', value: false },
      ],
    },
    colProps: { span: 8 },
  }
]

export const dictionaryCreateOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '字典id',
    component: 'Input',
    show: false,
    colProps: { span: 20 },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'dictionaryType',
    label: '字典类型',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'parentId',
    label: '父节点',
    colProps: { span: 11 },
    component: 'TreeSelect',
    componentProps: {
      // 用户适配前后端接口数据
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },

  },
  {
    field: 'systemDefault',
    label: '是否系统默认',
    colProps: { span: 11 },
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },

]
