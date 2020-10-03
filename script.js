const checkname = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function sendRequest(url, callback) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('load', event => {
        const result = JSON.parse(event.target.responseText);
        callback(result);
    });
    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Authorization', 'Basic ZjBmZmVlOjIwMWM3ZGZmZTI1YzdmNmMwMjIzMzYwZWYxN2UwNzA2MmZhMDE3ODk=');
    httpRequest.send();
}

document.getElementById('username').addEventListener('input', event => {
    const username = event.target.value;
    if (!checkname.test(username)) return;

    let userid;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let commits = [];

    function handleUserResponse(result) {
        userid = result.id;
        sendRequest('https://api.github.com/users/' + result.login + '/events', handleEventsResponse);
    }

    function handleEventsResponse(result) {
        result.forEach(element => {
            if (element.type !== 'PushEvent') return;

            const elementDate = new Date(element.created_at);
            if (elementDate < yesterday) return;

            element.payload.commits.forEach(commit => {
                sendRequest(commit.url, handleCommitResponse);
            });
        });
    }

    function handleCommitResponse(result) {
        if (!result.author || result.author.id !== userid) return;

        const elementDate = new Date(result.commit.author.date);
        if (elementDate < yesterday) return;

        if (commits.length === 0) {
            document.getElementById('output').innerHTML = 'yes';
        }

        commits.push(result);
    }

    document.getElementById('output').innerHTML = 'no';
    sendRequest('https://api.github.com/users/' + username, handleUserResponse);
});