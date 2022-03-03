export default function (context) {
  // console.log('plugins', context);
  context.$auth?.$storage.watchState('loggedIn', newValue => {
    console.log('loggedIn', newValue);
  })

  context.$auth?.onRedirect((to, from) => {
    console.info('$auth.onRedirect', to, from);
    // you can optionally change `to` by returning a new value
  });

  context.$auth?.onError((error, name, endpoint) => {
    console.error('$auth.onError', name, error);
  });
}
