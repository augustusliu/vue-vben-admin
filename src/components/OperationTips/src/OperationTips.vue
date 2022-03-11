<template>
  <Divider orientation="left" style="font-size: 13px; color: #a8a8a8  ">{{header}}</Divider>
  <List
    size="small"
    itemLayout="vertical"
    v-for="item in items"
  >
    <List.Item style="color: #8b949e; font-size: 12px; margin-left: 15px;font-style: italic;">{{item}}</List.Item>
  </List>
</template>

<script lang="ts">

  import { List, Divider } from 'ant-design-vue';
  import { defineComponent, ref } from "vue";

  const props = {
    dataSource: { type: Array,  default: [] },
    header: { type:String , default: '操作提示:'}
  }

  export default defineComponent({
    name: 'OperationTips',
    components: { List,Divider },
    props,
    setup(props){
      const items = ref([]);
      const header = ref();

      items.value = props.dataSource;
      header.value = props.header;

      return { items, header };
    }
  })
</script>
