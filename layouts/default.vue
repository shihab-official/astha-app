<template>
  <a-layout id="components-layout-top" class="layout" style="min-height: 100vh">
    <a-layout-header class="flex justify-center">
      <div class="container flex justify-between">
        <NuxtLink class="logo flex items-center" to="/">
          <NuxtLogo style="height: 35px" />
        </NuxtLink>
        <div v-if="$auth.loggedIn" class="flex" style="font-size: 90%">
          <NuxtLink
            to="/log"
            class="block font-medium mr-6 text-white hover:text-emerald-300"
            >Log</NuxtLink
          >
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <a
              class="block font-medium ant-dropdown-link text-white hover:text-emerald-300"
              @click="(e) => e.preventDefault()"
            >
              <span class="hidden sm:inline mr-1">{{
                user.short_name || user.given_name
              }}</span>
              <img
                class="w-10 h-10 rounded-full"
                :src="user.picture"
                :alt="user.name"
              />
            </a>
            <a-menu slot="overlay" style="text-align: right; min-width: 100px">
              <a-menu-item key="p">
                <NuxtLink to="/profile"> Profile </NuxtLink>
              </a-menu-item>
              <a-menu-item key="l">
                <NuxtLink to="/logs"> Logs </NuxtLink>
              </a-menu-item>
              <a-menu-item key="u">
                <NuxtLink to="/users"> Users </NuxtLink>
              </a-menu-item>
              <a-menu-item key="h" v-if="user.admin || user.manager">
                <NuxtLink to="/holidays"> Holidays </NuxtLink>
              </a-menu-item>
              <a-menu-item style="padding: 0"
                ><a-divider style="margin: 3px 0px 1px"
              /></a-menu-item>
              <a-menu-item key="x"
                ><span class="text-red-500" @click="logout()"
                  >Logout</span
                ></a-menu-item
              >
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="flex justify-center py-6">
      <div
        class="container flex-grow bg-white p-6"
        style="box-shadow: 0 0 10px rgb(0 0 0 / 5%)"
      >
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer
      class="flex justify-center"
      style="background-color: #e0e3e6"
    >
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
import moment from 'moment';
import { getDatesInRange } from '~/server-middleware/utilities/date';
import { mapActions } from 'vuex';

export default {
  name: 'default-layout',
  data() {
    return {
      dateFormat: 'DD-MMM-YYYY',
      dateRange: [moment().startOf('week'), moment().endOf('week')],
    };
  },
  computed: {
    user: function () {
      return this.$auth.user || null;
    },
    copyrightYear: function () {
      return new Date().getFullYear();
    },
  },
  created() {
    if (this.$auth.loggedIn) {
      this.getHolidays();
      this.getLeaveInfo();
      this.getUsers();
      this.getLeaveCount();
      if (this.$auth.user.admin) {
        this.getLogsByDate(this.dateRange);
      }
    }
  },
  methods: {
    ...mapActions('calendar', ['getHolidays', 'getLeaveInfo']),
    ...mapActions('user', ['getLogsByDate', 'getUsers']),
    getLeaveCount() {
      console.log('getting leave count.');
      this.$axios
        .get('/log/leave-count', {
          params: {
            user: this.$auth.user.user_name,
          },
        })
        .then((res) => {
          this.$auth.setUser({ ...this.user, leaves_taken: res.data });
        })
        .catch((error) => {
          console.error(error);
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
