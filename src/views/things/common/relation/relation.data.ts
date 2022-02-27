import { FormSchema }  from '/@/components/Table';

// 用于维护关系的组件
export const modelFormSchema: FormSchema[] = [

  {
    field: 'entityName',
    component: 'Input',
    label: '名称',
    colProps: {span: 20,},
    componentProps: {
      disabled: true,
    },
  },

  {
    field: 'parentId',
    component: 'Select',
    label: '归属于',
    colProps: {span: 20,},
    componentProps: {
      placeholder: '请选择',
    },
  },

  {
    field: 'children',
    component: 'Select',
    label: '包含',
    colProps: {span: 20,},
    componentProps: {
      placeholder: '请选择',
    },
  },
];
