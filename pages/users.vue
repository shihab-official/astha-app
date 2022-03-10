<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Users</h3>
      <div class="flex">
        <a-input @change="search" @keyup="search" :allowClear="true" />
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
    <div class="table-wrapper" ref="tableWrapper" v-if="users.length > 0">
      <table>
        <thead>
          <tr>
            <th class="sticky left-0 bg-orange-100">Name</th>
            <th>Full Name</th>
            <th class="w-1">Date of Birth</th>
            <th class="w-1">Mobile</th>
            <th>Email</th>
            <template v-if="$auth.user.admin">
              <th class="w-1">Show Log</th>
              <th class="w-1">Manager</th>
              <th class="w-1">Admin</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{relative: true, self: user.id === $auth.user.id}">
            <td class="sticky left-0 bg-orange-50">
              <NuxtLink
                v-if="$auth.user.admin"
                :to="`/profile${user.id === $auth.user.id ? '' : `/${user.id}`}`"
                >{{ user.short_name }}</NuxtLink
              >
              <template v-else>{{ user.short_name }}</template>
            </td>
            <td>{{ user.name }}</td>
            <td class="text-center">{{ user.dob }}</td>
            <td style="width: 110px;">{{ user.mobile }}</td>
            <td>{{ user.email }}</td>
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
table {
  font-size: 0.9rem;
}
th {
  font-size: 84%;
}
th.sticky {
  box-shadow: 0 -25px 8px #ddd, 0 10px 8px #ddd;
}
td {
  white-space: normal;
}
td.sticky {
  width: 120px;
  min-width: 120px;
  padding: 6px 10px;
  box-shadow: 0 10px 8px #ddd;
}
tr.self:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(0 220 130 / 10%);
    z-index: 1;
    pointer-events: none;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'user-list',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      newUser: {
        name: '',
        email: '',
      },
      modalVisible: false,
      key: ''
    };
  },
  computed: {
    ...mapGetters('user', ['users']),
  },
  watch: {
    key: function(newKey, oldKey) {
      this.getUser(newKey);
    }
  },
  methods: {
    ...mapActions('user', ['getUser']),
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
            .post('/api/create-user', {
              name: values.newUser.name,
              short_name: values.newUser.name,
              email: values.newUser.email,
              id: values.newUser.email.replace('@asthait.com', ''),
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
};
</script>
