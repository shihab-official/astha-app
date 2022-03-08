<template>
  <a-layout id="components-layout-top" class="layout" style="min-height: 100vh">
    <a-layout-header class="flex justify-center">
      <div class="container flex justify-between">
        <NuxtLink class="logo flex items-center" to="/">
          <NuxtLogo style="height: 35px" />
        </NuxtLink>
        <div v-if="$auth.loggedIn" class="flex" style="font-size: 90%;">
          <NuxtLink to="/log" class="block font-medium text-white hover:text-emerald-300">Log</NuxtLink>
          <NuxtLink to="/leave" class="block font-medium mx-6 text-white hover:text-emerald-300">Leave</NuxtLink>
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <a
              class="block font-medium ant-dropdown-link text-white hover:text-emerald-300"
              @click="(e) => e.preventDefault()"
            >
              <span class="hidden sm:inline mr-1">{{ user.short_name || user.given_name }}</span>
              <img
                class="w-10 h-10 rounded-full"
                :src="user.picture"
                :alt="user.name"
              />
            </a>
            <a-menu slot="overlay" style="text-align: right; min-width: 100px;">
              <a-menu-item key="p">
                <NuxtLink to="/profile"> Profile </NuxtLink>
              </a-menu-item>
              <a-menu-item key="u">
                <NuxtLink to="/users"> Users </NuxtLink>
              </a-menu-item>
              <a-menu-item style="padding:0;"><a-divider style="margin: 3px 0px 1px;" /></a-menu-item>
              <a-menu-item key="x"><span class="text-red-500" @click="logout()">Logout</span></a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="flex justify-center py-6">
      <div class="container flex-grow bg-white p-6" style="box-shadow: 0 0 10px rgb(0 0 0 / 5%);">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer class="flex justify-center" style="background-color: #e0e3e6;">
      <div class="container text-center">
        &copy; {{ copyrightYear }} Astha IT Ventures
      </div>
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
