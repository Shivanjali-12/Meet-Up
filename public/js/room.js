const socket = io();
const myvideo = document.querySelector("#vd1");
const roomid = params.get("room");
let username;

const msgSaveButt = document.querySelector('.msg-save');
const chatRoom = document.querySelector('.chat-cont');
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');

const videoContainer = document.querySelector('#vcont');
const overlayContainer = document.querySelector('#overlay')
const continueButt = document.querySelector('.continue-name');
const nameField = document.querySelector('#name-field');

const videoButt = document.querySelector('.novideo');
const audioButt = document.querySelector('.audio');
const cutCall = document.querySelector('.cutcall');
const screenShareButt = document.querySelector('.screenshare');
const whiteboardButt = document.querySelector('.board-icon');
const handButt = document.querySelector('.raise-hand');
const AttendiesDataButt = document.querySelector('.attendies-data');

const clapButt = document.querySelector('.clap');
const thumbsupButt = document.querySelector('.thumbsup');
const heartButt = document.querySelector('.heart')

let videoAllowed = 1;
let audioAllowed = 1;
let handDown = 1;

let streams = []; //list-for-storing--streams
let chatMessages = []; // collect chat messages to save it later if want
let attendiesData = []; // collect time of attendies entering and leaving the room

let micInfo = {};
let videoInfo = {};
let handInfo = {};

let videoTrackReceived = {};

let mymuteicon = document.querySelector("#mymuteicon");
mymuteicon.style.visibility = 'hidden';

let myvideooff = document.querySelector("#myvideooff");
myvideooff.style.visibility = 'hidden';

let myhandup = document.querySelector("#myhandup");
myhandup.style.visibility = 'hidden';

const configuration = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }] }

const mediaConstraints = { video: true, audio: true };

let connections = {};
let cName = {};
let audioTrackSent = {};
let videoTrackSent = {};

let mystream, myscreenshare;

document.querySelector('.roomcode').innerHTML = `${roomid}`

function CopyClassText() {

    var textToCopy = document.querySelector('.roomcode');
    var currentRange;
    if (document.getSelection().rangeCount > 0) {
        currentRange = document.getSelection().getRangeAt(0);
        window.getSelection().removeRange(currentRange);
    }
    else {
        currentRange = false;
    }

    var CopyRange = document.createRange();
    CopyRange.selectNode(textToCopy);
    window.getSelection().addRange(CopyRange);
    document.execCommand("copy");

    window.getSelection().removeRange(CopyRange);

    if (currentRange) {
        window.getSelection().addRange(currentRange);
    }

    document.querySelector(".copycode-button").textContent = "Copied!"
    setTimeout(()=>{
        document.querySelector(".copycode-button").textContent = "Copy Code";
    }, 5000);
}


continueButt.addEventListener('click', () => {
    if (nameField.value == '') return;
    username = nameField.value;
    overlayContainer.style.visibility = 'hidden';
    document.querySelector("#myname").innerHTML = `${username} (You)`;
    socket.emit("join room", roomid, username);
})

nameField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        continueButt.click();
    }
});

socket.on('user count', count => {
    if (count > 1) {
        videoContainer.className = 'video-cont';
    }
    else {
        videoContainer.className = 'video-cont-single';
    }
})

let peerConnection;

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            break;
        default:
            alert("Error opening your camera and/or microphone: " + e.message);
            break;
    }

}


function reportError(e) {
    console.log(e);
    return;
}


function startCall() {

    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(localStream => {
            myvideo.srcObject = localStream;
            myvideo.muted = true;
            mystream = localStream;
            localStream.getTracks().forEach(track => {
                for (let key in connections) {
                    connections[key].addTrack(track, localStream);
                    if (track.kind === 'audio')
                        audioTrackSent[key] = track;
                    else
                        videoTrackSent[key] = track;
                }
            })

        })
        .catch(handleGetUserMediaError);
}

function handleVideoOffer(offer, sid, cname, micinf, vidinf, handinf) {

    cName[sid] = cname;
    console.log('video offered recevied');
    micInfo[sid] = micinf;
    videoInfo[sid] = vidinf;
    handInfo[sid] = handinf;
    connections[sid] = new RTCPeerConnection(configuration);

    connections[sid].onicecandidate = function (event) {
        if (event.candidate) {
            console.log('icecandidate fired');
            socket.emit('new icecandidate', event.candidate, sid);
        }
    };

    connections[sid].ontrack = function (event) {

        if (!document.getElementById(sid)) {
            console.log('track event fired')
            let vidCont = document.createElement('div');
            let newvideo = document.createElement('video');
            let name = document.createElement('div');
            let muteIcon = document.createElement('div');
            let videoOff = document.createElement('div');
            let handUp = document.createElement('div');

            videoOff.classList.add('video-off');
            muteIcon.classList.add('mute-icon');
            handUp.classList.add('hand-icon');

            name.classList.add('nametag');
            name.innerHTML = `${cName[sid]}`;
            vidCont.id = sid;
            muteIcon.id = `mute${sid}`;
            videoOff.id = `vidoff${sid}`;
            handUp.id = `hand${sid}`;

            muteIcon.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
            videoOff.innerHTML = 'Video Off';
            handUp.innerHTML = `<i class="fas fa-hand-paper"></i>`;

            vidCont.classList.add('video-box');handUp.innerHTML = `<i class="fas fa-hand-paper"></i>`;
            newvideo.classList.add('video-frame');
            newvideo.autoplay = true;
            newvideo.playsinline = true;
            newvideo.id = `video${sid}`;
            newvideo.srcObject = event.streams[0];

            streams.push(event.streams[0]); //adding-streams-in-our-list

            if (micInfo[sid] == 'on')
                muteIcon.style.visibility = 'hidden';
            else
                muteIcon.style.visibility = 'visible';

            if (videoInfo[sid] == 'on')
                videoOff.style.visibility = 'hidden';
            else
                videoOff.style.visibility = 'visible';

            if (handUp[sid] == 'on')
                handUp.style.visibility = 'visible';
            else
                handUp.style.visibility = 'hidden';

            vidCont.appendChild(newvideo);
            vidCont.appendChild(name);
            vidCont.appendChild(muteIcon);
            vidCont.appendChild(videoOff);
            vidCont.appendChild(handUp);

            videoContainer.appendChild(vidCont);

        }


    };

    connections[sid].onremovetrack = function (event) {
        if (document.getElementById(sid)) {
            document.getElementById(sid).remove();
            console.log('removed a track');
        }
    };

    connections[sid].onnegotiationneeded = function () {

        connections[sid].createOffer()
            .then(function (offer) {
                return connections[sid].setLocalDescription(offer);
            })
            .then(function () {

                socket.emit('video-offer', connections[sid].localDescription, sid);

            })
            .catch(reportError);
    };

    let desc = new RTCSessionDescription(offer);

    connections[sid].setRemoteDescription(desc)
        .then(() => { return navigator.mediaDevices.getUserMedia(mediaConstraints) })
        .then((localStream) => { 
            localStream.getTracks().forEach(track => {
                connections[sid].addTrack(track, localStream);
                console.log('added local stream to peer')
                if (track.kind === 'audio') {
                    audioTrackSent[sid] = track;
                    if (!audioAllowed)
                        audioTrackSent[sid].enabled = false;
                }
                else {
                    videoTrackSent[sid] = track;
                    if (!videoAllowed)
                        videoTrackSent[sid].enabled = false
                }
            })

        })
        .then(() => {
            return connections[sid].createAnswer();
        })
        .then(answer => {
            return connections[sid].setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('video-answer', connections[sid].localDescription, sid);
        })
        .catch(handleGetUserMediaError);


}

function handleNewIceCandidate(candidate, sid) {
    console.log('new candidate recieved')
    var newcandidate = new RTCIceCandidate(candidate);

    connections[sid].addIceCandidate(newcandidate)
        .catch(reportError);
}

function handleVideoAnswer(answer, sid) {
    console.log('answered the offer')
    const ans = new RTCSessionDescription(answer);
    connections[sid].setRemoteDescription(ans);
}

socket.on('video-offer', handleVideoOffer);

socket.on('new icecandidate', handleNewIceCandidate);

socket.on('video-answer', handleVideoAnswer);


socket.on('join room', async (conc, cnames, micinfo, videoinfo, handinfo) => {
    socket.emit('getCanvas');
    if (cnames)
        cName = cnames;

    if (micinfo)
        micInfo = micinfo;

    if (videoinfo)
        videoInfo = videoinfo;

    if (handinfo)
        handInfo = handinfo;

    console.log(cName);
    if (conc) {
        await conc.forEach(sid => {
            connections[sid] = new RTCPeerConnection(configuration);

            connections[sid].onicecandidate = function (event) {
                if (event.candidate) {
                    console.log('icecandidate fired');
                    socket.emit('new icecandidate', event.candidate, sid);
                }
            };

            connections[sid].ontrack = function (event) {

                if (!document.getElementById(sid)) {
                    console.log('track event fired')
                    let vidCont = document.createElement('div');
                    let newvideo = document.createElement('video');
                    let name = document.createElement('div');
                    let muteIcon = document.createElement('div');
                    let videoOff = document.createElement('div');
                    let handUp = document.createElement('div');

                    videoOff.classList.add('video-off');
                    muteIcon.classList.add('mute-icon');
                    handUp.classList.add('hand-icon');

                    name.classList.add('nametag');
                    name.innerHTML = `${cName[sid]}`;
                    vidCont.id = sid;
                    muteIcon.id = `mute${sid}`;
                    videoOff.id = `vidoff${sid}`;
                    handUp.id = `hand${sid}`;

                    muteIcon.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
                    videoOff.innerHTML = 'Video Off'
                    handUp.innerHTML = `<i class="fas fa-hand-paper"></i>`;

                    vidCont.classList.add('video-box');
                    newvideo.classList.add('video-frame');
                    newvideo.autoplay = true;
                    newvideo.playsinline = true;
                    newvideo.id = `video${sid}`;
                    newvideo.srcObject = event.streams[0];
                    streams.push(event.streams[0]);

                    if (micInfo[sid] == 'on')
                        muteIcon.style.visibility = 'hidden';
                    else
                        muteIcon.style.visibility = 'visible';

                    if (videoInfo[sid] == 'on')
                        videoOff.style.visibility = 'hidden';
                    else
                        videoOff.style.visibility = 'visible';

                    if (handUp[sid] == 'on')
                        handUp.style.visibility = 'visible';
                    else
                        handUp.style.visibility = 'hidden';

                    vidCont.appendChild(newvideo);
                    vidCont.appendChild(name);
                    vidCont.appendChild(muteIcon);
                    vidCont.appendChild(videoOff);
                    vidCont.appendChild(handUp);

                    videoContainer.appendChild(vidCont);

                }

            };

            connections[sid].onremovetrack = function (event) {
                if (document.getElementById(sid)) {
                    document.getElementById(sid).remove();
                }
            }

            connections[sid].onnegotiationneeded = function () {

                connections[sid].createOffer()
                    .then(function (offer) {
                        return connections[sid].setLocalDescription(offer);
                    })
                    .then(function () {

                        socket.emit('video-offer', connections[sid].localDescription, sid);

                    })
                    .catch(reportError);
            };

        });

        console.log('added all sockets to connections');
        startCall();

    }
    else {
        console.log('waiting for someone to join');
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localStream => {
                myvideo.srcObject = localStream;
                myvideo.muted = true;
                mystream = localStream;
            })
            .catch(handleGetUserMediaError);
    }
})

socket.on('remove peer', sid => {
    if (document.getElementById(sid)) {
        document.getElementById(sid).remove();
    }

    delete connections[sid];
})

sendButton.addEventListener('click', () => {
    const msg = messageField.value;
    messageField.value = '';
    socket.emit('message', msg, username, roomid);
})

messageField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});

socket.on('message', (msg, sendername, time) => {
    if(msg.length==0)return;
    // collect attendies data to save it later
    if(sendername == "Bot"){
        attendiesData.push({
            Time: time,
            Status: msg,
        });
    }
    // collect chat msges to save it later
    chatMessages.push({
        Time: time,
        Name: sendername,
        Text: msg,
    });
    chatRoom.scrollTop = chatRoom.scrollHeight;
    chatRoom.innerHTML += `<div class="message">
    <div class="info">
    <div class="username">${sendername}</div>
    <div class="time">${time}</div>
    </div>
    <div class="content">
    ${msg}
    </div>
    </div>`
});


msgSaveButt.addEventListener("click", (e) => {
    if (chatMessages.length != 0) {
        let a = document.createElement("a");
        a.href =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(chatMessages, null, 1));
        a.download = getDataTimeString() + "-CHAT.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }
    alert("No chat messages to save");
});

AttendiesDataButt.addEventListener("click", (e) => {
    if (attendiesData.length != 0) {
        let a = document.createElement("a");
        a.href =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(attendiesData, null, 1));
        a.download = getDataTimeString() + "-CHAT.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }
    alert("No Attendie entered the room yet");
});

//toggle video icons

videoButt.addEventListener('click', () => {

    if (videoAllowed) {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = false;
        }
        videoButt.innerHTML = `<i class="fas fa-video-slash"></i>`;
        videoAllowed = 0;
        videoButt.style.backgroundColor = "#b12c2c";

        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = false;
                }
            })
        }

        myvideooff.style.visibility = 'visible';

        socket.emit('action', 'videooff');
    }
    else {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = true;
        }
        videoButt.innerHTML = `<i class="fas fa-video"></i>`;
        videoAllowed = 1;
        videoButt.style.backgroundColor = "#c4c4c4";
        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'video')
                    track.enabled = true;
            })
        }


        myvideooff.style.visibility = 'hidden';

        socket.emit('action', 'videoon');
    }
})

//toggle mute icons 

audioButt.addEventListener('click', () => {

    if (audioAllowed) {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = false;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        audioAllowed = 0;
        audioButt.style.backgroundColor = "#cc4e4e";

        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'audio')
                    track.enabled = false;
            })
        }

        mymuteicon.style.visibility = 'visible';

        socket.emit('action', 'mute');
    }
    else {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = true;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone"></i>`;
        audioAllowed = 1;
        audioButt.style.backgroundColor = "#c4c4c4";

        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'audio')
                    track.enabled = true;
            })
        }

        mymuteicon.style.visibility = 'hidden';

        socket.emit('action', 'unmute');
    }
})


//raise hand

handButt.addEventListener('click', () => {
    if (handDown) {
        myhandup.style.visibility = 'visible';
        handDown = 0;
        handButt.innerHTML = `<i class="fas fa-hand-rock"></i><span class="tooltiptext">Lower Hand</span>`;
        socket.emit('action', 'up');
    }
    else {
        myhandup.style.visibility = 'hidden';
        handDown = 1;
        handButt.innerHTML = `<i class="fas fa-hand-paper"></i><span class="tooltiptext">Raise Hand</span>`;
        socket.emit('action', 'down');
    }
});

// reactions ---- clap / thumbs-up / heart

clapButt.addEventListener('click', () => {
    socket.emit('action' , 'clap');
});

thumbsupButt.addEventListener('click', () => {
    socket.emit('action', 'thumbsup');
});

heartButt.addEventListener('click', () => {
    socket.emit('action', 'heart');
});




socket.on('action', (msg, sid) => {
    if (msg == 'mute') {
        console.log(sid + ' muted');
        document.querySelector(`#mute${sid}`).style.visibility = 'visible';
        micInfo[sid] = 'off';
    }
    else if (msg == 'unmute') {
        console.log(sid + ' unmuted');
        document.querySelector(`#mute${sid}`).style.visibility = 'hidden';
        micInfo[sid] = 'on';
    }
    else if (msg == 'videooff') {
        console.log(sid + ' video off');
        document.querySelector(`#vidoff${sid}`).style.visibility = 'visible';
        videoInfo[sid] = 'off';
    }
    else if (msg == 'videoon') {
        console.log(sid + ' video on');
        document.querySelector(`#vidoff${sid}`).style.visibility = 'hidden';
        videoInfo[sid] = 'on';
    }
    else if (msg == 'up') {
        console.log(sid + 'raised his hand');
        document.querySelector(`#hand${sid}`).style.visibility = 'visible';
        handInfo[sid] = 'on';
        let audio = new Audio("../audio/raiseHand.mp3");
        audio.play();
    }
    else if (msg == 'down') {
        console.log(sid + 'lowered his hand');
        document.querySelector(`#hand${sid}`).style.visibility = 'hidden';
        handInfo[sid] = 'off';
    }
    else if(msg == 'clap') {
        alert( cName[sid] + " clapped !!");
    }
    else if(msg == 'thumbsup') {
        alert( cName[sid] + " gave a Thumbs Up !!");
    }
    else if(msg == 'heart') {
        alert( cName[sid] + " reacted with a heart !!");
    }
})



//whiteboard feature starts here

const whiteboardCont = document.querySelector('.whiteboard-cont');
const canvas = document.querySelector("#whiteboard");
const ctx = canvas.getContext('2d');

let boardVisisble = false;

whiteboardCont.style.visibility = 'hidden';

let isDrawing = 0;
let x = 0;
let y = 0;
let color = "black";
let drawsize = 3;
let colorRemote = "black";
let drawsizeRemote = 3;

function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

fitToContainer(canvas);

//getCanvas call is under join room call
socket.on('getCanvas', url => {
    let img = new Image();
    img.onload = start;
    img.src = url;

    function start() {
        ctx.drawImage(img, 0, 0);
    }

    console.log('got canvas', url)
})

function setColor(newcolor) {
    color = newcolor;
    drawsize = 3;
}

function setEraser() {
    color = "white";
    drawsize = 20;
}

//might remove this
function reportWindowSize() {
    fitToContainer(canvas);
}

window.onresize = reportWindowSize;
//

function saveBoard() {
    let link = document.createElement("a");
    link.download = getDataTimeString() + "WHITEBOARD.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

function clearBoard() {
    if (window.confirm('Are you sure you want to clear board?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('store canvas', canvas.toDataURL());
        socket.emit('clearBoard');
    }
    else return;
}

socket.on('clearBoard', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

function draw(newx, newy, oldx, oldy) {
    ctx.strokeStyle = color;
    ctx.lineWidth = drawsize;
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(newx, newy);
    ctx.stroke();
    ctx.closePath();

    socket.emit('store canvas', canvas.toDataURL());

}

function drawRemote(newx, newy, oldx, oldy) {
    ctx.strokeStyle = colorRemote;
    ctx.lineWidth = drawsizeRemote;
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(newx, newy);
    ctx.stroke();
    ctx.closePath();

}

canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = 1;
})

canvas.addEventListener('mousemove', e => {
    if (isDrawing) {
        draw(e.offsetX, e.offsetY, x, y);
        socket.emit('draw', e.offsetX, e.offsetY, x, y, color, drawsize);
        x = e.offsetX;
        y = e.offsetY;
    }
})

window.addEventListener('mouseup', e => {
    if (isDrawing) {
        isDrawing = 0;
    }
})

socket.on('draw', (newX, newY, prevX, prevY, color, size) => {
    colorRemote = color;
    drawsizeRemote = size;
    drawRemote(newX, newY, prevX, prevY);
})


whiteboardButt.addEventListener('click', () => {
    if (boardVisisble) {
        whiteboardButt.innerHTML = `<i class="fas fa-chalkboard-teacher"></i><span class="tooltiptext">Open Whiteboard</span>`;
        whiteboardCont.style.visibility = 'hidden';
        boardVisisble = false;
    }
    else {
        whiteboardButt.innerHTML = `<i class="fas fa-chalkboard-teacher"></i><span class="tooltiptext">Close Whiteboard</span>`;
        whiteboardCont.style.visibility = 'visible';
        boardVisisble = true;
    }
})


// screensharing feature starts

screenShareButt.addEventListener('click', () => {
    videoButt.innerHTML = `<i class="fas fa-video"></i>`;
    videoAllowed = 1;
    videoButt.style.backgroundColor = "#c4c4c4";
    myvideooff.style.visibility = 'hidden';
    socket.emit('action', 'videoon');
    screenShareToggle();
});

let screenshareEnabled = false;

function screenShareToggle() {
    let screenMediaPromise;
    if (!screenshareEnabled) {
        if (navigator.getDisplayMedia) {
            screenMediaPromise = navigator.getDisplayMedia({ video: true, audio: true });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            screenMediaPromise = navigator.mediaDevices.getDisplayMedia({ video: true, audio:true });
        } else {
            screenMediaPromise = navigator.mediaDevices.getUserMedia({
                video: { mediaSource: "screen" },
            });
        }
    } else {
        screenMediaPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
    screenMediaPromise
        .then((myscreenshare) => {
            screenshareEnabled = !screenshareEnabled;
            for (let key in connections) {
                const sender = connections[key]
                    .getSenders()
                    .find((s) => (s.track ? s.track.kind === "video" : false));
                sender.replaceTrack(myscreenshare.getVideoTracks()[0]);
            }
            myscreenshare.getVideoTracks()[0].enabled = true;
            const newStream = new MediaStream([
                myscreenshare.getVideoTracks()[0], 
            ]);
            myvideo.srcObject = newStream;
            myvideo.muted = true;
            mystream = newStream;
            screenShareButt.innerHTML = (screenshareEnabled 
                ? `<i class="fas fa-desktop"></i><span class="tooltiptext">Stop Share Screen</span>`
                : `<i class="fas fa-desktop"></i><span class="tooltiptext">Share Screen</span>`
            );
            myscreenshare.getVideoTracks()[0].onended = function() {
                if (screenshareEnabled) screenShareToggle();
            };
        })
        .catch((e) => {
            alert("Unable to share screen:" + e.message);
            console.error(e);
        });
}

//screen sharing feature ends


cutCall.addEventListener('click', () => {
    location.href = '/';
})





//sharing screen to recorder

function shareScreen() {
    if ( this.userMediaAvailable() ) {
        recordedStream =  navigator.mediaDevices.getDisplayMedia( { 
            video: true,
            audio: true
        } );

        return recordedStream;
    }

    else {
        throw new Error( 'User media not available' );
    }
}

function userMediaAvailable() {
    return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
}


//record entire screen feature starts here

const recordScreenBtn = document.querySelector('.record-screen');
let isScreenRecording = false;

recordScreenBtn.addEventListener("click", (e) => {
    if (isScreenRecording) {
        recordScreenBtn.innerHTML = `<i class="fas fa-record-vinyl"></i><span class="tooltiptext">Record Entire Screen</span>`;
        recordScreenBtn.style.color = "#9958e6";
        isScreenRecording=false;
        stopRecording();
    } 
    else {
        shareScreen().then( ( screenStream ) => {
            startRecording( screenStream ); 
            isScreenRecording=true;
            recordScreenBtn.innerHTML = (isScreenRecording 
                ? `<i class="fas fa-record-vinyl"></i><span class="tooltiptext">Stop Recording</span>`
                : `<i class="fas fa-record-vinyl"></i><span class="tooltiptext">Record Entire Screen</span>`
            );
            recordScreenBtn.style.color = (isScreenRecording 
                ? "red"
                : "#9958e6"
            );
            screenStream.getVideoTracks()[0].onended = function() {
                if (isScreenRecording){
                    isScreenRecording=false;
                    recordScreenBtn.innerHTML = `<i class="fas fa-record-vinyl"></i><span class="tooltiptext">Record Entire Screen</span>`;
                    recordScreenBtn.style.color = "#9958e6";
                }
            };  
        })
        .catch((e) => {
            alert("Unable to record screen:" + e.message);
            console.error(e);
        });       
    }
});

//record-my-stream feature starts here

const recordStreamBtn = document.querySelector('.record');
let isStreamRecording = false;

recordStreamBtn.addEventListener("click", (e) => {
    if (isStreamRecording) {
        recordStreamBtn.innerHTML = `<i class="fas fa-camera"></i><span class="tooltiptext">Record Your Video</span>`;
        recordStreamBtn.style.color = "#9958e6";
        isStreamRecording=false;
        stopRecording();
    } else {
        recordStreamBtn.innerHTML = `<i class="fas fa-camera"></i><span class="tooltiptext">Stop Recording</span>`;
        recordStreamBtn.style.color = "red";
        isStreamRecording=true;
        startRecording(mystream);
    }
});


  
 //Start Recording

  function startRecording(stream) {
    recordedBlobs = [];
    let options = { mimeType: "video/webm;codecs=vp9,opus" };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: "video/webm;codecs=vp8,opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: "video/webm" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = { mimeType: "audio/webm" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not supported`);
            options = { mimeType: "" };
          }
        }
      }
    }
  
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (err) {
      console.error("Exception while creating MediaRecorder:", err);
      alert(err);
      return;
    }
  
    console.log("Created MediaRecorder", mediaRecorder, "with options", options);
    mediaRecorder.onstop = (event) => {
      console.log("MediaRecorder stopped: ", event);
      console.log("MediaRecorder Blobs: ", recordedBlobs);

      downloadRecordedStream();

    };
  
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log("MediaRecorder started", mediaRecorder);
}
  
//Stop recording

function stopRecording() {
    mediaRecorder.stop();
}
  
  
//handling data

function handleDataAvailable(event) {
    console.log("handleDataAvailable", event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
}
  
//Download recorded stream

function downloadRecordedStream() {
    try {
      const blob = new Blob(recordedBlobs, { type: "video/webm" });
      const recFileName = getDataTimeString() + "-REC.webm";
      const blobFileSize = bytesToSize(blob.size);


  
      // save the recorded file to device
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = recFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
    catch (err) {
      alert(err);
    }
}

function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0];
    return `${date}-${time}`;
}

function bytesToSize(bytes) {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}




// mute / hide everyone's Incoming Stream for you only

const muteEveryoneBtn = document.querySelector('.mute-everyone');
const hideEveryoneBtn = document.querySelector('.hide-everyone');

let ishidden = 0;
let ismuted = 0;

muteEveryoneBtn.addEventListener('click', () => {
    if(ismuted==0){
        ismuted = 1;
        muteEveryoneBtn.innerHTML = `<i class="fas fa-microphone-slash"></i><span class="tooltiptext">Unmute Incoming Audios</span>`;
        muteEveryoneBtn.style.color = "red";
        for(let i=0; i<streams.length; i++){
            streams[i].getAudioTracks()[0].enabled = false;
        }
    }
    else{
        ismuted = 0;
        muteEveryoneBtn.innerHTML = `<i class="fas fa-microphone-slash"></i><span class="tooltiptext">Mute Incoming Audios</span>`;
        muteEveryoneBtn.style.color = "#9958e6";
        for(let i=0; i<streams.length; i++){
            streams[i].getAudioTracks()[0].enabled = true;
        }
    }
});

hideEveryoneBtn.addEventListener('click', () => {
    if(ishidden==0){
        ishidden = 1;
        hideEveryoneBtn.innerHTML = `<i class="fas fa-video-slash"></i><span class="tooltiptext">Unhide Incoming Vedios</span>`;
        hideEveryoneBtn.style.color = "red";
        for(let i=0; i<streams.length; i++){
            streams[i].getVideoTracks()[0].enabled = false;
        }
    }
    else{
        ishidden = 0;
        hideEveryoneBtn.innerHTML = `<i class="fas fa-video-slash"></i><span class="tooltiptext">Hide Incoming Vedios</span>`;
        hideEveryoneBtn.style.color = "#9958e6";
        for(let i=0; i<streams.length; i++){
            streams[i].getVideoTracks()[0].enabled = true;
        }
    }
});



