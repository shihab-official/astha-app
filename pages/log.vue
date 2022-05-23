<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">Log Update</h3>
      <NuxtLink to="/logs" class="ml-5 text-gray-400 text-sm">
        <a-icon type="double-left" class="text-xs" /> Back to Logs
      </NuxtLink>
    </div>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <a-form-item label="Date">
        <a-date-picker
          :format="dateFormat"
          :disabled-date="disabledDate"
          v-decorator="[
            'log.date',
            {
              initialValue: log.date,
              rules: [{ required: true, message: 'Please select date.' }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="Log">
        <ckeditor
          :config="editorConfig"
          @input="onEditorInput"
          ref="ckeditor"
          v-decorator="[
            'log.detail',
            {
              initialValue: log.detail,
              rules: [
                { required: true, message: 'Please provide task update.' },
              ],
            },
          ]"
        >
        </ckeditor>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment';
// import { VueEditor } from 'vue2-editor';

export default {
  name: 'LogWorkUpdate',
  data() {
    return {
      formLayout: 'vertical',
      form: this.$form.createForm(this),
      dateFormat: 'DD-MMM-YYYY',
      log: {
        date: moment(new Date()),
        detail: '',
      },
      editorConfig: {
        toolbar: [
          ['Undo', 'Redo'],
          ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'],
          ['NumberedList', 'BulletedList', '-', 'Indent', 'Outdent', '-', 'Blockquote'],
          ['Link', 'Unlink'],
        ],
      },
    };
  },
  mounted: () => {
    document.title = 'Log Work Update';
  },
  methods: {
    disabledDate(current) {
      return current > moment().endOf('day');
    },
    onEditorInput() {
      this.form.setFieldsValue({
        log: { detail: this.$refs.ckeditor.instance.getData() },
      });
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, { log }) => {
        if (!err) {
          this.$axios
            .post('/log/post', {
              user_id: this.$auth.user._id,
              user_name: this.$auth.user.user_name,
              name: this.$auth.user.short_name,
              date: log.date.startOf('day'),
              work: { detail: log.detail },
            })
            .then((res) => {
              if (res.status == 201) {
                this.$router.push(`/logs/${this.$auth.user.user_name}`);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
};
</script>
