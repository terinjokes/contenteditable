
// https://github.com/terinjokes/contenteditable
var Editable = require("../index.js"); // require("contenteditable")

var setup = function(){

    var el = document.querySelector('#edit');

    ed = Editable(el);

    ed.on("enable", function(){
        console.log("enable");
    });
    ed.on("disable", function(){
        console.log("disable");
    });
    ed.on("state", function(ev){
        console.log("state", ev.type, Object.prototype.toString.call(ev).slice(8,-1));
    });
    ed.on("change", function(ev){
        console.log("change", ev.type, Object.prototype.toString.call(ev).slice(8,-1));
    });

    ed.enable();


    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            console.log("mutate", mutation.type);
        });    
    });
    
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    
    observer.observe(el, config);
    
    // observer.disconnect();
};

document.addEventListener("DOMContentLoaded", function(event) {
    setup();
});

 
