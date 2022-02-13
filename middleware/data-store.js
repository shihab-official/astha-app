export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    $axios.post(`/data-store`, {email: $auth.user.email})
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
