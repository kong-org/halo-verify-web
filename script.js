const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

function buf2hex(buffer) { // buffer is an ArrayBuffer
	return [...new Uint8Array(buffer)]
		.map(x => x.toString(16).padStart(2, '0'))
		.join('');
}

async function authU2F(reqx) {
	var req = {"publicKey": {
		"allowCredentials": [
			{
				"id": reqx,
				"transports": ['nfc'],
				"type": "public-key"
			}
		],
		"challenge": new Uint8Array([113, 241, 176, 49, 249, 113, 39, 237, 135, 170, 177, 61, 15, 14, 105, 236, 120, 140, 4, 41, 65, 225, 107, 63, 214, 129, 133, 223, 169, 200, 21, 88]),
		"rpId": "eth.vrfy.ch",
		"timeout": 60000,
		"userVerification": "discouraged"
	}};

	var xdd = await navigator.credentials.get(req);
	return xdd.response.signature;
}

async function authBtnU2F() {
	var req = fromHexString("0101abc1898af1b0cf120f5d372d26453c28191d2ba81cbc317c7afa6da516105ccd");
	// alert(buf2hex(req));
	var res = await auth(req);

	console.log(buf2hex(res));
	alert(buf2hex(res));
}

let genChallenge = new Uint8Array(2 + 32);
crypto.getRandomValues(genChallenge);
genChallenge[0] = 1;
genChallenge[1] = 1 + (genChallenge[1] % 2); // key number to use (random: 1 or 2)

genChallenge = buf2hex(genChallenge);

let ndef;
let ctrl;

try {
	ndef = new NDEFReader();
	ctrl = new AbortController();

ndef.addEventListener("readingerror", () => {
	document.getElementById('statusBox').innerHTML = '<div class="alert alert-danger">' +
		'Read error. Please remove the card from the reader.<br>' +
		'<button onclick="window.location.reload(false);" class="btn btn-secondary">Try again</button></div>';
});

ndef.addEventListener("reading", async ({message, serialNumber}) => {
	let pkey1;
	let pkey2;
	let challenge;
	let signature;

	try {
		let url = new URL(new TextDecoder("utf-8").decode(message.records[0].data));
		let myURL = new URL(window.location.href);

		pkey1 = myURL.searchParams.get("pkey1");
		pkey2 = myURL.searchParams.get("pkey2");

		document.getElementById('statusBox').innerHTML = '<div class="alert alert-success" style="word-break: break-all;">' +
				'PKEY1: <code>' + pkey1 + '</code><br>' +
				'PKEY2: <code>' + pkey2 + '</code><br>' +
				'</div>';		
	} catch (e) {
		document.getElementById('statusBox').innerHTML = '<div class="alert alert-danger">' +
			'Read error. Please tap the card once again.' +
			'</div>';
		return;
	}



	// document.getElementById('statusBox').innerHTML = '<div class="alert alert-warning">' +
	// 	'Read completed. Verifying signature...' +
	// 	'</div>';

	// fetch('/verify', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		pkey1: pkey1,
	// 		pkey2: pkey2,
	// 		challenge: challenge,
	// 		signature: signature
	// 	}),
	// })
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		document.getElementById('statusBox').innerHTML = '<div class="alert alert-success" style="word-break: break-all;">' +
	// 			'PKEY1: <code>' + pkey1 + '</code><br>' +
	// 			'PKEY2: <code>' + pkey2 + '</code><br>' +
	// 			'Gen. challenge: <code>' + genChallenge + '</code><br>' +
	// 			'Read challenge: <code>' + challenge + '</code><br>' +
	// 			'Signature: <code>' + signature + '</code><br>' +
	// 			'Valid (server side): <code>' + (data.valid ? 'VALID' : 'INVALID') + '</code>' +
	// 			'</div>';
	// 	})
	// 	.catch((error) => {
	// 		document.getElementById('statusBox').innerHTML = '<div class="alert alert-danger">' +
	// 			'Error: ' + error +
	// 			'</div>';
	// 	});
});

document.getElementById("authButton").addEventListener("click", async () => {
	document.getElementById("authButton").disabled = true;
	document.getElementById("authButtonU2F").disabled = true;
	document.getElementById('statusBox').innerHTML = '<div class="alert alert-info">' +
		'Please tap the card and hold it.<br>' +
		'Gen. challenge: <code>' + genChallenge + '</code><br>' +
		'</div>';

	try {
		let challenge = fromHexString(genChallenge);
		await ndef.write({records: [{recordType: "unknown", data: challenge}]});

		document.getElementById('statusBox').innerHTML = '<div class="alert alert-warning">' +
			'Reading data... Please hold the card.' +
			'</div>';

		await ndef.scan({signal: ctrl.signal});
	} catch (error) {
		document.getElementById('statusBox').innerHTML = '<div class="alert alert-danger">' +
			'Read error. Please remove the card from the reader.<br>' + error + '<br>' +
			'<button onclick="window.location.reload(false);" class="btn btn-secondary">Try again</button>' +
			'</div>';
	}
});
} catch (e) {
	document.getElementById('statusBox').innerHTML = '<div class="alert alert-warning">' +
		'WebNFC not available. U2F may still work. Please use buttons below to interact with the tag.</div>';
}

// async function authBtnU2F() {
// 	document.getElementById("authButton").disabled = true;
// 	document.getElementById("authButtonU2F").disabled = true;

// 	document.getElementById('statusBox').innerHTML = '<div class="alert alert-info">' +
// 		'Please tap the card and hold it.<br>' +
// 		'Gen. challenge: <code>' + genChallenge + '</code><br>' +
// 		'</div>';

// 	var req = fromHexString(genChallenge);
// 	var res = await authU2F(req);

// 	let qs = new URLSearchParams(window.location.search);
// 	let pkey1 = qs.get("pkey1");
// 	let pkey2 = qs.get("pkey2");

// 	fetch('/verify', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			pkey1: pkey1,
// 			pkey2: pkey2,
// 			challenge: genChallenge,
// 			signature: buf2hex(res)
// 		}),
// 	})
// 		.then(response => response.json())
// 		.then(data => {
// 			document.getElementById('statusBox').innerHTML = '<div class="alert alert-success" style="word-break: break-all;">' +
// 				'PKEY1: <code>' + pkey1 + '</code><br>' +
// 				'PKEY2: <code>' + pkey2 + '</code><br>' +
// 				'Gen. challenge: <code>' + genChallenge + '</code><br>' +
// 				'Signature: <code>' + buf2hex(res) + '</code><br>' +
// 				'Valid (server side): <code>' + (data.valid ? 'VALID' : 'INVALID') + '</code>' +
// 				'</div>';
// 		})
// 		.catch((error) => {
// 			document.getElementById('statusBox').innerHTML = '<div class="alert alert-danger">' +
// 				'Error: ' + error +
// 				'</div>';
// 		});
// }

async function readKeyU2F() {
    let res = await authU2F(fromHexString("02"));


	document.getElementById('statusBox').innerHTML = '<div class="alert alert-success" style="word-break: break-all;">' +
			'Response: <code>' + buf2hex(res) + '</code><br>' +
			'</div>';	
}