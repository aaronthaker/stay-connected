import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext)();
  }

  playSound(frequency: number, duration: number) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
