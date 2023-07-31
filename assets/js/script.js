let canvasHeight = window.innerHeight;
let canvasWidth = window.innerWidth;

//ローディング
const loaderWrapper = document.getElementById('loader-js');

// effect
let _isVisible = 0;
let _faceTypeAR = 0;
let _shutterCount = 0;
let _beerFlag = false;

// flag
// ブルベ：_baseColor = 1
// イエベ：_baseColor = 2
let _baseColor = 0;
let _seaonColor = false;

document.addEventListener("dblclick", function (e) { e.preventDefault(); }, { passive: false });

let deepAR = DeepAR({
	canvasWidth: canvasWidth,
	canvasHeight: canvasHeight,
	licenseKey: '4c8a84a1fad77d2a7afd6a4d8cd3c3b35414bbda16a1d39a03fed3ebfb6b07153906095b8a3925d4',
	canvas: document.getElementById('deepar-canvas'),
	numberOfFaces: 1,
	libPath: './lib',
	segmentationInfoZip: 'segmentation.zip',
	onInitialize: function () {
		startExternalVideo();
		deepAR.switchEffect(0, 'slot', './effects/look', function () {
			for (let i = 0; i < _initNode.length; i++) {
				deepAR.changeParameterBool(_initNode[i], '', 'enabled', false);
			}
		});
	},
	onScreenshotTaken: function (photo) {
		if (_faceTypeAR == 1) {
			let thumb = document.getElementById('thumb01');
			let thumbImg = document.getElementById('thumbImg01');
			thumb.style.display = 'block';
			thumbImg.src = photo;
			thumb.appendChild(thumbImg);

			document.getElementById('pointEl').src = photo;
		}
		if (_faceTypeAR == 2) {
			let thumb = document.getElementById('thumb02');
			let thumbImg = document.getElementById('thumbImg02');
			thumb.style.display = 'block';
			thumbImg.src = photo;
			thumb.appendChild(thumbImg);

			document.getElementById('pointFr').src = photo;
		}
		if (_faceTypeAR == 3) {
			let thumb = document.getElementById('thumb03');
			let thumbImg = document.getElementById('thumbImg03');
			thumb.style.display = 'block';
			thumbImg.src = photo;
			thumb.appendChild(thumbImg);

			document.getElementById('pointCo').src = photo;
		}
		if (_faceTypeAR == 4) {
			let thumb = document.getElementById('thumb04');
			let thumbImg = document.getElementById('thumbImg04');
			thumb.style.display = 'block';
			thumbImg.src = photo;
			thumb.appendChild(thumbImg);

			document.getElementById('pointCu').src = photo;
		}
		if (_shutterCount == 1) {
			_beforePhoto = photo;
			let beforeImg = document.getElementById('beforeImg');
			beforeImg.src = photo;
			_shutterCount = 0;
			_beerFlag = true;
		}

		_faceTypeAR = 0;
		console.log(_faceTypeAR);
	}
});

deepAR.onCameraPermissionAsked = function () {
	console.log('camera permission asked');
};
deepAR.onCameraPermissionGranted = function () {
	console.log('camera permission granted');
};
deepAR.onCameraPermissionDenied = function () {
	console.log('camera permission denied');
};
deepAR.onFaceVisibilityChanged = function (visible) {
	console.log('face visible', visible);
};
deepAR.onVideoStarted = function () {
	loaderWrapper.classList.add('loaded-js');
};

deepAR.downloadFaceTrackingModel('./lib/models-68-extreme.bin');

let videoObjects = {};

function startExternalVideo() {
	// create video element
	var video = document.createElement('video');
	video.id = "camera";
	video.muted = true;
	video.loop = true;
	video.controls = true;
	video.setAttribute('playsinline', 'playsinline');
	video.style.width = '100%';
	video.style.height = '100%';

	// put it somewhere in the DOM
	var videoContainer = document.createElement('div');
	videoContainer.appendChild(video);
	videoContainer.id = "1";
	videoContainer.style.width = '1px';
	videoContainer.style.height = '1px';
	videoContainer.style.position = 'absolute';
	videoContainer.style.top = '0px';
	videoContainer.style.left = '0px';
	videoContainer.style['z-index'] = '-1';
	document.body.appendChild(videoContainer);

	videoObjects.videoContainer = videoContainer;
	videoObjects.video = video;

	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { facingMode: 'user' }
	}).then(function (stream) {
		try {
			video.srcObject = stream;
		} catch (error) {
			video.src = URL.createObjectURL(stream);
		}
		setTimeout(function () {
			video.play();
		}, 50);
	}).catch(function (error) {
		console.log('error in video play:', error);
	});

	// tell the DeepAR SDK about our new video element
	deepAR.setVideoElement(video, true);
	loaderWrapper.classList.add('loaded-js');


	function cleanupVideoObjects() {
		if (videoObjects.video.srcObject) {
			videoObjects.video.srcObject.getTracks().forEach(track => track.stop())
		}
	}
}


// アコーディオン
const title = document.querySelectorAll('.js-acc-ttl');

function toggle() {
	const content = this.nextElementSibling;
	this.classList.toggle('is-active');
	content.classList.toggle('is-open');
}

for (let i = 0; i < title.length; i++) {
	title[i].addEventListener('click', toggle)
}

// base wrap
const baseBtn = document.querySelectorAll('.btnBase');

for (let i = 0; i < baseBtn.length; i++) {
	baseBtn[i].addEventListener('click', function () {
		document.getElementById('wrap-baseColor').style.display = 'none';
		document.getElementById('wrap-season').style.display = 'block';
	})
}


// season color 選択
let seasonTxt = document.querySelectorAll('.seasonTxt');
let seasonColor = document.querySelectorAll('.circle');

// ブルベ
document.getElementById('btn-baseB').onclick = () => {
	_baseColor = 1;
	_isVisible = 1;
	console.log('ブルベ', _baseColor);
	document.getElementById('tagBase').innerHTML = 'ブルベ';

	for (let i = 0; i < _settingsBlue.length; i++) {
		seasonTxt[i].innerHTML = _settingsBlue[i]['seasonTxt'];
		seasonColor[i].style.backgroundColor = _settingsBlue[i]['rgb'];
		seasonColor[i].onclick = () => {
			_seaonColor = true;

			const bPersonal = [_settingsBlue[i]['base'], _settingsBlue[i]['seasonTxt']];
			document.getElementById('showPersonalColor').innerHTML = bPersonal;
			document.getElementById('tagBase').innerHTML = bPersonal;
			document.getElementById('pointName').innerHTML = bPersonal;

			deepAR.changeParameterBool('lip', '', 'enabled', true);
			// deepAR.changeParameterVector('eyebrow', 'MeshRenderer', 'u_color', _settingsBlue[i]['eyebrow-r'] / 255, _settingsBlue[i]['eyebrow-g'] / 255, _settingsBlue[i]['eyebrow-b'] / 255, 1);
			deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-co-r'] / 255, _settingsBlue[i]['lip-co-g'] / 255, _settingsBlue[i]['lip-co-b'] / 255, 1);

			document.getElementById('elegant').onclick = () => {
				_faceTypeAR = 1;
				console.log(_faceTypeAR);

				for (let i = 0; i < _elegantDisable.length; i++) {
					deepAR.changeParameterBool(_elegantDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _elegantEnable.length; i++) {
					deepAR.changeParameterBool(_elegantEnable[i], '', 'enabled', true);
				}

				deepAR.changeParameterVector('eyeshadow5', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-el-r'] / 255, _settingsBlue[i]['lip-el-g'] / 255, _settingsBlue[i]['lip-el-b'] / 255, 0.3);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-el-r'] / 255, _settingsBlue[i]['lip-el-g'] / 255, _settingsBlue[i]['lip-el-b'] / 255, 1);
			}

			document.getElementById('fresh').onclick = () => {
				_faceTypeAR = 2;
				console.log(_faceTypeAR);

				for (let i = 0; i < _freshDisable.length; i++) {
					deepAR.changeParameterBool(_freshDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _freshEnable.length; i++) {
					deepAR.changeParameterBool(_freshEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0.4);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushColor', _settingsBlue[i]['lip-fr-r'] / 255, _settingsBlue[i]['lip-fr-g'] / 255, _settingsBlue[i]['lip-fr-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-fr-r'] / 255, _settingsBlue[i]['lip-fr-g'] / 255, _settingsBlue[i]['lip-fr-b'] / 255, 1);
			}

			document.getElementById('cool').onclick = () => {
				_faceTypeAR = 3;
				console.log(_faceTypeAR);

				for (let i = 0; i < _coolDisable.length; i++) {
					deepAR.changeParameterBool(_coolDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _coolEnable.length; i++) {
					deepAR.changeParameterBool(_coolEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0);
				// deepAR.changeParameterVector('eyeshadow4', 'MeshRenderer', 'u_color', _settingsBlue[i]['eye-co-r'] / 255, _settingsBlue[i]['eye-co-g'] / 255, _settingsBlue[i]['eye-co-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-co-r'] / 255, _settingsBlue[i]['lip-co-g'] / 255, _settingsBlue[i]['lip-co-b'] / 255, 1);
			}

			document.getElementById('cute').onclick = () => {
				_faceTypeAR = 4;
				console.log(_faceTypeAR);

				for (let i = 0; i < _cuteDisable.length; i++) {
					deepAR.changeParameterBool(_cuteDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _cuteEnable.length; i++) {
					deepAR.changeParameterBool(_cuteEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0.4);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushColor', _settingsBlue[i]['lip-cu-r'] / 255, _settingsBlue[i]['lip-cu-g'] / 255, _settingsBlue[i]['lip-cu-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsBlue[i]['lip-cu-r'] / 255, _settingsBlue[i]['lip-cu-g'] / 255, _settingsBlue[i]['lip-cu-b'] / 255, 1);
			}
		}
	}
}

// イエベ
document.getElementById('btn-baseY').onclick = () => {
	_baseColor = 2;
	_isVisible = 1;
	console.log('イエベ', _baseColor);
	document.getElementById('tagBase').innerHTML = 'イエベ';

	for (let i = 0; i < _settingsYellow.length; i++) {
		seasonTxt[i].innerHTML = _settingsYellow[i]['seasonTxt'];
		seasonColor[i].style.backgroundColor = _settingsYellow[i]['rgb'];
		seasonColor[i].onclick = () => {
			_seaonColor = true;

			const yPersonal = [_settingsYellow[i]['base'], _settingsYellow[i]['seasonTxt']];
			document.getElementById('showPersonalColor').innerHTML = yPersonal;
			document.getElementById('tagBase').innerHTML = yPersonal;
			document.getElementById('pointName').innerHTML = yPersonal;

			deepAR.changeParameterBool('lip', '', 'enabled', true);
			// deepAR.changeParameterVector('eyebrow', 'MeshRenderer', 'u_color', _settingsYellow[i]['eyebrow-co-r'] / 255, _settingsYellow[i]['eyebrow-co-g'] / 255, _settingsYellow[i]['eyebrow-co-b'] / 255, 1);
			deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-co-r'] / 255, _settingsYellow[i]['lip-co-g'] / 255, _settingsYellow[i]['lip-co-b'] / 255, 1);


			document.getElementById('elegant').onclick = () => {
				_faceTypeAR = 1;
				console.log(_faceTypeAR);

				for (let i = 0; i < _elegantDisable.length; i++) {
					deepAR.changeParameterBool(_elegantDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _elegantEnable.length; i++) {
					deepAR.changeParameterBool(_elegantEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('eyeshadow5', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-el-r'] / 255, _settingsYellow[i]['lip-el-g'] / 255, _settingsYellow[i]['lip-el-b'] / 255, 0.3);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-el-r'] / 255, _settingsYellow[i]['lip-el-g'] / 255, _settingsYellow[i]['lip-el-b'] / 255, 1);
			}

			document.getElementById('fresh').onclick = () => {
				_faceTypeAR = 2;
				console.log(_faceTypeAR);

				for (let i = 0; i < _freshDisable.length; i++) {
					deepAR.changeParameterBool(_freshDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _freshEnable.length; i++) {
					deepAR.changeParameterBool(_freshEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0.4);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushColor', _settingsYellow[i]['lip-fr-r'] / 255, _settingsYellow[i]['lip-fr-g'] / 255, _settingsYellow[i]['lip-fr-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-fr-r'] / 255, _settingsYellow[i]['lip-fr-g'] / 255, _settingsYellow[i]['lip-fr-b'] / 255, 1);
			}

			document.getElementById('cool').onclick = () => {
				_faceTypeAR = 3;
				console.log(_faceTypeAR);

				for (let i = 0; i < _coolDisable.length; i++) {
					deepAR.changeParameterBool(_coolDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _coolEnable.length; i++) {
					deepAR.changeParameterBool(_coolEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0);
				// deepAR.changeParameterVector('eyeshadow4', 'MeshRenderer', 'u_color', _settingsYellow[i]['eye-co-r'] / 255, _settingsYellow[i]['eye-co-g'] / 255, _settingsYellow[i]['eye-co-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-co-r'] / 255, _settingsYellow[i]['lip-co-g'] / 255, _settingsYellow[i]['lip-co-b'] / 255, 1);
			}

			document.getElementById('cute').onclick = () => {
				_faceTypeAR = 4;
				console.log(_faceTypeAR);

				for (let i = 0; i < _cuteDisable.length; i++) {
					deepAR.changeParameterBool(_cuteDisable[i], '', 'enabled', false);
				}
				for (let i = 0; i < _cuteEnable.length; i++) {
					deepAR.changeParameterBool(_cuteEnable[i], '', 'enabled', true);
				}

				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0.4);
				// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushColor', _settingsYellow[i]['lip-cu-r'] / 255, _settingsYellow[i]['lip-cu-g'] / 255, _settingsYellow[i]['lip-cu-b'] / 255, 1);
				deepAR.changeParameterVector('lip', 'MeshRenderer', 'u_color', _settingsYellow[i]['lip-cu-r'] / 255, _settingsYellow[i]['lip-cu-g'] / 255, _settingsYellow[i]['lip-cu-b'] / 255, 1);
			}
		}
	}
}

document.getElementById('rsltSeason').onclick = () => {
	if (!_seaonColor) {
		alert('リップカラーを試し、シーズンを選択してください');
		console.log(_seaonColor);
	} else {
		_personal.style.display = 'block';
		_acc.style.display = 'none';
	}
}


_btnToBase.onclick = () => {
	document.getElementById('wrap-baseColor').style.display = 'block';
}
document.getElementById('btn-closeSeason').onclick = () => {
	document.getElementById('wrap-season').style.display = 'none';
}
_btnClosePersonal.onclick = () => {
	_personal.style.display = 'none';
	_faceType.style.display = 'block';
	_btnToBase.style.display = 'none';
	_btnToSeason.style.display = 'block';
}

document.getElementById('btn-modalClose').onclick = () => {
	_modal.classList.remove('active');
	_overlay.classList.remove('active');
};
document.getElementById('btn-point').onclick = () => {
	_points.style.display = 'block';
};
document.getElementById('btn-backToFacetype').onclick = () => {
	_points.style.display = 'none';
};


// ===========================================================
//   その他 関数
// ===========================================================
// 保存ボタンでキャプチャ
const btnSave = document.querySelectorAll('.btn-save');

function captcha() {
	if (!_faceTypeAR) {
		_faceTypeAR = 0;
		alert('フェイスタイプを選択してください');
	} else {
		deepAR.takeScreenshot();
		setTimeout(function () {
			for (let i = 0; i < _allNodeDisabled.length; i++) {
				deepAR.changeParameterBool(_allNodeDisabled[i], '', 'enabled', false);
			}
			// deepAR.changeParameterVector('face_makeup', 'MeshRenderer', 'blushAmount', 0);
			_shutterCount = 1;
			deepAR.takeScreenshot();
			_faceTypeAR = 0;
		}, 50);
		_thumb.style.display = 'block';
		_ballonOfPoints.style.display = 'block';
	}
}

for (let i = 0; i < btnSave.length; i++) {
	btnSave[i].addEventListener('click', captcha)
}
const thumbPic = document.querySelectorAll('.thumb');
const thumbWrap = document.querySelectorAll('.thumbWrap');


for (let i = 0; i < thumbWrap.length; i++) {
	thumbWrap[i].onclick = () => {
		_beerFlag = true;

		let thumbSrc = thumbPic[i].getAttribute('src');
		let afterImg = document.getElementById('afterImg');
		afterImg.src = thumbSrc;

		let slider = new BeerSlider(document.getElementById('beer-slider'));
		_modal.classList.add('active');
		_overlay.classList.add('active');
	}
}

_btnToSeason.onclick = () => {
	_acc.style.display = 'block';
	_faceType.style.display = 'none';
	_btnToBase.style.display = 'block';
	_btnToSeason.style.display = 'none';
	_thumb.style.display = 'none';
	for (let i = 0; i < thumbPic.length; i++) {
		thumbPic[i].setAttribute('src', '');
		thumbWrap[i].style.display = 'none';
	}
	document.getElementById('pointEl').setAttribute('src', '');
	document.getElementById('pointFr').setAttribute('src', '');
	document.getElementById('pointCu').setAttribute('src', '');
	document.getElementById('pointCo').setAttribute('src', '');
}


feather.replace();

