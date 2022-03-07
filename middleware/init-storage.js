import { ADMIN_EMAILS } from '~/constants';

export default async function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    await $axios
      .post(`/api/init-storage`, {
        name: $auth.user.name,
        short_name: $auth.user.given_name,
        email: $auth.user.email,
        id: $auth.user.email.replace('@asthait.com', ''),
        admin: ADMIN_EMAILS.includes($auth.user.email),
        manager: false,
        show_log: true,
      })
      .then((res) => {
        $auth.setUser({ ...$auth.user, ...res.data });
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
