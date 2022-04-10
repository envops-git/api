const spo = require('./toSharepointAPI');

function loadAPI(apiType) {
    const k8s = require('@kubernetes/client-node');
    const kc = new k8s.KubeConfig();
    kc.loadFromCluster();
    if (apiType == 'Core') {
        const k8sapi = kc.makeApiClient(k8s.CoreV1Api);
        return k8sapi;
    }
    if (apiType == 'App') {
        const k8sapi = kc.makeApiClient(k8s.AppsV1Api);
        return k8sapi;
    }
};

function createNamespace(name) {
    return new Promise(function (resolve, reject) {
        const k8sApi = loadAPI('Core');
        const namespace = {
            metadata: {
                name: name
            }
        };

        k8sApi.createNamespace(namespace).then(
            response => {
                resolve(response.body);
            },
            err => {
                console.log('Error!: ' + err);
                resolve(err);
            },
        );
    });
};

function provisionNamespace(namespace) {
    return new Promise(function (resolve, reject) {
        const k8sApiCore = loadAPI('Core');
        const k8sApiApp = loadAPI('App');

        var responseJson = {};

        spo.getProvisionJsons()
            .then(k8s_jsons => {
                const deployJsons = async () => {
                    for (let i = 0; i < k8s_jsons.length; i++) {
                        if (k8s_jsons[i].kind == 'Deployment') {
                            result = await deployDeployment(namespace, k8s_jsons[i]);
                            let key = k8s_jsons[i].metadata.name + "-Deployment";
                            if (result) {
                                console.log("deployed: " + key);
                                responseJson[key] = "Success";
                            } else {
                                console.log("failed deploy: " + key);
                                responseJson[key] = "Failed";
                            }
                        }
                        if (k8s_jsons[i].kind == 'Service') {
                            result = await deployService(namespace, k8s_jsons[i]);
                            let key = k8s_jsons[i].metadata.name + "-Service";
                            if (result) {
                                console.log("deployed: " + key);
                                responseJson[key] = "Success";
                            } else {
                                console.log("failed deploy: " + key);
                                responseJson[key] = "Failed";
                            }
                        }
                        if (i == (k8s_jsons.length - 1)) {
                            console.log(responseJson);
                            resolve(responseJson);
                        }
                    }
                }
                deployJsons();
            });

        function deployService(namespace, ServiceJson) {
            return new Promise((resolve, reject) => {
                k8sApiCore.createNamespacedService(namespace, ServiceJson)
                    .then(() => {
                        resolve(true);
                    }, (err) => {
                        console.log(err);
                        resolve(false)
                    })
            });
        }

        function deployDeployment(namespace, ServiceJson) {
            return new Promise((resolve, reject) => {
                k8sApiApp.createNamespacedDeployment(namespace, ServiceJson)
                    .then(() => {
                        resolve(true);
                    }, (err) => {
                        console.log(err);
                        resolve(false)
                    })
            });
        }
    });
}

module.exports = { createNamespace, provisionNamespace };