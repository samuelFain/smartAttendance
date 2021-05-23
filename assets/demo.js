let video = document.querySelector('#video');
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
		video.srcObject = stream;
		video.play();
	});
}
