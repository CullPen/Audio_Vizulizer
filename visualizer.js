document.getElementById('audioFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                drawWaveform(buffer);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function drawWaveform(buffer) {
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const channelData = buffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amp);

    for (let i = 0; i < width; i++) {
        const min = Math.min(...channelData.slice(i * step, (i + 1) * step));
        const max = Math.max(...channelData.slice(i * step, (i + 1) * step));
        ctx.lineTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
    }

    ctx.stroke();
}
