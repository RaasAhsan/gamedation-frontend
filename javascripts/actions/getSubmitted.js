
var axios = require('axios');

var getSubmitted = (dispatcher) => {
  dispatcher.dispatch('start-loading');
  axios.get('http://localhost:8000/api/games/submissions', {headers: {'Authorization': localStorage.getItem("token")}})
       .then((response) => {
          dispatcher.dispatch('stop-loading');
          dispatcher.dispatch('get-submissions', response.data)
       })
       .then((error) => {
          if(error) console.error(error);
       })
}

module.exports = getSubmitted;
