import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import moment from "moment";
import {listDeviceWithPageApi} from '/@/api/things/device/deviceApi';
import {Tag} from "ant-design-vue";
import {h} from "vue";
import {SvgIcon} from "/@/components/Icon";
import {indexColor} from "/@/views/things/common/constant/ColorRandom";
import {listTemplateWithPager} from "/@/api/things/asset/templateApi";
import {listEntityGroupByPager} from "/@/api/things/entityGroup/entityGroupApi";
import {listAssetNamesByPager} from "/@/api/things/asset/assetApi";

export const deviceTableColumn: BasicColumn[] = [
  {
    title: '设备id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'name',
  },
  {
    title: '设备编号',
    dataIndex: 'code',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(SvgIcon, { name: record.icon});
    },
  },
  {
    title: '在线状态',
    dataIndex: 'online',
    customRender: ({ record }) => {
      return record.online ? <Tag color="lime">在线</Tag> : <Tag color="cyan">离线</Tag>;
    },
  },
  {
    title: '传输协议',
    dataIndex: 'transportType',
  },
  {
    title: '网关设备',
    dataIndex: 'isGateway',
    customRender: ({ record }) => {
      return record.isGateway ? <Tag color="cyan">网关设备</Tag> : <Tag color="purple">普通设备</Tag>;
    },
  },
  {
    title: '标签',
    dataIndex: 'label',
    customRender: ({ record }) => {
      if(record.label != null && record.label.length > 0){
        let re = [];
        // @ts-ignore
        record.label.forEach((label, index) => {
          // @ts-ignore
          re.push(<Tag color={indexColor(index)} style={"margin-right:3px"}> {label} </Tag>);
        });
        return re;
      }
      return null;
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '所属资产id',
    dataIndex: 'belongToAsset',
    defaultHidden: true,
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

export const deviceSearchScheme: FormSchema[] = [
  {
    field: 'name',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '设备编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'label',
    label: '标签',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'isGateway',
    label: '网关设备',
    component: 'Select',
    componentProps: {
      options: [
        { label: '网关设备', value: true },
        { label: '普通设备', value: false },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '传输协议',
    field: 'transportType',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'HTTP', value: 'HTTP' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'CoAP', value: 'CoAP' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '设备id',
    component: 'Input',
    colProps: { span: 20 },
    show: false,
  },
  {
    field: 'name',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 12 },
    required: true,
    helpComponentProps: {
      text: '必填，长度不超过100个字符'
    },
  },
  {
    field: 'code',
    label: '设备编号',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'icon',
    label: '设备图标',
    required: true,
    component: 'IconPicker',
    componentProps: {
      mode: 'svg',
    },
    colProps: { span: 24 },
  },
  {
    field: 'label',
    label: '设备标签',
    component: 'Select',
    colProps: { span: 24 },
    componentProps: {
      mode: 'tags',
      placeholder: '请输入设备标签',
    },
  },
  {
    field: 'transportType',
    label: '传输协议',
    component: 'Select',
    required: true,
    defaultValue: 'HTTP',
    componentProps: {
      options: [
        { label: 'HTTP', value: 'HTTP' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'CoAP', value: 'CoAP' },
      ],
    },
    colProps: { span: 12 },
  },
  {
    field: 'belongToAsset',
    label: '隶属资产',
    component: 'SingleSearchSelect',
    colProps: { span: 12 },
    componentProps: {
      placeholder: '搜索相关资产',
      api: listAssetNamesByPager,
      params: {
        name: '',
        disabled: false,
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
    field: 'isGateway',
    label: '网关设备',
    component: 'Select',
    required: true,
    defaultValue: false,
    componentProps: {
      options: [
        { label: '网关设备', value: true },
        { label: '普通设备', value: false },
      ],
    },
    colProps: { span: 12 },
  },
  {
    field: 'parentId',
    label: '父设备',
    component: 'SingleSearchSelect',
    colProps: { span: 12 },
    componentProps: {
      placeholder: '搜索网关设备',
      api: listDeviceWithPageApi,
      params: {
        name: '',
        isGateway: true,
      },
      resultField: 'items',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      immediate: false,
      showSearch: true,
    },
    show: ({ values }) => {
      return !values.isGateway;
    },
  },
  {
    field: 'deviceTemplateId',
    label: '物模型',
    component: 'SingleSearchSelect',
    colProps: { span: 12 },
    helpComponentProps: {
      text: '设备创建时，会自动复制无模型配置的属性及指令数据'
    },
    componentProps: {
      placeholder: "搜索相关物模型",
      api: listTemplateWithPager,
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
    field: 'deviceGroupId',
    label: '所属分组',
    component: 'SingleSearchSelect',
    required: false,
    colProps: { span: 12 },
    componentProps: {
      placeholder: "搜索设备分组",
      api: listEntityGroupByPager,
      params: {
        name: '',
        entityType: 'DEVICE',
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
    field: 'description',
    label: '设备描述',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
]

// 设备详情页描述信息
export const deviceDetailInfoScheme: DescItem[] = [
  {
    field: 'id',
    label: '设备ID',
  },
  {
    field: 'name',
    label: '设备名称',
  },
  {
    field: 'code',
    label: '设备编号',
  },
  {
    field: 'userId',
    label: '创建人',
  },
  {
    field: 'transportType',
    label: '传输协议',
  },
  {
    field: 'isGateway',
    label: '网关设备',
    render: ( val ) => {
      return val ? '设备网关' : '普通设备';
    },
  },
  {
    field: 'label',
    label: '设备标签',
    render: ( label ) => {
      if(label != null && label.length > 0){
        let re = [];
        // @ts-ignore
        label.forEach(item => re.push(<Tag color="#87d068" style={"margin-right:3px"}> { item } </Tag>));
        return re;
      }
      return null;
    },
  },
  {
    field: 'modifiedTime',
    label: '修改时间',
    render: ( val ) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'createdTime',
    label: '创建时间',
    render: ( val ) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'description',
    label: '设备描述',
  },
]
