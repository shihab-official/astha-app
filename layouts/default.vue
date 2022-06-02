<template>
  <a-layout id="components-layout-top" class="layout" style="min-height: 100vh">
    <a-layout-header class="flex justify-center">
      <div class="container flex justify-between">
        <NuxtLink class="logo flex items-center" to="/">
          <NuxtLogo style="height: 35px" />
        </NuxtLink>
        <div v-if="$auth.loggedIn" class="flex" style="font-size: 90%">
          <NuxtLink
            v-if="$auth.user.show_log"
            to="/log"
            class="block font-medium mr-6 text-white hover:text-emerald-300"
            >Log</NuxtLink
          >
          <NuxtLink
            v-if="$auth.user.admin || $auth.user.manager"
            to="/time-log"
            class="block font-medium mr-6 text-white hover:text-emerald-300"
            >Time Log</NuxtLink
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
              <template v-if="user.admin || user.manager">
                <a-menu-item key="h">
                  <NuxtLink to="/holidays"> Holidays </NuxtLink>
                </a-menu-item>
                <!-- <a-menu-item key="e">
                  <NuxtLink to="/export"> Export </NuxtLink>
                </a-menu-item> -->
              </template>
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
        &copy; {{ year }} Astha IT Ventures
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
import { mapActions } from 'vuex';

export default {
  name: 'default-layout',
  data() {
    return {
      dateFormat: 'DD-MMM-YYYY',
      dateRange: [moment().startOf('week'), moment().endOf('week')],
      time: new Date(),
    };
  },
  computed: {
    notificationTime: function () {
      const t = new Date();
      t.setHours(17);
      t.setMinutes(0);
      t.setSeconds(0);
      return t;
    },
    user: function () {
      return this.$auth.user || null;
    },
    year: function () {
      return new Date().getFullYear();
    },
  },
  created() {
    if (this.$auth.loggedIn) {
      this.startTimer();
      this.getHolidays();
      this.getLeaveInfo();
      this.getUsers();
      if (this.$auth.user.admin) {
        this.getLogsByDate(this.dateRange);
      }
    }
  },
  methods: {
    ...mapActions('calendar', ['getHolidays', 'getLeaveInfo']),
    ...mapActions('user', ['getLogsByDate', 'getUsers']),

    startTimer() {
      let t = setInterval(() => {
        if (new Date() > this.notificationTime) {
          this.notify();
          clearInterval(t);
        }
      }, 300000);
    },

    notify() {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        this.createNotification();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            this.createNotification();
          }
        });
      }
      // At last, if the user has denied notifications, and you
      // want to be respectful there is no need to bother them anymore.
    },

    createNotification() {
      const notification = new Notification('Astha App', {
        body: 'Please post work log of the day.',
      });

      notification.addEventListener('click', () => {
        window.focus();
        window.location = '/log';
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
