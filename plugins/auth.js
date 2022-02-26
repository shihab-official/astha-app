export default function (context) {
  // console.log('plugins', context);
  context.$auth.onRedirect((to, from) => {
    // console.clear();
    // console.log(context.$auth);
    console.info('$auth.onRedirect', to, from);
    // you can optionally change `to` by returning a new value
  });
  context.$auth.onError((error, name, endpoint) => {
    console.error('$auth.onError', name, error);
  });
}
