$(function() {
	FastClick.attach(document.body);
});

// fb invite jump out from FB frame
if (top.location != self.location) {
	top.location = self.location;
}

// fb login redirects to this URL
if (window.location.hash && window.location.hash === '#_=_') {
	window.location.hash = '';
}

// refresh from old URL style to new one #!/ => /
if (!!~window.location.href.indexOf('#!/')) {
	// != -1 && window.location.href.indexOf('#!') == -1
	window.location.href = window.location.href.replace('#!/', '');
}