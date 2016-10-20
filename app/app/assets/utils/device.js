// get device info
function getDevice() {
	var md = new MobileDetect(window.navigator.userAgent);
	var deviceType;

	if (md.phone()) {
		deviceType = 'mobile';
	} else if (md.tablet()) {
		deviceType = 'tablet';
	} else {
		deviceType = 'desktop';
	}

	return deviceType;
}