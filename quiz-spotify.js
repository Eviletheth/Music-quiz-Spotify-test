/* Spotify sound for the quiz.

   quizSpotifyPlayer() returns an object that behaves like the <audio> element
   the game was written for (src, play, pause, currentTime, paused, load and
   the usual events), but plays through Spotify's ordinary embedded player.
   The game sets src to an mp3 path from song details; QUIZ_SPOTIFY_LINKS
   (spotify-links.js) turns that path into a Spotify song.

   Extra event: 'playing' fires once per play() when sound is actually coming
   out at the wanted position - the countdown waits for it. */

function quizSpotifyIdFor(src) {
  if (!src) return null;
  if (!quizSpotifyIdFor.map) {
    quizSpotifyIdFor.map = {};
    (typeof QUIZ_SPOTIFY_LINKS !== 'undefined' ? QUIZ_SPOTIFY_LINKS : []).forEach(function (row) {
      if (row[2]) quizSpotifyIdFor.map[quizSpotifyPathKey(row[1])] = row[2];
    });
  }
  return quizSpotifyIdFor.map[quizSpotifyPathKey(src)] || null;
}

function quizSpotifyPathKey(path) {
  let text = String(path);
  try { text = decodeURIComponent(text); } catch (err) { /* keep as is */ }
  return text.replace(/\\/g, '/').toLowerCase();
}

/* What the host sees under the countdown: which Spotify song is playing. */
function quizSpotifyLabel(src) {
  const key = src ? quizSpotifyPathKey(src) : '';
  const row = (typeof QUIZ_SPOTIFY_LINKS !== 'undefined' ? QUIZ_SPOTIFY_LINKS : [])
    .find(function (r) { return quizSpotifyPathKey(r[1]) === key; });
  if (row && row[2]) return 'Spotify: ' + row[0];
  return 'No Spotify link for ' + (row ? row[0] : 'this song');
}

function quizSpotifyPlayer(container) {
  const START_TIMEOUT_MS = 15000;
  const listeners = {};
  let controller = null;
  let loadedUri = null;      // what Spotify has loaded
  let freshLoad = true;      // loaded but never played: play() instead of resume()
  let src = null;            // what the game set, as given
  let wantedUri = null;
  let pendingSeek = null;    // seconds, applied once sound is coming
  let seekTarget = null;     // seconds we asked Spotify to jump to
  let lastSeekAt = 0;
  let starting = false;      // between play() and the 'playing' event
  let startedAt = 0;
  let retried = false;
  let wantPlaying = false;
  let last = null;           // { pos, at, paused }
  let duration = NaN;
  let tick = null;

  const media = {
    error: null,
    volume: 1,
    preload: 'auto',
    get paused() { return !wantPlaying; },
    get duration() { return duration; },
    get src() { return src || ''; },
    set src(value) { setSource(value); },
    get currentTime() {
      if (pendingSeek !== null) return pendingSeek;
      if (starting && seekTarget !== null) return seekTarget;
      if (!last) return 0;
      return last.paused ? last.pos : last.pos + (performance.now() - last.at) / 1000;
    },
    set currentTime(value) {
      const at = Math.max(0, Number(value) || 0);
      if (controller && wantPlaying && !starting && last && !last.paused) {
        seekNow(at);
      } else {
        pendingSeek = at;
      }
    },
    getAttribute: function (name) { return name === 'src' ? src : null; },
    removeAttribute: function (name) { if (name === 'src') setSource(null); },
    load: function () {
      if (!src) { stopAll(); return; }
      setSource(src, true);
    },
    play: function () {
      media.error = null;
      if (!wantedUri) {
        media.error = { code: 4 };
        later('error');
        return Promise.reject(new Error('No Spotify link for this song'));
      }
      wantPlaying = true;
      starting = true;
      retried = false;
      startedAt = performance.now();
      emit('play');
      if (controller) startPlayback();
      return Promise.resolve();
    },
    pause: function () {
      const was = wantPlaying;
      wantPlaying = false;
      starting = false;
      if (controller && loadedUri) controller.pause();
      if (was) emit('pause');
    },
    addEventListener: function (type, fn, options) {
      (listeners[type] = listeners[type] || []).push({ fn: fn, once: !!(options && options.once) });
    },
    removeEventListener: function (type, fn) {
      listeners[type] = (listeners[type] || []).filter(function (l) { return l.fn !== fn; });
    }
  };

  function emit(type) {
    const list = (listeners[type] || []).slice();
    listeners[type] = (listeners[type] || []).filter(function (l) { return !l.once; });
    list.forEach(function (l) {
      try { l.fn.call(media, { type: type, target: media }); } catch (err) { console.error(err); }
    });
  }

  function later(type) { setTimeout(function () { emit(type); }, 0); }

  function setSource(value, reload) {
    const changed = value !== src;
    if (!changed && !reload) return;
    if (wantPlaying) media.pause();
    src = value || null;
    wantedUri = null;
    pendingSeek = null;
    seekTarget = null;
    last = null;
    duration = NaN;
    media.error = null;
    if (!src) { stopAll(); return; }
    const id = quizSpotifyIdFor(src);
    if (!id) {
      media.error = { code: 4 };
      later('error');
      return;
    }
    wantedUri = 'spotify:track:' + id;
    if (controller && loadedUri !== wantedUri) {
      controller.loadUri(wantedUri);
      loadedUri = wantedUri;
      freshLoad = true;
    }
    later('loadedmetadata');
  }

  function stopAll() {
    wantPlaying = false;
    starting = false;
    pendingSeek = null;
    seekTarget = null;
    if (controller && loadedUri) controller.pause();
  }

  function startPlayback() {
    if (loadedUri !== wantedUri) {
      controller.loadUri(wantedUri);
      loadedUri = wantedUri;
      freshLoad = true;
    }
    if (freshLoad) {
      controller.play();
      freshLoad = false;
      // A fresh song starts at 0:00 anyway; skip a jump to (nearly) the start.
      if (pendingSeek !== null && pendingSeek < 0.5) pendingSeek = null;
    } else {
      controller.resume();
    }
    if (!tick) tick = setInterval(onTick, 100);
  }

  function seekNow(at) {
    seekTarget = at;
    lastSeekAt = performance.now();
    controller.seek(at);
  }

  function onUpdate(d) {
    if (!d || (d.playingURI && d.playingURI !== loadedUri)) return;
    const pos = (d.position || 0) / 1000;
    const wasPos = last ? last.pos : 0;
    last = { pos: pos, at: performance.now(), paused: !!(d.isPaused || d.isBuffering) };
    if (d.duration) {
      const fresh = isNaN(duration);
      duration = d.duration / 1000;
      if (fresh) emit('durationchange');
    }
    if (!wantPlaying) return;

    if (d.isPaused && !starting) {
      // Spotify stopped on its own: the song ran out, or someone used its own button.
      const ended = duration && (wasPos >= duration - 2 || pos >= duration - 1);
      wantPlaying = false;
      emit('pause');
      if (ended) emit('ended');
      return;
    }
    if (!starting || last.paused) return;

    if (pendingSeek !== null) {
      const at = pendingSeek;
      pendingSeek = null;
      if (Math.abs(pos - at) > 0.75) { seekNow(at); return; }
    }
    if (seekTarget !== null && (pos < seekTarget - 0.75 || pos > seekTarget + 3)) return;
    seekTarget = null;
    starting = false;
    emit('playing');
  }

  function onTick() {
    if (!wantPlaying) return;
    const now = performance.now();
    if (starting) {
      // resume() can do nothing after a song ran out - start it properly then.
      if (!retried && now - startedAt > 3000 && (!last || last.paused)) {
        retried = true;
        controller.play();
      }
      if (seekTarget !== null && now - lastSeekAt > 2000) seekNow(seekTarget);
      if (now - startedAt > START_TIMEOUT_MS) {
        media.pause();
        media.error = { code: 2 };
        emit('error');
      }
      return;
    }
    emit('timeupdate');
  }

  function create(IFrameAPI) {
    const box = typeof container === 'string' ? document.getElementById(container) : container;
    const holder = document.createElement('div');
    box.appendChild(holder);
    const firstRow = QUIZ_SPOTIFY_LINKS.find(function (row) { return row[2]; });
    const first = 'spotify:track:' + firstRow[2];
    IFrameAPI.createController(holder, { uri: first, width: '100%', height: 80 }, function (c) {
      controller = c;
      loadedUri = first;
      freshLoad = true;
      controller.addListener('playback_update', function (e) { onUpdate(e.data); });
      if (wantedUri && loadedUri !== wantedUri) {
        controller.loadUri(wantedUri);
        loadedUri = wantedUri;
      }
      if (wantPlaying) startPlayback();
    });
  }

  if (quizSpotifyPlayer.api) create(quizSpotifyPlayer.api);
  else quizSpotifyPlayer.waiting.push(create);
  return media;
}

quizSpotifyPlayer.waiting = [];
quizSpotifyPlayer.api = null;

window.onSpotifyIframeApiReady = function (IFrameAPI) {
  quizSpotifyPlayer.api = IFrameAPI;
  quizSpotifyPlayer.waiting.splice(0).forEach(function (create) { create(IFrameAPI); });
};
