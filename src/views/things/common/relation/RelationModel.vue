<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modelTitle"
    @ok="handleSubmit"
    >

    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import {defineComponent,ref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from "/@/components/Form/index";
  import { modelFormSchema } from './relation.data';
  import { listAllEntities, entityRelationInfo } from '/@/api/things/relation/relationApi';
  import {EntityTypeEnum} from "/@/enums/entityEnum";

  export default defineComponent({
    components: { BasicModal, BasicForm, modelFormSchema },
    setup() {
      const parentEntityList = ref(Object as any); // 动态数据关联
      const entityChildrenList = ref(Object as any); // 动态数据关联
      const param = ref();
      const modelTitle = ref();
      const [ registerForm, { updateSchema, setFieldsValue,validate }] = useForm({
        labelWidth: 120,
        schemas: modelFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      const getTitle = (entityType: string) => {
        if(entityType === EntityTypeEnum.ASSET) return '资产';
        if(entityType === EntityTypeEnum.DEVICE) return '设备';
        return '实体';
      }

      const [register] = useModalInner(async (data) => {
        param.value = data;
        modelTitle.value = '编辑' + getTitle(data.entityType) + '关系';
        const entityInfo = await entityRelationInfo(data.entityId, data.entityType);
        await loadDropData(data.entityType);
        // 获取当前选中节点的关系数据
        await setFieldsValue({
          entityName: entityInfo.self.name,
          parentId: processEntityInfoRelation(entityInfo.froms),
          children: processEntityInfoRelation(entityInfo.tos),
        })
      });

      async function loadDropData(entityType: string, fuzzy?: any){
        let entities = await listAllEntities(entityType, !fuzzy ? "": fuzzy);
        if (!entities) {
          return;
        }
        parentEntityList.value = preProcessParentData(entities);
        entityChildrenList.value = preProcessChildrenData(entities);
        // 更新两个字段
        await updateSchema({
          field: 'parentId',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: parentEntityList,
            showSearch: true,
            filterOption: false,
            onSearch: updateParentDrop,
          },
        });
        await updateSchema({
          field: 'children',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: entityChildrenList,
            filterOption: false,
            mode: 'multiple',
            onSearch: updateChildrenDrop,
          },
        });
      }

      const updateParentDrop = (fuzzy?: any) => {
        listAllEntities(param.value.entityType, !fuzzy ? "": fuzzy).then((data) => {
          if (!data || data.length === 0) {
            return;
          }
          parentEntityList.value = preProcessParentData(data);
        });
      }

      const updateChildrenDrop = (fuzzy?: any) => {
        let entities = listAllEntities(param.value.entityType, !fuzzy ? "": fuzzy);
        if (!entities) {
          return;
        }
        entityChildrenList.value = preProcessChildrenData(entities);
      }

      // 提交保存
      async function handleSubmit(){
        const values = await validate();
        console.log('结果数据', values);
      }

      function preProcessParentData(entities){
        if(!entities){
          return ;
        }
        let options:Array<any> = new Array<any>();
        entities.forEach(item => options.push({
          key: item.id,
          label: item.name,
          value: item.id,
        }));
        return options;
      }

      function preProcessChildrenData(entities){
        if(!entities){
          return ;
        }
        let options:Array<any> = new Array<any>();
        entities.forEach(item => options.push({
          key: item.id,
          label: item.name,
          value: [item.id],
        }));
        return options;
      }

      function processEntityInfoRelation(relation){
        if(!relation){
          return ;
        }
        let options:Array<any> = new Array<any>();
        relation.forEach(item => options.push(item.id));
        return options;
      }

      return {
        registerForm,
        register,
        modelTitle,
        handleSubmit,
      }
    }
  });
</script>
