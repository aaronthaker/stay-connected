import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateEventComponent } from '../create-event/create-event.component';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {
  existingEvents = [
    {
      event: 'Visually Impaired Singles Speed Dating',
      location: 'New York City, NY',
      date: 'September 5th, 2020',
      description:
        'Come meet other visually impaired singles in a fun and fast-paced speed dating style event in NYC!',
    },
    {
      event: 'Visually Impaired Dating Workshop',
      location: 'San Francisco, CA',
      date: 'October 3rd, 2020',
      description:
        'Learn the tips and tricks of dating with a disability in this interactive workshop in San Francisco!',
    },
    {
      event: 'Visually Impaired Meet and Greet',
      location: 'Los Angeles, CA',
      date: 'November 7th, 2020',
      description:
        'Meet and mingle with other visually impaired singles in a relaxed and friendly atmosphere in LA!',
    },
    {
      event: 'Visually Impaired Social Gathering',
      location: 'Chicago, IL',
      date: 'December 12th, 2020',
      description:
        'Gather with other visually impaired singles to make new friends and connections in Chicago!',
    },
    {
      event: 'Visually Impaired Blind Date Night',
      location: 'Dallas, TX',
      date: 'January 9th, 2021',
      description:
        'Take the plunge and test your luck with a blind date in Dallas!',
    },
    {
      event: 'Visually Impaired Mixer',
      location: 'Houston, TX',
      date: 'February 6th, 2021',
      description:
        'Get to know other visually impaired singles in a fun and casual atmosphere in Houston!',
    },
    {
      event: 'Visually Impaired Love Connection',
      location: 'Philadelphia, PA',
      date: 'March 13th, 2021',
      description:
        'Find your love connection at this special event in Philadelphia!',
    },
    {
      event: 'Visually Impaired Dating Game',
      location: 'Washington, DC',
      date: 'April 10th, 2021',
      description:
        'Put your flirting skills to the test in this fun and interactive dating game in DC!',
    },
    {
      event: 'Visually Impaired Matchmaking Event',
      location: 'Atlanta, GA',
      date: 'May 8th, 2021',
      description:
        'Find your perfect match with the help of matchmakers at this special event in Atlanta!',
    },
    {
      event: 'Visually Impaired Flirting 101',
      location: 'Miami, FL',
      date: 'June 5th, 2021',
      description:
        'Learn how to flirt with confidence at this seminar in Miami!',
    },
  ];

  async showCreateEventModal() {
    const modal = await this.modalController.create({
      component: CreateEventComponent,
    });
    await modal.present();
  }

  viewEvent() {
    // This should bring up a model showing the event
  }

  constructor(private modalController: ModalController) {}

  ngOnInit() {}
}
