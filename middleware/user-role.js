import { ADMIN_EMAILS } from "~/constants";

export default function ({ $auth }) {
  if ($auth.loggedIn) {
    $auth.setUser({...$auth.user, isAdmin: ADMIN_EMAILS.includes($auth.user.email)})
  }
}
