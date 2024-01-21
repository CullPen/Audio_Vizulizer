document.getElementById('audioFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                visualizeAudio(buffer, audioContext);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function visualizeAudio(buffer, audioContext) {
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    source.start();
    draw();
}
