import { store } from 'reducers/store';
import { SOUNDS_PATHS } from 'constants/audiosPaths';

class NotificationSoundsService {
  audiosUnlocked = false;

  constructor() {
    this.orderAudio = new Audio();
    this.messageAudio = new Audio();
  }

  unlockAudio = () => {
    this.audiosUnlocked = true;
  }

  enableAudioInSafari = () => {
    if (!this.audiosUnlocked) {
      this.orderAudio.play();
      this.orderAudio.pause();
      this.orderAudio.currentTime = 0;
      this.messageAudio.play();
      this.messageAudio.pause();
      this.messageAudio.currentTime = 0;

      this.unlockAudio();
    }
  }

  playOrderSound = () => {
    const ordersSound = store.getState().auth.user.order_sound;
    if (ordersSound && this.audiosUnlocked) {
      this.orderAudio.src = SOUNDS_PATHS[ordersSound];
      this.orderAudio.play();
    }
  }

  playMessageSound = () => {
    const messageSound = store.getState().auth.user.message_sound;
    if (messageSound && this.audiosUnlocked) {
      this.messageAudio.src = SOUNDS_PATHS[messageSound];
      this.messageAudio.play();
    }
  }
}

export default new NotificationSoundsService();
