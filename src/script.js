let settings = {
    characterMouthClosed: '',
    characterMouthOpen: '',
    backgroundColor: '#00FF00',
    voiceThreshold: 50,
    volumeInterval: 200,
    darkMode: true,
};

let settingMouthClosed = document.querySelector('#setting-char-mouth-closed');
let settingMouthOpen = document.querySelector('#setting-char-mouth-open');
let settingBackgroundColor = document.querySelector('#setting-background-color');
let settingVoiceThreshold = document.querySelector('#setting-voice-threshold');
let settingVolumeInterval = document.querySelector('#setting-volume-interval');
let settingDarkMode = document.querySelector('#setting-dark-mode');

let thresholdValue = document.querySelector('#threshold-value');
let intervalValue = document.querySelector('#interval-value');

let characterArea = document.querySelector('#character-area');
let character = document.querySelector('#character');
let characterOpen = document.querySelector('#character-open');
let saveBtn = document.querySelector('#save-settings');

let start = document.querySelector('#start-movement');
let stop = document.querySelector('#stop-movement');
let appStatus = document.querySelector('#app-status');

let micStatusText = document.querySelector('#mic-status');
let intervalID = null;
let intervalFunc = null;

let charMouthClosed;
let charMouthOpen;

const readSettings = () => {
    const savedSettings = localStorage.getItem('png-tuber-settings');

    if (savedSettings) {
        settings = JSON.parse(localStorage.getItem('png-tuber-settings'));
    }

    settingMouthClosed.value = settings.characterMouthClosed;
    settingMouthOpen.value = settings.characterMouthOpen;
    settingBackgroundColor.value = settings.backgroundColor;
    settingVoiceThreshold.value = settings.voiceThreshold;
    settingVolumeInterval.value = settings.volumeInterval;
    settingDarkMode.checked = settings.darkMode;

    if (settings.darkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    thresholdValue.textContent = settingVoiceThreshold.value;
    intervalValue.textContent = settingVolumeInterval.value;

    charMouthClosed = settings.characterMouthClosed;
    charMouthOpen = settings.characterMouthOpen;

    character.setAttribute('src', charMouthClosed);
    characterOpen.setAttribute('src', charMouthOpen);
    characterArea.setAttribute('style', `background: ${settings.backgroundColor}`);
}

settingVoiceThreshold.addEventListener('change', e => {
    thresholdValue.textContent = e.target.value;
});

settingVolumeInterval.addEventListener('change', e => {
    intervalValue.textContent = e.target.value;
});

saveBtn.addEventListener('click', e => {
    let newSettings = {
        characterMouthClosed: settingMouthClosed.value,
        characterMouthOpen: settingMouthOpen.value,
        backgroundColor: settingBackgroundColor.value,
        voiceThreshold: settingVoiceThreshold.value,
        volumeInterval: settingVolumeInterval.value,
        darkMode: settingDarkMode.checked,
    };

    localStorage.setItem('png-tuber-settings', JSON.stringify(newSettings));
    readSettings();
});

readSettings();

const getAverageVolume = bytes => {
    var values = 0;
    var average;

    var length = bytes.length;

    for (var i = 0; i < length; i++) {
        values += bytes[i];
    }

    average = values / length;
    return average;
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
.then(stream => {
    micStatusText.textContent = "";

    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    const analyserNode = new AnalyserNode(audioContext, {
        fftSize: 2048,
        minDecibels: -127,
        maxDecibels: 0,
        smoothingTimeConstant: 0.5,
    });

    microphone.connect(analyserNode);

    const volumeData = new Uint8Array(analyserNode.frequencyBinCount);

    intervalFunc = () => {
        analyserNode.getByteFrequencyData(volumeData);
        let volume = getAverageVolume(volumeData);
        
        if (volume >= settings.voiceThreshold) {
            character.style.display = 'none';
            characterOpen.style.display = 'block';
        } else {
            character.style.display = 'block';
            characterOpen.style.display = 'none';
        }
    };
})
.catch(err => {
    micStatusText.textContent = "Failed to capture microphone audio :/ Make sure to give permission for this site to use the microphone!";
    micStatusText.style.color = 'red';
    console.error(err)
});

start.addEventListener("click", () => {
    intervalID = setInterval(intervalFunc, 100);
    appStatus.textContent = "Running";
});

stop.addEventListener("click", () => {
    clearInterval(intervalID);
    appStatus.textContent = "Stopped";
});
