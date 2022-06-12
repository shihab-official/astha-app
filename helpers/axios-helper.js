const axiosHelper = function (context) {
  context.$axios.onRequest((config) => {
    if (config.url.startsWith('user') || config.url.startsWith('log') || config.url.startsWith('holiday') || config.url.startsWith('leave')) {
      context.$axios.setHeader('Current-User-Email', context.$auth.$state.user.email);
      context.$axios.setHeader('Current-User-Name', context.$auth.$state.user.name);
    }
  });
  context.$axios.onError((error) => {
    console.error('$axios.onError', error.response.data);
    context.redirect('/login');
  });
}

export default axiosHelper;
