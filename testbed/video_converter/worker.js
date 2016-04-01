'use strict';

importScripts('./ffmpeg-all-codecs.js');
//importScripts('./ffmpeg.js');

function print(text) {
    postMessage({
        type: "stdout",
        data: text
    });
}

function error(e) {
    postMessage({
        type: "error",
        data: e
    });
}

function runCommand(file, args) {
    var printedData = [];
    
    file = file || null;
    args = args || [];
    
    var printFn = function(text) {
        printedData.push(text);
        print(text);
    }
    
    var Module = {
        fileData: null !== file ? file.data : null,
        fileName: null !== file ? file.name : null,
        arguments: args,
        print: printFn,
        printErr: printFn,
        TOTAL_MEMORY: 83886080
        //TOTAL_MEMORY: 268435456
    };
                    
    postMessage({
        type: "command_start"
    });
        
    try {
        var result = ffmpeg_run(Module);
        postMessage({
            type: "command_done",
            status: "success",
            result: result,
            printedData: printedData.join("")
        });   
   } catch (e) {
       error(e);
   }
    
  
}

onmessage = function(event) {
    var message = event.data;
    
    if ('command' === message.type) {        
        var args = [];
        var commandName = message.commandName;
        
        if ('help' === commandName) {
            args = ["-h"];
        } else if ('get_metadata' === commandName) {
            args = ["-i", message.file.name, "output_file.mp4"];
        } else if ('get_thumbnails' === commandName) {
            args = ["-ss", "00:00:03.010",
                    "-i", message.file.name,
                    //"-vf", "select='not(mod(n,60))',setpts='N/(30*TB)'",
                    "-s", "320x200",
                    "-vframes", "1",
                    "-v", "verbose",
                    "-an", // Don't need audio
                    "thumb%d.jpeg"];
        } else if ('convert_video' === commandName) {
            //ffmpeg -i "Swim Video Intro.mov" -codec:v libx264 -profile:v baseline -preset fast -b:v 500k -maxrate 500k -bufsize 1000k -vf scale=-2:480 -threads 0
            // -codec:a aac -b:a 64k -pix_fmt yuv420p output_file.mp4
            //scale=-2:240
            //-b:v = 500k
            //-maxrate = 500k
            //bufsize = 1000k
            args = ["-i", message.file.name, 
                    "-codec:v", "libx264", 
                    "-profile:v", "baseline",
                    "-preset", "veryfast",
                    "-crf", "23",
                    "-b:v", "128k", 
                    "-maxrate", "128k", 
                    "-bufsize", "256k", 
                    "-vf", "showinfo,scale=320:200", 
                    "-v", "verbose",
                    "-threads", "0", 
                    "-codec:a", "aac",
                    "-b:a", "64k",
                    "-pix_fmt", "yuv420p",
                    "-strict", "experimental",
                    "-an", // Don't need audio
                    "-speed", "8",
                    "output_file.mp4"];
        }
        
        runCommand(message.file, args);
    }
}

postMessage({
    type: 'ready'
});