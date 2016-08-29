var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.dev.hearth.net/profile');
xhr.setRequestHeader('X-API-TOKEN', '1FKhydKi3LzPLSxo7WD-');
xhr.onload = function() {
    if (xhr.status === 200) {
        console.info(xhr);
        console.log(xhr.responseText);
    } else {
        console.log('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();