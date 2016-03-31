'use strict';

var worker = null;

var currentFile = null;

var currentJobIndex = 0;

var metadataJobId = null;
var thumbnailJobId = null;
var convertJobId = null;

var fileReader = new FileReader();

var emptyVideo = {
    creationTime: "",
    title: "",
    description: "",
    duration: "",
    bitrate: "",
    streams: []
};

var currentVideo = null;

var videoInfoRegularExpressions = [
    {
        //ffmpeg version 2.2.1 Copyright (c) 2000-2014 the FFmpeg developers
        message: "Loading metadata...",
        regex: /\s*ffmpeg\s+version\s+\d+.\d+.\d+\s+Copyright\s+\(c\)\s+\d+\-\d+\s+the\s+FFmpeg\s+developers/,
    },
    {
        regex: /\s*configuration:\s*.*/
    },
    {
        regex: /\s*libavutil/
    },
    {
        regex: /\s*libavcodec/
    },
    {
        regex: /\s*libavformat/
    },       
    {
        regex: /\s*libavdevice/
    },
    {
        regex: /\s*libavfilter/  
    },
    {
        regex: /\s*libswscale/
    },
    {
        regex: /\s*libswresample/
    },
    {
        regex: /\s*libpostproc/
    },
    {
        regex: /\s*Input\s*#0/
    },
    {
        //ffmpeg version 2.2.1 Copyright (c) 2000-2014 the FFmpeg developers
        message: "Loading thumbnails...",
        regex: /\s*ffmpeg\s+version\s+\d+.\d+.\d+\s+Copyright\s+\(c\)\s+\d+\-\d+\s+the\s+FFmpeg\s+developers/,
    },
    {
        regex: /\s*configuration:\s*.*/
    },
    {
        regex: /\s*libavutil/
    },
    {
        regex: /\s*libavcodec/
    },
    {
        regex: /\s*libavformat/
    },       
    {
        regex: /\s*libavdevice/
    },
    {
        regex: /\s*libavfilter/  
    },
    {
        regex: /\s*libswscale/
    },
    {
        regex: /\s*libswresample/
    },
    {
        regex: /\s*libpostproc/
    },
    {
        regex: /\s*Input\s*#0/
    },
    {
        regex: /\s*Output\s*#0/
    },
    {
        regex: /Stream\s*mapping:/
    },
    {
        regex: /Press \[q\] to stop/
    }
];

var videoInfoProgressIndex = 0;

var cleanConversionProgressStatus = {
    totalFrames: 0,
    totalDuration: "",
    progress: 0
};

var conversionRegularExpressions = [
    {
        regex: /\s*Input\s*#0/
    },
    {
        regex: /\s*Duration:\s*(\d{2}:\d{2}:\d{2}.\d{2}),\s*/
    },
    {
        regex: /\s*Stream\s*#\d+\:\d+\(.*\):\s*Video:\s*[^,]*,/
    }
];

var currentConversionInfoIndex = 0;

var currentConversionProgressStatus = null;

function round(n, places) {
    return +n.toFixed(places)
}

function checkVideoInfoProgress(data) {
    var regexArray = videoInfoRegularExpressions;
    
    while (true) {
        if (videoInfoProgressIndex === videoInfoRegularExpressions.length) {
            break;
        }
        
        var match = data.match(regexArray[videoInfoProgressIndex].regex);
    
        if (match) {
            console.log(regexArray[videoInfoProgressIndex].regex);
            var message = regexArray[videoInfoProgressIndex].message;
            videoInfoProgressIndex++;
            setLoadingProgress(round(100 * (videoInfoProgressIndex / videoInfoRegularExpressions.length), 0), message);
        } else {
            break;
        }   
    }
}

function checkConversionProgress(data) {
    if (currentConversionInfoIndex < 3) {
        var match = data.match(conversionRegularExpressions[currentConversionInfoIndex].regex);
        
        console.log(data, conversionRegularExpressions[currentConversionInfoIndex].regex);
        if (match) {
            console.log(match);
            if (2 === currentConversionInfoIndex) {
                var fpsRegex = /([0-9.]+)\s*fps/;
                
                var fpsMatch = data.match(fpsRegex);
                
                if (fpsMatch &&
                    2 === fpsMatch.length) {
                    currentConversionProgressStatus.totalFrames = 
                        fpsMatch[1] * (videoTimeStringToMs(currentConversionProgressStatus.totalDuration) / 1000);
                } else {
                    throw new Error("Invalid fps match!");
                }
                
                // Get total number of frames
            } else if (1 === currentConversionInfoIndex) {
                // Get duration
                if (2 === match.length) {
                    currentConversionProgressStatus.totalDuration = match[1];
                } else {
                    throw new Error("Invalid duration match!");
                }
            }
            currentConversionInfoIndex++;
        }
    } else {
        console.log(currentConversionProgressStatus);
        
        // So ffmpeg prints out two different things during conversion...
        // Not sure entirely why, but we need to check them both and get
        // an accurate progress.  If whatever we calculate is less than the current
        // progress, we ignore it, otherwise we set the current progress to that value.
        
        var currentFrameRegex1 = /^\s*frame\s*=\s*(\d+)/; //frame=  361 fps=4.0 q=29.0 size=     193kB time=00:00:11.67 bitrate= 135.2kbits/s
        var currentFrameRegex2 = /^\s*n\s*:\s*(\d+)/; //n:359 pts:359359 pts_time:11.9786 pos:192696560 fmt:yuv422p10le sar:1/1 s:1920x1080 i:P iskey:1 type:I checksum:3DF6C258 plane_checksum:[790F76A7 3002A5D1 3002A5D1]
        // Check progress updates
        
        var currentFrameMatch1 = data.match(currentFrameRegex1);
        var currentFrameMatch2 = data.match(currentFrameRegex2);
        
        var progress = 0;
        
        if (currentFrameMatch1) {
            progress = round((currentFrameMatch1[1] / currentConversionProgressStatus.totalFrames) * 100, 0);
        } else if (currentFrameMatch2) {
            progress = round((currentFrameMatch2[1] / currentConversionProgressStatus.totalFrames) * 100, 0);
        }
        if (progress >= currentConversionProgressStatus.progress) {
            currentConversionProgressStatus.progress = progress;
            setLoadingProgress(progress);
        }
    }
}

/*
/*
creation_time : 2016-02-18 12:45:30 
title : Swim Video Intro 
description : Intro to the swim videos 
Duration: 00:00:12.05, 
start: 0.000000, 
bitrate: 128012 kb/s 
Stream #0:0(eng): 
    Audio: pcm_s16be (twos / 0x736F7774), 48000 Hz, stereo, s16, 1536 kb/s (default) 
    Metadata: 
        creation_time : 2016-02-18 12:45:30 
        handler_name : Core Media Data Handler 
Stream #0:1(und): 
    Video: prores (apcn / 0x6E637061), yuv422p10le, 1920x1080, 126473 kb/s, SAR 1:1 DAR 16:9, 29.97 fps, 29.97 tbr, 30k tbn, 30k tbc (default) 
    Metadata: 
        creation_time : 2016-02-18 12:45:30 
        handler_name : Core Media Data Handler 
        timecode : 00:00:00:00 
Stream #0:2(und): 
    Data: none (tmcd / 0x64636D74), 0 kb/s (default) 
    Metadata: 
        creation_time : 2016-02-18 12:45:30 
        handler_name : Core Media Data Handler 
        timecode : 00:00:00:00

*/

function parseVideoTimeString(timeString) {
    var timeData = timeString.match(/(\d{2}):(\d{2}):(\d{2}).(\d{2})/);
    
    var returnValue = {
        hour: "0",
        minute: "0",
        second: "0",
        fraction: "0"
    }
    
    if (timeData &&
        5 === timeData.length) {
        returnValue.hour = timeData[1];
        returnValue.minute = timeData[2];
        returnValue.second = timeData[3];
        returnValue.fraction = timeData[4];
    }
    
    return returnValue;
}

function videoTimeStringToMs(timeString) {
    var timeData = parseVideoTimeString(timeString);
    
    var msPerHour = 1000 * 60 * 60;
    var msPerMinute = 60 * 1000;
    var msPerSecond = 1000;
    
    return (timeData.hour * msPerHour) + (timeData.minute * msPerMinute) + (timeData.second * msPerSecond);
}


function parseProbeData(probeData) {
    var videoData = probeData.match(/creation_time\s*?:\s*?(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\s*?title\s*?:\s*?(.+)\s+description/);//\s*?description\s*?:\s*?(.+)/ig);
    console.log(videoData);
    
    if (videoData &&
        3 === videoData.length) {
        currentVideo.creationTime = videoData[1];
        currentVideo.title = videoData[2];
    }
    
    var durationData = probeData.match(/Duration: (\d{2}:\d{2}:\d{2}.\d{2}), start: [\d\.]+, bitrate: (\d+ kb\/s|N\/A)/);
    console.log(durationData);
    
    if (durationData &&
        3 === durationData.length) {
        currentVideo.duration = durationData[1];
        currentVideo.bitrate = durationData[2];
    }
}

function initWorker(filename) {
    worker = new Worker(filename);
    
    worker.onmessage = function(event) {
        var message = event.data;     
        if ('ready' === message.type) {
            $("div.loading").css('display', 'none');
            $("div.interface").css('display', 'block');
        } else if ('stdout' === message.type) {
            console.log(message.data);  
            
            if (metadataJobId === message.id) {
                checkVideoInfoProgress(message.data);
            } else if (thumbnailJobId === message.id) {
                checkVideoInfoProgress(message.data);
            } else if (convertJobId === message.id) {
                checkConversionProgress(message.data);
            }
        } else if ('error' === message.type) {
            alert("ERROR!");
        } else if ('command_start' === message.type) {
            if (metadataJobId === message.id) {
                videoInfoProgressIndex = 0;
                showLoadingBar("./swim.png", "Loading metadata...", 256, 64);
            } else if (thumbnailJobId === message.id) {
                
            } else if (convertJobId === message.id) {
                currentConversionInfoIndex = 0;
                currentConversionProgressStatus = cleanConversionProgressStatus;
                
                showLoadingBar('./swim.png', "Converting Video...", 256, 64);
            }
        } else if ('command_done' === message.type) {
            if (metadataJobId === message.id) {
                //parseProbeData(message.printedData);        
                thumbnailJobId = runCommand('get_thumbnails', currentFile);
            } else if (convertJobId === message.id) {
                var result = message.result;
                
                var file = result[0];
                currentVideo.newBlob = new Blob([new Uint8Array(file.data)], {type: 'video/mp4'});
                var newFile = URL.createObjectURL(currentVideo.newBlob);

                var $videoElement = $(".converted-video"); 
                $videoElement.css('display', 'block');
                
                $videoElement.get(0).addEventListener('loadeddata', function() {
                    URL.revokeObjectURL(newFile);
                }, false);
                
                $videoElement.get(0).src = newFile;
                
                hideLoadingBar();
            } else if (thumbnailJobId === message.id) {
                var result = message.result;
                
                $("div.video-information").find(".video-thumbnail").remove();
                for (var i = 0; i < result.length; i++) {  
                    var file = result[i];        
                    var newFile = URL.createObjectURL(new Blob([new Uint8Array(file.data)], {type: 'image/jpeg'}));
                    
                    var $imageElement = $("<img />");
                    
                    $imageElement.get(0).onload = function() {
                        URL.revokeObjectURL(newFile);
                    }
                    
                    $imageElement.addClass('video-thumbnail');
                    $imageElement.css('display', 'inline');
                    $imageElement.get(0).src = newFile;
                    
                    
                    $("div.video-information").append($imageElement);
                }
                
                hideLoadingBar();
                $(".convert-file").css('display', 'inline');
            }
        }
    }
}

function runCommand(commandName, file) {
    file = file || null;
    
    worker.postMessage({
        type: 'command',
        commandName: commandName,
        file: file,
        id: currentJobIndex
    });
    
    var returnValue = currentJobIndex;
    
    currentJobIndex += 1;
    
    return returnValue;
}

function showLoadingBar(imageSrc, text, width, height) {
   var $loadingBarContainer = $('.loading-bar-container');
   $loadingBarContainer.css('width', width + "px");
   $loadingBarContainer.css('height', height + "px");
   
   var $loadingBarOverlay = $('.loading-bar-overlay');
   $loadingBarOverlay.css('width', width + "px");
   $loadingBarOverlay.css('height', height + "px");
   
   var $loadingBarText = $('.loading-bar-text');
   $loadingBarText.css('width', width + "px");   
   
   var $loadingBarMessage = $('.loading-bar-message');
   $loadingBarMessage.html(text);
   
   var $loadingBarImage = $('.loading-bar-image');
   
   $loadingBarImage.get(0).addEventListener('load', function() {
       console.log("LOADED");
       $('.loading-bar').css('display', 'block');
       setLoadingProgress(0);
   });
   $loadingBarImage.get(0).removeAttribute('src');
   $loadingBarImage.get(0).src = imageSrc;
}

function hideLoadingBar() {
    $('.loading-bar').css('display', 'none');
}

function setLoadingProgress(progress, message) {
    //progress is between 0 and 100

    var width = $('.loading-bar-container').get(0).getBoundingClientRect().width;
    
    var $loadingBarOverlay = $('.loading-bar-overlay');
   
    $loadingBarOverlay.css('width', (width * (1 - progress / 100)) + "px");
    
    if (message) {
        var $loadingBarMessage = $('.loading-bar-message');
        $loadingBarMessage.html(message);
    }
    
    var $loadingBarProgress = $('.loading-bar-progress');
    $loadingBarProgress.html(progress + "%");
}

function setCurrentFile(file) {
    currentFile = file;
    currentVideo = emptyVideo;
    
   // currentVideo.oldBlob = new Blob([file.data]);

    metadataJobId = runCommand('get_metadata', currentFile);
}

function onConvertFileClicked() {
    convertJobId = runCommand('convert_video', currentFile);
}

function onFileInputChanged() {
    console.log("File input changed!", this);
    var $element = $(this);

    var finalFile = null;
    
    if (0 === this.files.length) {
        return; 
    }

    var file = this.files.item(0);
        
    fileReader.onprogress = function(e) {
        
    }
    
    fileReader.onload = function(e) {        
        setCurrentFile({
            name: file.name,
            data: new Uint8Array(e.target.result)
        })
    }
    
    fileReader.readAsArrayBuffer(file);
}

function loadVideoConverter() {
    $("div.loading").css('display', 'block');
    $("div.interface").css('display', 'none');
    
    /*showLoadingBar('./swim.png', "Loading website...", 256, 64);
    
    var loadingProgress = 0;
    var i = setInterval(function() {
        loadingProgress += 2;
        
        if (loadingProgress > 100) {
            clearInterval(i);
            hideLoadingBar();
        } else {
            setLoadingProgress(loadingProgress);
        }
        
    }, 30);*/
    initWorker("./worker.js");
}

function initDOM() {
    $(".file-picker").on('change', onFileInputChanged);    
    $(".convert-file").on('click', onConvertFileClicked);  
    
    $(".converted-video").css('display', 'none');
}

domready(function() {
    console.log("DOM IS READY!");
    
    initDOM();
    loadVideoConverter();
})