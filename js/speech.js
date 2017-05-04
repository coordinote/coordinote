(function () {
    var recognition;
    var nowRecognition = false;
    var $finalSpan = document.querySelector('#final_span');
    var $interimSpan = document.querySelector('#interim_span');
    function start () {
        recognition = new webkitSpeechRecognition();
        recognition.lang = document.querySelector('#select').value;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = function (e) {
            console.debug('[onresult]', e.results.length);
            var finalText = '';
            var interimText = '';
            for (var i = 0; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    finalText += e.results[i][0].transcript;
                } else {
                    interimText += e.results[i][0].transcript;
                }
            }
            $interimSpan.textContent = interimText;
            $finalSpan.textContent = finalText;
        };
        recognition.onstart = function () {
            console.debug('[onstart]');
        };
        recognition.onaudiostart = function () {
            console.debug('[onaudiostart]');
        }
        recognition.onsoundstart = function () {
            console.debug('[onsoundstart]');
        }
        recognition.onspeechstart = function () {
            console.debug('[onspeechstart]');
        }
        recognition.onspeechend = function () {
            console.debug('[onspeechend]');
        }
        recognition.onsoundend = function () {
            console.debug('[onsoundend]');
        }
        recognition.onaudioend = function () {
            console.debug('[audioend]');
        }
        recognition.onnomatch = function () {
            console.debug('[onnomatch]');
        }
        recognition.onerror = function () {
            console.debug('[onerror]');
        }
        recognition.onstart = function () {
            console.debug('[onstart]');
        }
        recognition.onend = function () {
            console.debug('[onend]');
        }
        recognition.start();
        nowRecognition = true;
    };
    function stop () {
        recognition.stop();
        nowRecognition = false;
    }
    document.querySelector('#btn').onclick = function () {

        // unsupported.
        if (!'webkitSpeechRecognition' in window) {
            alert('Web Speech API には未対応です.');
            return;
        }

        if (nowRecognition) {
            stop();
            this.value = '音声認識を継続的に行う';
            this.className = '';
        } else {
            start();
            this.value = '音声認識を止める';
            this.className = 'select';
        }
    }
})();