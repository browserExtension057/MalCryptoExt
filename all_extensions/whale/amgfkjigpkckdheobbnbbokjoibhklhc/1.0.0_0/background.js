/**
 * Copyright 2019 NAVER Corp. All Rights reserved.
 * All rights, including but not limited to, copyrights,
 * and intellectual property rights of this source code are owned by NAVER Corp.
 *
 * You may not use, reproduce, modify, or distribute this source code
 * without prior written permission from NAVER Corp.
 */
const API_URL = 'https://apis.naver.com/whale/labsapi/tts/makeTTS';
const cache = {
  isPlaying: false,
};

const play = buffer => {
  if (cache.isPlaying) {
    return;
  }

  cache.isPlaying = true;
  window.dispatchEvent(new CustomEvent('tts:start'));

  cache.ctx = cache.ctx || new AudioContext();
  cache.ctx.decodeAudioData(buffer)
    .then(audioData => {
      cache.source = cache.source || cache.ctx.createBufferSource();
      cache.source.addEventListener('ended', () => stop());
      cache.source.buffer = audioData;
      cache.source.connect(cache.ctx.destination);
      cache.source.start(0);
    })
    .catch(e => {
      console.error(e.message);
    });
};

const stop = () => {
  if (cache.isPlaying) {
    cache.source.stop(0);
  }

  cache.isPlaying = false;
  window.dispatchEvent(new CustomEvent('tts:end'));

  cache.ctx.close();
  cache.source = undefined;
  cache.ctx = undefined;
};

const pause = () => {
  cache.isPlaying = false;
  return cache.audioContext.suspend();
};

const resume = () => {
  cache.isPlaying = true;
  return cache.audioContext.resume();
};

whale.ttsEngine.onSpeak.addListener((utterance, options, sendTtsEvent) => {
  window.addEventListener('tts:start', () => {
    sendTtsEvent({ type: 'start' });
  }, {once: true});

  window.addEventListener('tts:end', () => {
    sendTtsEvent({ type: 'end' });
  }, {once: true});

  whale.utility.getHmacURL(API_URL, async url => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'arraybuffer';
    xhr.onerror = () => {
      sendTtsEvent({
        type: 'error',
        errorMessage: 'API Request error (XHR)'
      });
    };
    xhr.onreadystatechange = () => {
      const { readyState, status, response } = xhr;

      if (readyState === 4) {
        if (status === 200) {
          play(response);
          return;
        }

        const { errorCode, message } = status === 400 && response ?
            JSON.parse(response) : {};

        sendTtsEvent({
          type: 'error',
          errorMessage: `${message} (${errorCode})`
        });

        stop();
        return;
      }

      if (readyState === 2 && status === 400) {
        xhr.responseType = 'text';
      }
    };

    const speaker = `${options.voiceName}`.toLowerCase();
    xhr.send(`speaker=${speaker}&speed=${options.rate}&text=${utterance}`);
  });
});

whale.ttsEngine.onStop.addListener(() => {
  stop();
});

whale.ttsEngine.onPause.addListener(() => {
  if (cache.isPlaying) {
    pause();
  } else {
    resume();
  }
});

whale.ttsEngine.onResume.addListener(() => {
  resume();
});
