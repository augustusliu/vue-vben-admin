import {BasicColumn, FormSchema} from "/@/components/Table";
import moment from "moment";

export const entityGroupColumn: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    defaultHidden: true,
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
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
]

export const deviceGroupSearchScheme: FormSchema[] = [
  {
    field: 'name',
    label: '分组名称',
    component: 'Input',
    colProps: { span: 8 },
  },
]

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '分组id',
    component: 'Input',
    show: false,
    colProps: { span: 22 },
  },
  {
    field: 'name',
    label: '分组名称',
    component: 'Input',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      placeholder: '分组名称不能超过25个字符',
    },
  },
  {
    field: 'description',
    label: '分组描述',
    component: 'InputTextArea',
    colProps: { span: 22 },
    componentProps: {
      placeholder: '描述信息不能超过200个字符',
    },
  },
]