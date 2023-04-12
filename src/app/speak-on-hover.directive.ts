import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[speakOnHover]'
})
export class SpeakOnHoverDirective {

  @Input() textToSpeak: string | undefined | null;
  hoverTimeout: any;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      this.speakText();
    }, 1500);
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Stop speaking when the user stops hovering over the element
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearTimeout(this.hoverTimeout);
  }

  private speakText() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.textToSpeak!);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  }

}
