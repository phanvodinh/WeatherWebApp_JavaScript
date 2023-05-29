const APP_ID = '0fb92edf1cc4e7821b9d9e08f0a90b23';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windspeed = document.querySelector('.wind-speed');


searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            console.log('[searchInput]', data);
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format("H:mm") || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format("H:mm") || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            windspeed.innerHTML = data.wind.speed || DEFAULT_VALUE;

        });
});

 // tro ly ao

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');
microphone.addEventListener('click', (e) => {
    e.preventDefault();
    recognition.start();
    microphone.classList.add('recording');


});
const speak = (text) => {

    if (synth.speaking) {
        console.error('busy');
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    }

    synth.speak(utter);
};


const handleVoice = (text) => {
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();

        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }

    if (handledText.includes(' đổi màu nền')) {
        const color = handledText.split('màu nền')[1].trim();
        const container = document.querySelector('.container');
        container.style.background = color;
        return;
    }
    if (handledText.includes('mấy giờ')) {
        const toSpeech = `${moment().hours()}hours ${moment().minutes()}minutes`;
        speak(toSpeech);
        return;
    }
    speak('dude please try again');
}
recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}
recognition.onerror = (err) => {
    console.log(err);
}
recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);

}

