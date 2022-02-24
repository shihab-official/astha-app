const axiosHelper = function (context) {
  context.$axios.onRequest((config) => {
    if (config.url.startsWith('/api/')) {
      context.$axios.setHeader('Current-User-Email', context.$auth.$state.user.email);
      context.$axios.setHeader('Current-User-Name', context.$auth.$state.user.name);
    }
  });
}

export default axiosHelper;