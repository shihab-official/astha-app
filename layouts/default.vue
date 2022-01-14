<template>
  <a-layout id="components-layout-top" class="layout">
    <a-layout-header type="flex">
      <NuxtLink class="logo" to="/">
        <NuxtLogo style="width: 50px" />
      </NuxtLink>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <NuxtLink to="./daily-update">Daily Task Update</NuxtLink>
        </a-menu-item>
        <a-menu-item key="2">
          <NuxtLink to="./personal-leave">Personal Leave</NuxtLink>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
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

<script lang="ts">
export default {
  computed: {
    copyrightYear: () => {
        // return new Date().getFullYear()
      return new Date().getFullYear()
    },
  },
}
</script>
