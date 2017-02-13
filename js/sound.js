import media from "simple-media-element";

const audio = media.audio();

const sound = (file, loop = false) => {
  if (audio.getAttribute("src") === file) {
    return audio;
  }
  audio.src = file;
  audio.loop = loop;
  audio.load();
  audio.play();
  return audio;
};

export default sound;



