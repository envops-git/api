
const { URL } = require('url');
const fs = require('fs');


let rawdata = fs.readFileSync('connectionTemplate.json');

(async () => {
    let connectionJson = await JSON.parse(rawdata);

    connectionJson.name = 'test-0'
    connectionJson.protocol = 'rdp'
    connectionJson.parameters.hostname = 'chrome-pg'
    connectionJson.parameters.port = '3389'

    let jsonArr = [];


    for (let i = 0; i < 3; i++) {
        jsonArr[i] = { ...connectionJson }
        jsonArr[i].name = `test-${i}`
    }

    const res = await provisionConnections(jsonArr)
    console.log(res)
})()





function provisionConnections(jsonArr) {

    return new Promise((resolve, reject) => {
        (async () => {
            const getTokenBody = 'username=guacadmin&password=guacadmin'

            const fetch = require('node-fetch');

            const getTokenRes = await fetch('https://test.envops.com/guacamole/api/tokens', {
                method: 'POST',
                body: getTokenBody,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })

            const resJson = await getTokenRes.json()

            const token = resJson.authToken
            const dataSource = resJson.dataSource

            let resArr = []

            var url = new URL(`https://test.envops.com/guacamole/api/session/data/${dataSource}/connections`)

            url.search = `token=${token}`


            for (let i = 0; i < jsonArr.length; i++) {

                addConnectionBody = JSON.stringify(jsonArr[i])

                const addConnectionRes = await fetch(url, {
                    method: 'POST',
                    body: addConnectionBody,
                    headers: { 'Content-Type': 'application/json' }
                })
                resArr[i] = await addConnectionRes.json()
            }

            resolve(resArr)
        })()
    });
}


module.exports = { provisionConnections };

