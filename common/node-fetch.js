exports.ExecuteFetch =  (url, options) =>{
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    // console.log(url, options);
    return fetch(url, options).then((apiResponse) => {
      // console.log(apiResponse);/
      const bodyreturn = {
        ok: apiResponse.ok,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headersObject: apiResponse.headers.raw(),
      };
      return apiResponse.json().then((body) => {
        bodyreturn.body = body;
        return bodyreturn;
      });
    });
  }
