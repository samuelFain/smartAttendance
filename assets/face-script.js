const video = document.querySelector('#videoInput');

let res = []; //array of detected faces, will be sent to server on 'submit'

const form = document.getElementById('submit-session');

// form 'submit' listener - send result as json object to server using fetch api
form.addEventListener('submit', function (e) {
	e.preventDefault();

	const resp = fetch('/dashboard/session/create', {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(res),
	});
});

//Toast (messages) option config
var option = {
	animation: true,
	delay: 10000,
};

//bootstrap toast handling
var toastElList = [].slice.call(document.querySelectorAll('.toast'));
var toastList = toastElList.map(function (toastEl) {
	return new bootstrap.Toast(toastEl, option);
});

//run a toast on session board
function run_toast(toast_id, msg) {
	toastList.forEach((element) => {
		if (element._element.id == toast_id) {
			if (msg == '') {
				element.show();
			} else {
				let element_objects = element._element.childNodes;
				element_objects[3].innerHTML = msg;
				element.show();
			}
		}
	});
}

Promise.all([faceapi.nets.faceRecognitionNet.loadFromUri('/models'), faceapi.nets.faceLandmark68Net.loadFromUri('/models'), faceapi.nets.ssdMobilenetv1.loadFromUri('/models')]).then(start);

function start() {
	run_toast('loading_toast', '');
	console.log('Models Loaded');

	// connect webcam to video element
	// navigator.mediaDevices.getUserMedia(
	// 	//added mediaDevices
	// 	{video: {}},
	// 	(stream) => (video.srcObject = stream),
	// 	(err) => console.error(err)
	// );

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
			video.srcObject = stream;
			video.play();
		});
	}

	recognizeFaces();
	// console.log('finished ');
	// document.body.append(label + ' finished ');
}

//
async function recognizeFaces() {
	const labeledDescriptors = await loadLabeledImages(); //get labeled descriptors
	const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); //init face matcher with 0.6 distance between descriptors (the lower the better)

	// video.addEventListener('play', () => {
	console.log('playing');

	const canvas = await faceapi.createCanvasFromMedia(video);
	document.body.querySelector('#faceVideoInput').append(canvas);

	const displaySize = {width: video.width, height: video.height};
	faceapi.matchDimensions(canvas, displaySize);

	//detections intervals
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

		const resizedDetections = await faceapi.resizeResults(detections, displaySize);

		//clear canvas after every recognition
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

		const results = resizedDetections.map((d) => {
			return faceMatcher.findBestMatch(d.descriptor);
		});

		results.forEach((result, i) => {
			const box = resizedDetections[i].detection.box;
			const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
			drawBox.draw(canvas);
			if (result._distance > 0.4) {
				run_toast('successfully_detected_toast', 'Hello ' + result._label);
				res.push(result._label);
				// console.log(res);
				// console.log(result.toString());
			}
		});
	}, 100);
	// });
}

//match each of the images for the labels and return face descriptors
function loadLabeledImages() {
	const labels = ['Shmuel Fainberg']; //array of labels for images  !!!! change later to dynamic !!!!!
	return Promise.all(
		labels.map(async (label) => {
			const descriptions = [];
			for (let i = 1; i <= 4; i++) {
				const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`);
				const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
				console.log(label + i + JSON.stringify(detections));
				descriptions.push(detections.descriptor);
			}

			// document.body.append(label + ' Faces Loaded | ');
			run_toast('facesLoaded_toast', '');

			// console.log(label, descriptions)
			return new faceapi.LabeledFaceDescriptors(label, descriptions);
		})
	);
}
