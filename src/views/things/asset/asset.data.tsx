import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { Tag } from 'ant-design-vue';
import moment from 'moment';
import { SvgIcon } from '/@/components/Icon';
import { h } from 'vue';
import { indexColor } from '../common/constant/ColorRandom';
import {listDictionaryAssetLabels} from "/@/api/things/dictionary/dictionaryApi";

export const assetColumn: BasicColumn[] = [
  {
    title: '资产id',
    dataIndex: 'id',
    width: 5,
    defaultHidden: true,
  },
  {
    title: '资产名称',
    dataIndex: 'name',
  },
  {
    title: '资产编号',
    dataIndex: 'code',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(SvgIcon, { name: record.icon });
    },
  },
  {
    title: '资产标签',
    dataIndex: 'label',
    customRender: ({ record }) => formatLabels(record.assetLabels),
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '修改时间',
    dataIndex: 'modifiedTime',
    width: 180,
    customRender: ({ record }) => {
      return moment(Number(record.modifiedTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 180,
    customRender: ({ record }) => {
      return moment(Number(record.createdTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

// 用于资产详情页信息展示
// @ts-ignore
// @ts-ignore
// @ts-ignore
export const assetInfoScheme: DescItem[] = [
  {
    field: 'id',
    label: '资产ID',
  },
  {
    field: 'name',
    label: '资产名称',
  },
  {
    field: 'code',
    label: '资产编号',
  },
  {
    field: 'userId',
    label: '创建人',
  },
  {
    field: 'tenantName',
    label: '所属租户',
  },
  {
    field: 'customerName',
    label: '所属客户',
  },
  {
    field: 'assetLabels',
    label: '资产标签',
    render: ( val ) => {
      return formatLabels(val) ;
    },
  },
  {
    field: 'modifiedTime',
    label: '修改时间',
    render: (val) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'createdTime',
    label: '创建时间',
    render: (val) => {
      return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'description',
    label: '资产描述',
  },
];

// 搜索域的字段
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '资产名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '资产编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'label',
    label: '资产标签',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const createOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '资产id',
    component: 'Input',
    colProps: { span: 20 },
    show: false,
  },
  {
    field: 'name',
    label: '资产名称',
    component: 'Input',
    colProps: { span: 20 },
    required: true,
    helpComponentProps: {
      text: '必填，长度不超过100个字符',
    },
  },
  {
    field: 'code',
    label: '资产编号',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'icon',
    label: '资产图标',
    required: true,
    component: 'IconPicker',
    componentProps: {
      mode: 'svg',
    },
    colProps: { span: 20 },
  },
  {
    field: 'label',
    label: '资产标签',
    component: 'ApiTreeSelect',
    colProps: { span: 20 },
    componentProps: {
      api: listDictionaryAssetLabels,
      multiple: 'tag',
      maxTagCount: 3,
      treeCheckable: true,
      treeDefaultExpandAll: true,
      dropdownStyle: { maxHeight: 270, overflow: 'auto' },
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'description',
    label: '资产描述',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
];


const formatLabels = ( assetLabels ) => {
  let re = [];
  if (assetLabels != null && assetLabels.length > 0) {
    // @ts-ignore
    assetLabels.forEach((label, index) => {
      // @ts-ignore
      re.push(<Tag color={indexColor(index)} style={'margin-right:3px'}>
          {label.labelName}
        </Tag>
      );
    });
  }
  return re;
}
