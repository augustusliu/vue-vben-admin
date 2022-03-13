<template>
  <div class="h-full">
    <CodeMirrorEditor
      :value="getValue"
      @change="handleValueChange"
      :mode="mode"
      :readonly="readonly"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { isString } from '/@/utils/is';

  const MODE = {
    JSON: 'application/json',
    html: 'htmlmixed',
    js: 'javascript',
  };

  const props = {
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: { type: String, default: MODE.JSON },
    readonly: { type: Boolean, default: false },
  };

  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor },
    props,
    emits: ['change', 'update:value'],
    setup(props, {emit}) {
      console.log('editor mode', props.mode, props.value);
      const getValue = computed(() => {
        const { value } = props;
        if (props.mode != MODE.JSON) {
          return value as string;
        }
        return (value && isString(value))
          ? JSON.stringify(JSON.parse(value))
          : JSON.stringify(value);
      });

      function handleValueChange(v) {
        emit('update:value', v);
        emit('change', v);
      }

      return { handleValueChange, getValue };
    },
  });
</script>
