// contact: gmeetmeat@gmail.com
// thanks for reviewing my extension


// CSS
$.get(chrome.runtime.getURL('/header.html'), function(data) {
    $($.parseHTML(data))
        .appendTo('head');
});
// Load top-left bar
$.get(chrome.runtime.getURL('/navigation.html'), function(data) {
    $($.parseHTML(data))
        .appendTo('body');
});


var muteID = '[jsname="BOHaEe"]';
var chatID = '[jscontroller="pxq3x"]';
var joinID = '[jsname="Qx7uuf"]';
var readyThingyIDK = ".qIHHZb";
var readyJoinID = ".Jyj1Td";
var noVideoID = '[jsname="R3GXJb"]';
var endCallID = '[jsname="CQylAd"]';
var chatBtnID = '[aria-label="Chat with everyone"]';
var captionID = '[jsname="r8qRAd"]';
var chatBtnID = '[aria-label="Chat with everyone"]';
var gmmPreferences;
var gmmJoined = false;


// Wait until the document is fully loaded before running the main function.
document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        onPageLoad();
    }
};


// These two functions are tied to a click listener.
function gmmInfoIcon() {
    var gmmInfo = document.getElementById("gmmInfo");
    gmmSet(gmmInfo);
}

function gmmSettingsIcon() {
    var gmmInfo = document.getElementById("gmmSettings");
    gmmSet(gmmInfo);
}

function gmmSet(gmmExpandable) {
    if (gmmExpandable.style.display == "block" || gmmExpandable.style.display == "inline-block") {
        gmmExpandable.style.display = "none";
        return;
    }
    var gmmInfo = document.getElementById("gmmInfo");
    var gmmSettings = document.getElementById("gmmSettings");
    gmmInfo.style.display = "none";
    gmmSettings.style.display = "none";
    if (gmmExpandable == gmmSettings) {
        gmmSettings.style.display = "inline-block";
        return;
    }
    gmmExpandable.style.display = "block";
}


function keyDown(e) {
            if(!gmmJoined || chatExists()){
                return;
            }
            var enable = gmmPreferences["pushTalk"];
            var muteBtn = document.querySelector(muteID);
            var turnedOn = muteBtn.getAttribute("data-is-muted");
            if(e.keyCode == 16){
                if(turnedOn === "false"){
                    return;
                }
                if(gmmJoined === true && turnedOn === "true" && enable){
                    muteBtn.click();
                }
            }
            else{
                var x = gmmPreferences["leaveinp"].toUpperCase();
                var charCode = x.charCodeAt(0);
                if (e.ctrlKey && e.keyCode == charCode && gmmPreferences["leavecut"] == true) {
                    document.querySelector(endCallID)
                        .click();
               }
            }

        
}

function keyUp(e){
    if(!gmmJoined || chatExists()){
        return;
    }
    var enable = gmmPreferences["pushTalk"];
    muteBtn = document.querySelector(muteID);
    var turnedOn = muteBtn.getAttribute("data-is-muted");
    if(turnedOn === "true" || enable === false){
        return;
    }
    else if (e.keyCode === 16 && gmmJoined === true) {  
            muteBtn.click();
    }
}

function checkBoxPTT(){
    var PTTcheck = document.getElementById("gmmPushTalk");
    if(gmmPreferences["pushTalk"]){
        PTTcheck.checked = true;
    }
    else{
        PTTcheck.checked = false;
    }
    PTTcheck.addEventListener("click", function() {
        if (PTTcheck.checked === true) {
            gmmPreferences["pushTalk"] = true;
        } else {
            gmmPreferences["pushTalk"] = false;
        }
        savePrefs();
    });
}
function onPageLoad() {
    setInterval(function() {
        // Show arc.io logo.
        document.getElementById("gmmArcio")
            .scrollTop = 545;
    }, 1000);

    // Get user's preferences.
    chrome.storage.sync.get("7793A417", function(items) {
        if (!chrome.runtime.error) {
            if (Object.keys(items)
                .length === 0) {
                gmmPreferences = {
                    join: false,
                    mute: false,
                    novideo: false,
                    captions: false,
                    chat: false,
                    emoji: false,
                    emojis: "😄😅😉😋🤐😑😶😏",
                    mirror: false,
                    leavecut: false,
                    pushTalk: false,
                    leaveinp: "B"
                };
                savePrefs();
            } else {
                gmmPreferences = items["7793A417"];
            }
            // Register the checkboxes.
            regChk("gmmAutoCaptions", "captions", autoCaptions, true);
            regChk("gmmAutoDisabledVideo", "novideo", autoNoVideo, false);
            regChk("gmmAutoMute", "mute", autoMute, false);
            regChk("gmmAutoJoin", "join", autoJoin, false);
            regChk("gmmEmojis", "emoji", injectEmoji, true, displayEmojiBar);
            regChk("gmmAutoChat", "chat", autoChat, true);
            regChk("gmmMirrorVideo", "mirror", mirrorVideo, false);
            checkBoxPTT();
            // Register the inputs.
            regInp("emojiList", "emojis", function() {
                gmmPreferences["emojis"] = this.value;
                if (chatExists()) {
                    injectEmoji();
                }
                savePrefs();
            });
            regInp("meetLeaveShortcutInput", "leaveinp", function() {
                gmmPreferences["leaveinp"] = this.value;
                savePrefs();
            });
            regChk("gmmLeaveMeet", "leavecut", undefined, true, displayLeaveMeetSht);
            // Set interval continually check every 0.25 seconds if the necessary buttons are loaded before pressing them.
            waitForElement(muteID, autoMute);
            waitForElement(noVideoID, autoNoVideo);
            waitForElements(joinID, readyJoinID, readyThingyIDK, autoJoin);
            waitForElement(endCallID, onMeetJoin);
            waitForElement(chatBtnID, autoChat);
            waitForElement(captionID, autoCaptions)
            setInterval(mirrorVideo, 1000);
            document.addEventListener("keydown", keyDown, false);
            document.addEventListener("keyup", keyUp, false);
            // Let the user interact
            document.getElementById("gmmInfoIcon")
                .addEventListener("click", gmmInfoIcon);
            document.getElementById("gmmSettingsIcon").addEventListener("click", gmmSettingsIcon);

            const myTimeout = setTimeout(autoJoin, 1000);
        } else {
            alert("An error has occurred while trying to load the extension preferences. Please contact the developer at gmeetmeat@gmail.com with information on what you were doing when this error happened.");
        }
    });
}

function pushTalkFunc(x){
    console.log(x);
}
function injectEmoji(y){
    console.log(y);
}
/*Clear the remote settings -- for debugging:
        chrome.storage.sync.clear("7793A417", function() {
            if (chrome.runtime.error) {
                console.log("Error while attempting to clear preferences.");
            }
        });*/


// Function to register inputs. This sets the input to the setting in the preferences, and adds an input event listener so that we can detect changes.
function regInp(inputElem, configSetting, functionToCall) {
    var emojiList = document.getElementById(inputElem);
    emojiList.value = gmmPreferences[configSetting];
    emojiList.addEventListener('input', functionToCall);
}


// Register checkboxes
function regChk(string, prefID, toCall, needsWait, displayFunc) {
    // String -- ID of element.
    // prefID -- config setting.
    // toCall -- function to be called 1) if it exists and 2) if either needsWait is false, or the user has joined the Meet.
    // needsWait -- do you need to wait for the Meet to be joined to execute this function?
    // displayFunc -- Used to allow expandable menus. If displayFunc(true) is called, an element will be shown; if displayFunc(false) is used, it will be hidden.
    var elem = document.getElementById(string);
    if (gmmPreferences[prefID] == true) {
        elem.checked = true;
        if (displayFunc) displayFunc(true);
    } else {
        elem.checked = false;
        if (displayFunc) displayFunc(false);
    }

    elem.addEventListener("click", function() {
        if (document.getElementById(string)
            .checked) {
            gmmPreferences[prefID] = true;
            if (displayFunc) displayFunc(true);
        } else {
            gmmPreferences[prefID] = false;
            if (displayFunc) displayFunc(false);
        }
        savePrefs();
        if ((!needsWait || gmmJoined) && toCall) toCall();
    });
}


function displayEmojiBar(display) {
    gmmHideElem("emojiTableEncapsulated", display);
}


function gmmHideElem(elemID, display) {
    var toHide = document.getElementById(elemID);
    if (display) {
        toHide.style.display = 'block';
    } else {
        toHide.style.display = 'none';
    }
}


function displayLeaveMeetSht(display) {
    gmmHideElem("meetLeaveShortcut", display);
}


function savePrefs() {
    chrome.storage.sync.set({
        "7793A417": gmmPreferences
    }, function() {
        if (chrome.runtime.error) {
            console.log("Error while attempting to save preferences.");
        }
    });
}


function onMeetJoin() {
    gmmJoined = true;
    document.querySelector(chatBtnID)
        .addEventListener("click", injectEmoji);
}


// Mirror all video in the Meet.
function mirrorVideo() {
    if (!gmmElementExists('[jsname="CQylAd"]')) {
        gmmJoined = false;
    } else {
        gmmJoined = true;
    }
    var videos = document.getElementsByTagName('video');
    if (gmmPreferences["mirror"] == false) {
        var rotateSelf = "";
        var rotateOthers = "";
    } else {
        var rotateSelf = "rotateY(0deg)";
        var rotateOthers = "rotateY(180deg)";
    }
    for (let item of videos) {
        if (item.classList.contains('Gv1mTb-PVLJEc')) {
            item.style["-webkit-transform"] = rotateSelf;
            item.style["transform"] = rotateSelf;
        } else {
            item.style["-webkit-transform"] = rotateOthers;
            item.style["transform"] = rotateOthers;
        }
    }
}

function autoMute() {
    var enable = gmmPreferences["mute"];
    var muteBtn = document.querySelector(muteID);
    var turnedOn = muteBtn.getAttribute("data-is-muted");
    if (turnedOn == "false" && enable) {
        muteBtn.click();
    } else if (turnedOn == "true" && !enable) {
        muteBtn.click();
    }
}


function autoNoVideo() {
    var enable = gmmPreferences["novideo"];
    var noVideoBtn = [].slice.call(document.querySelectorAll(muteID))
        .pop();
    var turnedOn = noVideoBtn.getAttribute("data-is-muted");
    if (turnedOn == "false" && enable) {
        noVideoBtn.click();
        mirrorVideo();
    } else if (turnedOn == "true" && !enable) {
        noVideoBtn.click();
        mirrorVideo();
    }
}


function autoJoin() {
    var enable = gmmPreferences["join"];
    var joinBtn = document.querySelector(joinID);
    if (enable && joinBtn) joinBtn.click();
}


function autoCaptions() {
    var captionBtn = document.querySelector(captionID);
    var enable = gmmPreferences["captions"];
    var turnedOn = captionBtn.getAttribute("aria-pressed");
    if (enable === true && turnedOn === "false") captionBtn.click();
    if (enable === false && turnedOn === "true") captionBtn.click();
}


function autoChat() {
    var chatBtn = document.querySelector(chatBtnID);
    var enable = gmmPreferences["chat"];
    var turnedOn = chatBtn.getAttribute("aria-pressed");
    if (enable === true && turnedOn === "false") chatBtn.click();
    if (enable === false && turnedOn === "true") chatBtn.click();
}


function chatExists() {
    var chatBtn = document.querySelector(chatBtnID);
    var turnedOn = chatBtn.getAttribute("aria-pressed");
    if(turnedOn === "true"){
        turnedOn = true;
    }
    else{
        turnedOn = false;
    }
    return turnedOn;
}


function waitForElement(string, callback) {
    waitForElementSpecify(string, callback, 250);
}


function waitForElementSpecify(string, callback, millis) {
    var waitFor = setInterval(function() {
        if (gmmElementExists(string)) {
            clearInterval(waitFor);
            callback();
        }

    }, millis);
}


function gmmElementExists(query) {
    if (document.querySelectorAll(query)
        .length > 0) {
        return true;
    } else {
        return false;
    }
}


function waitForElements(string, string2, string3, callback) {
    var completed = false;
    var waitFor = setInterval(function() {
        if (document.querySelectorAll(string)
            .length > 0 && document.querySelectorAll(string2)
            .length > 0 && document.querySelectorAll(string3)
            .length > 0) {
            callback();
            completed = true;
        } else if (completed) {
            clearInterval(waitFor);
        }
    }, 250);
}