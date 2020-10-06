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

    sendRequest('https://api.github.com/users/' + username, handleUserResponse);

    function handleUserResponse(result) {
        if (result.hasOwnProperty('login')) {
            const d = new Date();
            const today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);

            sendRequest('https://api.github.com/search/commits?q=author:' + username + '+author-date:' + today, handleSearchResponse);
        }
        else {
            document.getElementById('output').innerHTML = 'user not found';
            return;
        }
    }

    function handleSearchResponse(result) {
        if (result.total_count !== 0) {
            document.getElementById('output').innerHTML = 'yes';
        }
        else {
            document.getElementById('output').innerHTML = 'no';
        }
    }
});

document.getElementById('dark-toggle').addEventListener('change', event => {
    if (event.target.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', event => {
    const toggle = document.getElementById('dark-toggle');
    let dark;
    if (!localStorage.getItem('theme')) {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    else {
        dark = (localStorage.getItem('theme') === 'dark');
    }
    toggle.checked = dark;
    toggle.dispatchEvent(new Event('change'));
});
