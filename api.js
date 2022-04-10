const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const testing = require('./toTestingAPI');
const k8s = require('./toK8sAPI');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/testConnection', (req, res) => {

    console.log("POST to testConnection");

    const body = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    }

    testing.testGuacamoleConnection(body).then(result => {
        res.send(result);
    })
});

app.post('/api/k8s/namespace',(req,res) => {
    console.log("POST to k8s Create namespace");
    const name = req.body.name;
    k8s.createNamespace(name).then(namespace => {
        console.log("Created namespace");
        res.send(namespace);
    })
});

app.post('/api/k8s/provisionNamespace',(req,res) => {
    console.log("POST to k8s provisionNamespace");
    const name = req.body.name;
    k8s.provisionNamespace(name).then(response => {
        console.log("Provisioned namespace");
        res.send(response);
    })
});


app.listen(port, () => console.log(`api server listening on port ${port}!`));