import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-logout-modal',
  templateUrl: './confirm-logout-modal.component.html',
  styleUrls: ['./confirm-logout-modal.component.scss'],
})
export class ConfirmLogoutModalComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  dismiss(confirm: boolean) {
    this.modalController.dismiss({
      confirm
    });
  }
}
