function testConnection(body) {
    return new Promise((resolve, reject) => {
        
        const fetch = require('node-fetch');
        
        fetch('http://10.100.222.226:3000/api/tests/testConnection', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(json => resolve(json));
    });
}

module.exports = { testConnection };