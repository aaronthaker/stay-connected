import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-confirm-logout-modal',
  templateUrl: './confirm-logout-modal.component.html',
  styleUrls: ['./confirm-logout-modal.component.scss'],
})
export class ConfirmLogoutModalComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private soundService: SoundService
  ) { }

  ngOnInit() {}

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  dismiss(confirm: boolean) {
    this.modalController.dismiss({
      confirm
    });
  }
}
