import { ADMIN_EMAILS } from "~/constants";

export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    // $auth.setUser({...$auth.user);
    $axios
      .post(`/api/init-storage`, {
        name: $auth.user.name,
        email: $auth.user.email,
        admin: ADMIN_EMAILS.includes($auth.user.email),
      })
      .then((res) => {
        $auth.setUser({...$auth.user, admin: res.data.admin});
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
