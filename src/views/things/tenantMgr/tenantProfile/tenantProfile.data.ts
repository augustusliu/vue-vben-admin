import { BasicColumn, FormSchema } from '/@/components/Table';
import moment from "moment";

// 租户画像列表展示
export const tenantProfileColumn: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 50,
    defaultHidden: true,
  },
  {
    title: '租户配置名称',
    dataIndex: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: '默认配置',
    dataIndex: 'isDefault',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isDefault')) {
        record.isDefault = false;
      }
      if (record.isDefault) {
        return '是';
      }
      return '否';
    },
  },
  {
    title: '独占业务线',
    dataIndex: 'isolatedBusiness',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isolatedBusiness')) {
        record.isolatedBusiness = false;
      }
      if (record.isolatedBusiness) {
        return '是';
      }
      return '否';
    },
  },
  {
    title: '独占规则引擎',
    dataIndex: 'isolatedRuleEngine',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isolatedRuleEngine')) {
        record.isolatedRuleEngine = false;
      }
      if (record.isolatedRuleEngine) {
        return '是';
      }
      return '否';
    },
  },
  {
    title: '最大设备数',
    dataIndex: 'maxDevices',
  },
  {
    title: '最大客户数',
    dataIndex: 'maxCustomers',
  },
  {
    title: '最大用户数',
    dataIndex: 'maxUsers',
  },
  {
    title: '数据存储天数',
    dataIndex: 'maxStorageDays',
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

// 租户画像搜索项
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户配置名称',
    component: 'Input',
    colProps: { span: 11 },
  },
  {
    field: 'isDefault',
    label: '是否为默认配置',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 11 },
  },
  {
    field: 'isolatedBusiness',
    label: '独占业务线',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 11 },
  },
  {
    field: 'isolatedRuleEngine',
    label: '独占规则引擎',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 11 },
  },
];

// 添加、更新 租户画像信息
export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '租户画像id',
    component: 'Input',
    colProps: { span: 22 },
    show: false,
  },
  {
    field: 'name',
    label: '配置名称',
    component: 'Input',
    colProps: { span: 18 },
    required: true,
  },
  {
    field: 'isDefault',
    label: '默认配置',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 18 },
  },
  {
    field: 'isolatedBusiness',
    label: '独占业务线',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 18 },
  },
  {
    field: 'isolatedRuleEngine',
    label: '独占规则引擎',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    colProps: { span: 18 },
  },
  {
    field: 'maxCustomers',
    label: '客户数限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxUsers',
    label: '用户数限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxDevices',
    label: '设备数限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxRuleChains',
    label: '规则数限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxTransportMessage',
    label: '消息量限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxTransportDataPoint',
    label: '数据点限制',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxBizExecutors',
    label: '业务线程数',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxJsExecutor',
    label: 'JS线程数量',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'maxStorageDays',
    label: '存储天数限制',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'maxTenantMsgRateLimit',
    label: '消息流量限制',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'maxTenantTelemetryMsgRateLimit',
    label: '遥测流量限制',
    component: 'Input',
    colProps: { span: 20 },
  },
];
