const adminEmails = [
  'hasnaeen@asthait.com',
  // 's.bhuiyan@asthait.com'
];

export default function ({ $auth }) {
  if ($auth.loggedIn) {
    $auth.setUser({...$auth.user, isAdmin: adminEmails.includes($auth.user.email)})
  }
}
