<script>
export default {
  name: 'Logout',
  middleware({ redirect, $auth }) {
    $auth.logout('google').then(() => {
      redirect('/login');
    });
  },
};
</script>
