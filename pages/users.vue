<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Users</h3>
      <div class="flex">
        <a-input
          @change="search"
          @keyup="search"
          placeholder="Search"
          :allowClear="true"
        />
        <template v-if="$auth.user.admin">
          <span
            @click="showModal()"
            class="text-sm whitespace-nowrap py-1 px-3 ml-3 bg-slate-600 text-white hover:bg-slate-700 hover:text-white rounded cursor-pointer"
            >Create User</span
          >
          <a-modal
            v-model="modalVisible"
            title="Prepare user storage"
            :width="350"
            footer
          >
            <a-form
              :layout="formLayout"
              :form="form"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 19 }"
              @submit="submit"
            >
              <a-form-item label="Name">
                <a-input
                  v-decorator="[
                    'newUser.name',
                    {
                      rules: [
                        { required: true, message: 'Please provide name.' },
                      ],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item label="Email">
                <a-input
                  v-decorator="[
                    'newUser.email',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please provide email.',
                        },
                      ],
                    },
                  ]"
                  addon-after="@asthait.com"
                />
              </a-form-item>
              <a-form-item
                :wrapper-col="{ span: 19, offset: 5 }"
                style="margin-bottom: 0"
              >
                <a-button type="primary" html-type="submit"> Submit </a-button>
              </a-form-item>
            </a-form>
          </a-modal>
        </template>
      </div>
    </div>
    <hr />
    <div class="table-wrapper" v-if="users && users.length > 0">
      <table>
        <thead>
          <tr>
            <th class="sticky left-0 bg-orange-100">Name</th>
            <th>Full Name</th>
            <th class="w-1">Date of Birth</th>
            <th class="w-28">Mobile</th>
            <th class="w-72">Email</th>
            <template v-if="$auth.user.admin">
              <th class="w-1">Show Log</th>
              <th class="w-1">Manager</th>
              <th class="w-1">Admin</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user of users"
            :key="user.user_name"
            :class="{
              relative: true,
              self: user.user_name === $auth.user.user_name,
            }"
          >
            <td class="sticky left-0 bg-orange-50">
              <NuxtLink
                v-if="$auth.user.admin"
                v-highlight="key"
                :to="`/profile${
                  user.user_name === $auth.user.user_name ? '' : `/${user.user_name}`
                }`"
                >{{ user.short_name }}</NuxtLink
              >
              <template v-else>{{ user.short_name }}</template>
            </td>
            <td v-highlight="key">{{ user.name }}</td>
            <td v-highlight="key" class="text-center">{{ user.dob }}</td>
            <td v-highlight="key">{{ user.mobile }}</td>
            <td v-highlight="key">{{ user.email }}</td>
            <template v-if="$auth.user.admin">
              <td
                class="text-center"
                :class="user.show_log ? 'text-green-500' : 'text-red-500'"
              >
                <a-icon v-if="user.show_log" type="check" />
                <a-icon v-else type="close" />
              </td>
              <td
                class="text-center"
                :class="user.manager ? 'text-green-500' : 'text-red-500'"
              >
                <a-icon v-if="user.manager" type="check" />
                <a-icon v-else type="close" />
              </td>
              <td
                class="text-center"
                :class="user.admin ? 'text-green-500' : 'text-red-500'"
              >
                <a-icon v-if="user.admin" type="check" />
                <a-icon v-else type="close" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <a-empty v-else />
  </div>
</template>

<style scoped>
td {
  white-space: normal;
}
td.sticky {
  width: 120px;
  min-width: 120px;
}
tr.self:after {
  background-color: rgb(0 220 130 / 6%);
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserList',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      newUser: {
        name: '',
        email: '',
      },
      modalVisible: false,
      key: '',
    };
  },
  mounted: function () {
    document.title = 'Users';
  },
  computed: {
    ...mapGetters('user', ['users']),
  },
  watch: {
    key: function (newKey, oldKey) {
      this.findUsers(newKey);
    },
  },
  beforeDestroy() {
    this.findUsers();
  },
  methods: {
    ...mapActions('user', ['findUsers']),
    search(e) {
      this.key = e.target.value;
    },
    showModal() {
      this.modalVisible = true;
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios
            .post('/user/create', {
              name: values.newUser.name,
              short_name: values.newUser.name,
              email: values.newUser.email + '@asthait.com',
              user_name: values.newUser.email,
              admin: false,
              manager: false,
              show_log: true,
            })
            .then((res) => {
              this.modalVisible = false;
              this.form.resetFields();
              if (this.$route.path === '/') {
                this.$router.go();
              } else {
                this.$router.push('/');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
  directives: {
    highlight: {
      componentUpdated: (el, { value }) => {
        const regex = new RegExp(value, 'gi');
        const response = el.innerText.replace(regex, function (str) {
          return !str ? str : `<span class="search-highlight">${str}</span>`;
        });
        el.innerHTML = response;
      },
    },
  },
};
</script>
