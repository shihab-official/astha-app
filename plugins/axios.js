export default function ({ $auth, $axios, redirect }) {
  $axios.onRequest(config => {
    // config.headers.Authorization = 'CancelToken';
  });

  // $axios.onResponse(response => {
  //   console.log('$axios.onResponse', response.status);
  // });

  $axios.onError(error => {
    console.log('$axios.onError');
    if(error.response.status === 403) {
      $auth.logout('google').then(() => {
        $axios.CancelToken();
        redirect('/login');
      });
    }
  });

  // $axios.onRequestError(err => {
  //   console.log('$axios.onRequestError', err);
  // });

  // $axios.onResponseError(err => {
  //   console.log('$axios.onResponseError', err);
  // });
}