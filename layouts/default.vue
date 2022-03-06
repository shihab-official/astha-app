<template>
  <a-layout id="components-layout-top" class="layout" style="min-height: 100vh">
    <a-layout-header class="flex justify-between">
      <NuxtLink class="logo flex items-center" to="/">
        <NuxtLogo style="height: 35px" />
      </NuxtLink>
      <div v-if="$auth.loggedIn" class="flex">
        <NuxtLink to="/log" class="block text-white hover:text-orange-400">Log</NuxtLink>
        <NuxtLink to="/leave" class="block mx-6 text-white hover:text-orange-400">Leave</NuxtLink>
        <a-dropdown :trigger="['click']">
          <a
            class="block ant-dropdown-link text-white hover:text-orange-400"
            @click="(e) => e.preventDefault()"
          >
            {{ user.short_name || user.given_name }}
            <img
              class="w-10 h-10 rounded-full ml-1"
              :src="user.picture"
              :alt="user.name"
            />
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="p">
              <NuxtLink to="/profile"> Profile </NuxtLink>
            </a-menu-item>
            <a-menu-item key="u">
              <NuxtLink to="/users"> Users </NuxtLink>
            </a-menu-item>
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

<style scoped>
.ant-dropdown-menu-item a {
  color: rgba(0, 0, 0, 0.65);
}
</style>

<script>
export default {
  computed: {
    user: function () {
      return this.$auth.user;
    },
    copyrightYear: function () {
      return new Date().getFullYear();
    },
  },
  methods: {
    logout() {
      this.$auth.logout('google').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>
