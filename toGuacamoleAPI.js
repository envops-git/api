function testConnection(body) {
    return new Promise((resolve, reject) => {
        
        const fetch = require('node-fetch');
        
        fetch('http://ec2-54-87-66-8.compute-1.amazonaws.com:32002/api/tests/testConnection', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => resolve(json));
    });
}

module.exports = { testConnection };