import {BasicColumn, FormSchema} from "/@/components/Table";
import moment from "moment";

export const issueDeviceAttributeColumn: BasicColumn[] = [
  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '属性编码',
    dataIndex: 'key',
  },
  {
    title: '矫正内容',
    dataIndex: 'value',
  },
  {
    title: '触发方式',
    dataIndex: 'issueSrc',
    customRender: ({ record }) => {
      if (record.issueSrc === 'RULE_CHAIN') {
        return '规则触发';
      } else{
        return '人工触发';
      }
    }
  },
  {
    title: '下发状态',
    dataIndex: 'issueStatus',
    customRender: ({ record }) => {
      if (record.issueStatus === 'ISSUE_DONGING') {
        return '处理中';
      } else if(record.issueStatus === 'ISSUE_SUCCESS'){
        return '成功';
      } else if(record.issueStatus === 'ISSUE_FAILURE'){
        return '失败';
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '失败原因',
    dataIndex: 'reason',
  },
  {
    title: '操作者',
    dataIndex: 'creatorName',
  },
  {
    title: '下发时间',
    dataIndex: 'ts',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

export const issueAssetAttributeColumn: BasicColumn[] = [
  {
    title: '属性id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'entityName',
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '属性编码',
    dataIndex: 'key',
  },
  {
    title: '矫正内容',
    dataIndex: 'value',
  },
  {
    title: '触发方式',
    dataIndex: 'issueSrc',
    customRender: ({ record }) => {
      if (record.issueSrc === 'RULE_CHAIN') {
        return '规则触发';
      } else{
        return '人工触发';
      }
    }
  },
  {
    title: '下发状态',
    dataIndex: 'issueStatus',
    customRender: ({ record }) => {
      if (record.issueStatus === 'ISSUE_DONGING') {
        return '处理中';
      } else if(record.issueStatus === 'ISSUE_SUCCESS'){
        return '成功';
      } else if(record.issueStatus === 'ISSUE_FAILURE'){
        return '失败';
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '失败原因',
    dataIndex: 'reason',
  },
  {
    title: '操作者',
    dataIndex: 'creatorName',
  },
  {
    title: '下发时间',
    dataIndex: 'ts',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]


export const issueDeviceCommandColumn: BasicColumn[] = [
  {
    title: '指令id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '指令编码',
    dataIndex: 'key',
  },
  {
    title: '下发值',
    dataIndex: 'value',
  },
  {
    title: '触发方式',
    dataIndex: 'issueSrc',
    customRender: ({ record }) => {
      if (record.issueSrc === 'RULE_CHAIN') {
        return '规则触发';
      } else{
        return '人工触发';
      }
    }
  },
  {
    title: '下发状态',
    dataIndex: 'issueStatus',
    customRender: ({ record }) => {
      if (record.issueStatus === 'ISSUE_DONGING') {
        return '处理中';
      } else if(record.issueStatus === 'ISSUE_SUCCESS'){
        return '成功';
      } else if(record.issueStatus === 'ISSUE_FAILURE'){
        return '失败';
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '失败原因',
    dataIndex: 'reason',
  },
  {
    title: '操作者',
    dataIndex: 'creatorName',
  },
  {
    title: '下发时间',
    dataIndex: 'ts',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

export const issueAssetCommandColumn: BasicColumn[] = [
  {
    title: '指令id',
    dataIndex: 'id',
    defaultHidden: true,
  },
  {
    title: '设备名称',
    dataIndex: 'entityName',
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '指令编码',
    dataIndex: 'key',
  },
  {
    title: '下发值',
    dataIndex: 'value',
  },
  {
    title: '触发方式',
    dataIndex: 'issueSrc',
    customRender: ({ record }) => {
      if (record.issueSrc === 'RULE_CHAIN') {
        return '规则触发';
      } else{
        return '人工触发';
      }
    }
  },
  {
    title: '下发状态',
    dataIndex: 'issueStatus',
    customRender: ({ record }) => {
      if (record.issueStatus === 'ISSUE_DONGING') {
        return '处理中';
      } else if(record.issueStatus === 'ISSUE_SUCCESS'){
        return '成功';
      } else if(record.issueStatus === 'ISSUE_FAILURE'){
        return '失败';
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '失败原因',
    dataIndex: 'reason',
  },
  {
    title: '操作者',
    dataIndex: 'creatorName',
  },
  {
    title: '下发时间',
    dataIndex: 'ts',
    width:180,
    customRender: ({ record }) => {
      return moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]

export const addAdjustAttributeColumns: FormSchema[] = [
  {
    label: "选择下发的属性:",
    field: "adjustAttributes",
    component: 'Input',
    slot: "adjustAttributesSlot",
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
]

export const addCommandIssueFormItem: FormSchema[] = [
  {
    label: "选择下发的指令:",
    field: "issueCommandList",
    component: 'Input',
    slot: "issueCommandListSlot",
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
]
