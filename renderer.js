// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer;
const escr = require('electron').screen;
const remote = require('electron').remote;

var imgElement = document.getElementsByTagName('img')[0];
imgElement.onload = function() {
    //alert('new-image called, img width/height=' + [imgElement.naturalWidth,imgElement.naturalHeight].toString());
    remote.getCurrentWindow().setSize(imgElement.width,imgElement.height);
}

var settings = {
    opacityOut: 300,
    opacityIn: 100,
    cooldown: 2000
};

ipc.on('new-image',function(event,arg) {
    imgElement.src = arg;
});

ipc.on('plus-cooldown',function(event,arg) {
    settings["cooldown"] += 200;
});

ipc.on('minus-cooldown',function(event,arg) {
    if(settings["cooldown"] > 0) {
        settings["cooldown"] -= 200;
    }
});

ipc.on('plus-time',function(event,arg) {
    settings["opacityOut"] += 100;
});

ipc.on('minus-time',function(event,arg) {
    if(settings["opacityOut"] > 0) {
        settings["opacityOut"] -= 100;
    }
});

function moveToRandomPosition () {
    var size = escr.getPrimaryDisplay().size

    document.getElementsByTagName('img')[0].style.opacity = 0;
    setTimeout(function(){
        ipc.send('window-move',[Math.round(Math.random() * (size.width - imgElement.width)),Math.round(Math.random() * (size.height - imgElement.height))])
        document.getElementsByTagName('img')[0].style.opacity = 1;
        setTimeout(function(){
            document.getElementsByTagName('img')[0].style.opacity = 0;
        },settings["opacityOut"]);
    },settings["opacityIn"])

    setTimeout(moveToRandomPosition,(Math.random() * settings["cooldown"]) + (settings["opacityOut"] + settings["opacityIn"]));
}

setTimeout(moveToRandomPosition, 1000);