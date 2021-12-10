function syntaxHighlight(data) {
    const json = JSON.stringify(data, null, 2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

	
document.querySelector ("button").onclick = async ()=> {
	window.open("target.html","_blank","toolbar=no,scrollbars=no,resizable=no,width:1280,height:720");

	const stream = await navigator.mediaDevices.getDisplayMedia({video:{
		frameRate: 30,
		width: 1280,
		height: 720,
		cursor: "motion"
	}});

	const videoTrack = stream.getVideoTracks()[0];

	videoTrack.contentHint = "motion";

	//Create pcs
	const sender	= window.sender   = new RTCPeerConnection();
	const receiver	= window.receiver = new RTCPeerConnection();
	
	receiver.ontrack = ({track}) => {
		//Create new video element
		const video = document.createElement("video");
		//Set src stream
		video.srcObject = new MediaStream([track])
		//Set other properties
		video.autoplay = true;
		video.controls = true;
		video.muted = true;
		video.addEventListener("click",function(){
			video.play();
			return false;
		});
		//Append it
		document.body.appendChild(video);
	};
	
	//Interchange candidates
	sender.onicecandidate	= ({candidate}) => candidate && receiver.addIceCandidate(candidate);
	receiver.onicecandidate = ({candidate}) => candidate && sender.addIceCandidate(candidate);
	
	//add audio context dest stream
	sender.addTrack(videoTrack);
	
	const offer = await sender.createOffer();
	offer.sdp = offer.sdp.replace("useinbandfec=1", "useinbandfec=0; dtx=0; stereo=1; ptime=10; maxptime=10;")
	await sender.setLocalDescription(offer);
	await receiver.setRemoteDescription(offer);
	
	const answer = await receiver.createAnswer();
	answer.sdp = answer.sdp.replace("useinbandfec=1", "useinbandfec=0; dtx=0; stereo=1; ptime=10; maxptime=10;")
	await receiver.setLocalDescription(answer);
	await sender.setRemoteDescription(answer);

	//Started
	document.body.children[0].innerText = "started";


	setInterval(async () => {

		const stats = await sender.getSenders()[0].getStats();

		for (const [name,stat] of stats)
			if (stat.type=="outbound-rtp")
				document.querySelector ("#stats>pre").innerHTML = syntaxHighlight(stat);
	}, 1000);
};