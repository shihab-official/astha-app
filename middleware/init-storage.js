export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    $axios
      .post(`/api/init-storage`, {
        name: $auth.user.name,
        email: $auth.user.email,
        admin: $auth.user.isAdmin,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}