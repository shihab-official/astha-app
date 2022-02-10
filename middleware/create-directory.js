export default function ({ $auth, $axios }) {
  if ($auth.loggedIn) {
    $axios.post(`/create-directory`, {email: $auth.user.email})
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
