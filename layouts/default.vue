<template>
  <a-layout id="components-layout-top" class="layout h-screen">
    <a-layout-header class="flex justify-between">
      <NuxtLink class="logo" to="/">
        <NuxtLogo style="width: 50px" />
      </NuxtLink>
      <a-dropdown v-if="$auth.loggedIn" :trigger="['click']">
        <a class="ant-dropdown-link text-white hover:text-orange-400" @click="(e) => e.preventDefault()">
          {{user.given_name}}
          <img class="w-10 h-10 rounded-full ml-1" :src="user.picture" :alt="user.name">
        </a>
        <a-menu slot="overlay">
          <!-- <a-menu-item key="0">
            <a href="http://www.alipay.com/">1st menu item</a>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="http://www.taobao.com/">2nd menu item</a>
          </a-menu-item>
          <a-menu-divider /> -->
          <a-menu-item key="x"><span @click="logout">Logout</span></a-menu-item>
        </a-menu>
      </a-dropdown>
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
  computed: {
    user: function() {
      return this.$auth.user;
    },
    copyrightYear: function() {
      return new Date().getFullYear();
    },
  },
  methods: {
    logout: function() {
      this.$auth.logout('google').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>
