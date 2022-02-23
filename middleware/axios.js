export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    $axios.setHeader('Current-User-Email', $auth.$state.user.email);
  }
}
