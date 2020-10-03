const checkname = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function sendRequest(url, callback) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('load', event => {
        const result = JSON.parse(event.target.responseText);
        callback(result);
    });
    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Accept', 'application/vnd.github.cloak-preview');
    httpRequest.setRequestHeader('Authorization', 'Basic ZjBmZmVlOjIwMWM3ZGZmZTI1YzdmNmMwMjIzMzYwZWYxN2UwNzA2MmZhMDE3ODk=');
    httpRequest.send();
}

document.getElementById('username').addEventListener('input', event => {
    const username = event.target.value;
    if (!checkname.test(username)) return;

    const d = new Date();
    const today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);

    sendRequest('https://api.github.com/search/commits?q=author:' + username + '+author-date:' + today, handleResponse);

    function handleResponse(result) {
        if (result.total_count !== 0) {
            document.getElementById('output').innerHTML = 'yes';
        }
        else {
            document.getElementById('output').innerHTML = 'no';
        }
    }
});