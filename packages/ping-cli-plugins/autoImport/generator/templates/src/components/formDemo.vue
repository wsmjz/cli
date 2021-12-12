<template>
  <div class="demo-box">
    <button @click="formValues.name = 'show'">click</button>
    <Form :model="formValues" :rules="rules" ref="antForm" @submit="onSubmit" @fail="onFail">
      <FormItem prop="name" label="姓名：">
        <Field v-model="formValues.name" />
      </FormItem>
      <FormItem prop="phone" label="手机：">
        <Field  v-model="formValues.phone" />
      </FormItem>
      <FormItem prop="password" label="密码：">
        <Field  v-model="formValues.password" />
      </FormItem>
      <button>submit</button>
    </Form>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from 'vue';
import {ErrorList, RuleItem} from "async-validator";
import {validFunc} from 'vue3-libs/src/components/Form/types';

export default defineComponent({
  name: 'FormDemo',

  setup() {
    const antForm = ref<{ validate: validFunc }>();
    const formValues = reactive({
      name: '',
      phone: '',
      password: ''
    });
    const validator = (rule: RuleItem, value: string): boolean => {
      return /^1\d{10}$/.test(value);
    }
    const rules = reactive({
      name: { required: true, message: '请填写姓名', trigger: 'blur' },
      phone: [
        { required: true, message: '请填写手机' },
        { validator, message: '格式不正确'  }
      ],
      password: [
        { required: true, message: '请填写密码' },
        { min: 6, message: '至少6位' }
      ]
    });

    const submit = (): void => {
      antForm.value?.validate((valid: any) => {
        console.log('valid', valid);
        if (valid === true) {
          console.log('ok');
        }
      });
    }

    const onSubmit = (value: object): void => {
      console.log('onSubmit', value);
    }
    const onFail = (errors: ErrorList): void => {
      console.log('onFail', errors);
    }
    return {
      formValues,
      rules,
      antForm,
      submit,
      onSubmit,
      onFail
    }
  }
});
</script>
