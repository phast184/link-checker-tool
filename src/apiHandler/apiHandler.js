const axios = require('axios');
const {checkURL} = require('../urlHelper/urlFunctions')
const telescopeCheck = (api) => {
    axios.get(api)
    .then(response => {
        console.log("CONNECT TO TELESCOPE SUCCESSFULLY!!!");
        console.log("====================================")

        for (i = 0; i < response.data.length; i++)
        {
            checkURL(api+`/${response.data[i].id}`);
        }
    })
    .catch(err => console.log("Cannot connect to local API, please double check to make sure the API is initiated!!!"))
}

module.exports = {telescopeCheck};