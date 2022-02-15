<template>
  <a-layout id="components-layout-top" class="layout h-screen">
    <a-layout-header class="flex justify-between">
      <NuxtLink class="logo" to="/">
        <NuxtLogo style="width: 50px" />
      </NuxtLink>
      <a-menu
        v-if="$auth.loggedIn"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <NuxtLink to="/work-update">Daily Task Update</NuxtLink>
        </a-menu-item>
        <a-menu-item key="2">
          <NuxtLink to="/personal-leave">Personal Leave</NuxtLink>
        </a-menu-item>
        <a-menu-item key="x">
          <span @click="logout()">Logout</span>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 30px 50px" class="flex flex-col">
      <div class="flex-grow" :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center" :style="{backgroundColor:'#e0e4ea'}">
      &copy; {{ copyrightYear }}; Astha IT Ventures
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
    copyrightYear: () => {
      return new Date().getFullYear()
    },
  },
  methods: {
    logout() {
      this.$auth.logout('google').then(() => {this.$router.push('/login')})
    }
  }
}
</script>
