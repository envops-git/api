const spauth = require('node-sp-auth');
const fetch = require('node-fetch');

function getProvisionJsons() {
    return new Promise(function (resolve, reject) {
        let k8s_jsons = [];

        const url = "https://envops.sharepoint.com/sites/biran_test/";

        spauth.getAuth(url, {
            username: "biran@envops.com",
            password: "Zxascqwed1",
            online: true
        }).then(options => {
            let headers = options.headers;
            headers['Accept'] = 'application/json;odata=verbose';

            fetch(url + "_api/web/GetFolderByServerRelativeUrl('/sites/biran_test/k8s_yamls')/files", {
                method: 'GET',
                headers: headers,
            })
                .then(response => response.json())
                .then(data => {
                    results = data.d.results;
                    const getJsons = async () => {
                        for (let i = 0; i < results.length; i++) {
                            const relativeUrl = results[i].ServerRelativeUrl;
                            const response = await fetch(url + `_api/web/getfilebyserverrelativeurl('${relativeUrl}')/$value`, {
                                method: 'GET',
                                headers: headers,
                            })
                            json = await response.json();
                            k8s_jsons.push(json);
                            if (i == (results.length - 1)) {
                                resolve(k8s_jsons);
                            }

                        }
                    }
                    getJsons();
                })
        });
    });
}

module.exports = { getProvisionJsons };