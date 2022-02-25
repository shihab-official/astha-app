<template>
  <a-layout id="components-layout-top" class="layout h-screen">
    <a-layout-header class="flex justify-between">
      <NuxtLink class="logo" to="/">
        <NuxtLogo style="width: 50px" />
      </NuxtLink>
      <div v-if="$auth.loggedIn">
        <span class="text-white hover:text-orange-400 mr-5 cursor-pointer" @click="showModal">
          Create User
        </span>
        <a-modal v-model="modalVisible" title="Prepare user storage" :width="350" footer>
          <a-form :layout="formLayout" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" @submit="submit">
            <a-form-item label="Name">
              <a-input v-decorator="['newUser.name', { rules: [{ required: true, message: 'Please provide name.' }] }]" />
            </a-form-item>
            <a-form-item label="Email">
              <a-input v-decorator="['newUser.email', { rules: [{ required: true, message: 'Please provide email.' }] }]" addon-after="@asthait.com" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 19, offset: 5 }" style="margin-bottom:0;">
              <a-button type="primary" html-type="submit">
                Submit
              </a-button>
            </a-form-item>
          </a-form>
        </a-modal>

        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link text-white hover:text-orange-400" @click="(e) => e.preventDefault()">
            {{user.given_name}}
            <img class="w-10 h-10 rounded-full ml-1" :src="user.picture" :alt="user.name">
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="x"><span @click="logout()">Logout</span></a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 30px 50px" class="flex flex-col">
      <div
        class="flex-grow"
        :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
      >
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer
      style="text-align: center"
      :style="{ backgroundColor: '#e0e4ea' }"
    >
      &copy; {{ copyrightYear }} Astha IT Ventures
    </a-layout-footer>
  </a-layout>
</template>
<style>
#components-layout-top .logo {
  height: 31px;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>

<script>
export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      newUser: {
        name: '',
        email: ''
      },
      modalVisible: false
    }
  },
  computed: {
    user: function() {
      return this.$auth.user;
    },
    copyrightYear: function() {
      return new Date().getFullYear();
    },
  },
  methods: {
    showModal() {
      this.modalVisible = true;
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios.post(`/api/init-storage`, {
            name: values.newUser.name,
            email: `${values.newUser.email}@asthait.com`,
            admin: false,
          }).then((res) => {
            this.modalVisible = false;
            this.form.resetFields();
            if (this.$route.path === '/') {
              this.$router.go();
            } else {
              this.$router.push('/');
            }
          }).catch((error) => {
            console.error(error);
          });
        }
      });
    },
    logout() {
      this.$auth.logout('google').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>
