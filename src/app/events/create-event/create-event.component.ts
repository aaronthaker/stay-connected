import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Event as MyEvent } from '../event.model';
import { EventsService } from '../events.service';
import { SoundService } from 'src/app/sound.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  enteredEventTitle = '';
  enteredEventLocation = '';
  enteredEventDate = '';
  enteredEventDescription = '';
  private eventId: string | null;
  event: MyEvent;
  isLoading = false;
  imagePath: string | null = null;
  imageFile: File | null = null;
  @ViewChild('imagePicker', { static: false }) imagePickerRef: ElementRef;

  constructor(
    public eventService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    private soundService: SoundService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.eventId = paramMap.get('eventId')!;
        this.isLoading = true;
        this.eventService.getEvent(this.eventId).subscribe((eventData) => {
          this.imagePath = eventData.imagePath;
          this.isLoading = false;
          this.event = {
            id: eventData._id,
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            date: eventData.date,
            creator: eventData.creator
          };
        });
      } else {
        this.eventId = null;
      }
    });
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageFile = null;
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePath = null;
  }

  onSaveEvent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.eventService.updateEvent(
      this.eventId!,
      form.value.title,
      form.value.description,
      form.value.location,
      form.value.date,
      this.imageFile,
      this.imagePath
    );
    form.resetForm();
  }

  onSubmitClick() {
    this.router.navigate(['/events']);
  }
}
