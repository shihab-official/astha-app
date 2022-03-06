import { ADMIN_EMAILS } from "~/constants";

export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    // $auth.setUser({...$auth.user);
    $axios
      .post(`/api/init-storage`, {
        name: $auth.user.name,
        short_name: $auth.user.given_name,
        email: $auth.user.email,
        admin: ADMIN_EMAILS.includes($auth.user.email),
        manager: false,
      })
      .then((res) => {
        $auth.setUser({...$auth.user, admin: res.data.admin, manager: res.data.manager});
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
