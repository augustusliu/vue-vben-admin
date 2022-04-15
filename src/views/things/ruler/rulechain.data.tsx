import {BasicColumn, FormSchema} from "/@/components/Table";
import moment from "moment";
import { Switch } from "ant-design-vue";

export const ruleChainModelSchema: FormSchema[] =[
  {
    field: 'ruleChainName',
    label: '规则链名称',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: "输入规则链名称，长度不能超过50个字符"
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'InputTextArea',
    componentProps: {
      style: {'min-height': '100px'}
    }
  },
];

// 列表展示
export const ruleChainColumn: BasicColumn[] = [
  {
    title: '规则id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '规则名称',
    dataIndex: 'ruleChainName',
  },
  {
    title: '是否启用',
    dataIndex: 'active',
    customRender: ({record}) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked = {record.active} />;
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]


export const searchFormSchema: FormSchema[] = [
  {
    field: 'ruleChainName',
    label: '规则名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'active',
    label: '启用状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
    colProps: { span: 6 },
  },
];
