let settings = {
  characterMouthClosed: '',
  characterMouthOpen: '',
  backgroundColor: '#00FF00',
  voiceThreshold: 50,
  volumeInterval: 200,
  darkMode: true,
  bounceOnSpeech: false,
};

const settingMouthClosed = document.querySelector('#setting-char-mouth-closed');
const settingMouthOpen = document.querySelector('#setting-char-mouth-open');
const settingBackgroundColor = document.querySelector('#setting-background-color');
const settingVoiceThreshold = document.querySelector('#setting-voice-threshold');
const settingVolumeInterval = document.querySelector('#setting-volume-interval');
const settingDarkMode = document.querySelector('#setting-dark-mode');
const settingBounceOnSpeech = document.querySelector('#setting-bounce-on-speech');

const thresholdValue = document.querySelector('#threshold-value');
const intervalValue = document.querySelector('#interval-value');

const characterArea = document.querySelector('#character-area');
const characterContainer = document.querySelector('#character-container');
const character = document.querySelector('#character');
const characterOpen = document.querySelector('#character-open');
const saveBtn = document.querySelector('#save-settings');

const start = document.querySelector('#start-movement');
const stop = document.querySelector('#stop-movement');
const appStatus = document.querySelector('#app-status');

const micStatusText = document.querySelector('#mic-status');
let intervalID = null;
let intervalFunc = null;
let speechActive = false;

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
  settingBounceOnSpeech.checked = settings.bounceOnSpeech;

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
};

settingVoiceThreshold.addEventListener('change', (e) => {
  thresholdValue.textContent = e.target.value;
});

settingVolumeInterval.addEventListener('change', (e) => {
  intervalValue.textContent = e.target.value;
});

saveBtn.addEventListener('click', () => {
  const newSettings = {
    characterMouthClosed: settingMouthClosed.value,
    characterMouthOpen: settingMouthOpen.value,
    backgroundColor: settingBackgroundColor.value,
    voiceThreshold: settingVoiceThreshold.value,
    volumeInterval: settingVolumeInterval.value,
    darkMode: settingDarkMode.checked,
    bounceOnSpeech: settingBounceOnSpeech.checked,
  };

  localStorage.setItem('png-tuber-settings', JSON.stringify(newSettings));
  readSettings();
});

readSettings();

const getAverageVolume = (bytes) => {
  let values = 0;

  const { length } = bytes;

  for (let i = 0; i < length; i++) {
    values += bytes[i];
  }

  return values / length;
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then((stream) => {
    micStatusText.textContent = '';

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
      const volume = getAverageVolume(volumeData);

      if (volume >= settings.voiceThreshold) {
        if (speechActive) {
          return;
        }

        if (settings.bounceOnSpeech) {
          characterContainer.classList.add('bounce');
        }

        character.classList.add('hidden');
        characterOpen.classList.remove('hidden');
        speechActive = true;
      } else {
        if (!speechActive) {
          return;
        }

        character.classList.remove('hidden');
        characterOpen.classList.add('hidden');
        speechActive = false;
      }
    };
  })
  .catch((err) => {
    micStatusText.textContent = 'Failed to capture microphone audio :/ Make sure to give permission for this site to use the microphone!';
    micStatusText.style.color = 'red';
    console.error(err);
  });

characterContainer.addEventListener('animationend', (e) => {
  e.target.classList.remove('bounce');
});

start.addEventListener('click', () => {
  intervalID = setInterval(intervalFunc, 100);
  appStatus.textContent = 'Running';
});

stop.addEventListener('click', () => {
  clearInterval(intervalID);
  appStatus.textContent = 'Stopped';
});
