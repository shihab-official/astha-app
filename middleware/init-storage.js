import { ADMIN_EMAILS } from '~/constants';

export default async function ({ $auth, $axios, redirect }) {
  if ($auth.loggedIn) {
    await $axios
      .post('/user/init-store', {
        name: $auth.user.name,
        short_name: $auth.user.given_name,
        email: $auth.user.email,
        user_id: $auth.user.email.replace('@asthait.com', ''),
        admin: ADMIN_EMAILS.includes($auth.user.email),
        manager: false,
        show_log: true,
        leaves_taken: 0
      })
      .then((res) => {
        $auth.setUser({ ...$auth.user, ...res.data.user });
        if (res.data.newUser) { // need to try using state
          return redirect(`/profile`);
        }
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
