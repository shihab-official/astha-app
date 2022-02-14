<template>
  <div>
    <h1>Log update</h1>
    <a-form>
      <a-form-item label="Date">
        <a-date-picker @change="onChange" :value="date" :format="dateFormat" />
      </a-form-item>
      <a-form-item label="Log">
        <a-textarea placeholder="Update log" :rows="4" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Log-Work-Update',
  data() {
    return {
      dateFormat: 'DD-MMM-YYYY',
      date: null,
      log: ''
    }
  },
  mounted: () => {
    document.title = 'Log Work Update';
  },
  methods: {
    onChange: function (m) {
      this.date = m;
      console.log(this.date?.format('DD-MMM-YYYY'));
    }
  }
};
</script>
