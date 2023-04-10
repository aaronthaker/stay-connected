import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Event as MyEvent } from '../event.model';
import { EventsService } from '../events.service';

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
  private editMode: boolean = false;
  private eventId: string | null;
  event: MyEvent;
  isLoading = false;
  imagePath: string | null = null;
  imageFile: File | null = null;
  @ViewChild('imagePicker', { static: false }) imagePickerRef: ElementRef;

  constructor(
    public eventService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.editMode = true;
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
        this.editMode = false;
        this.eventId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.imageFile = file;
    } else {
      this.imageFile = null;
    }
  }

  removeImage() {
    this.imageFile = null;
    if (this.event) {
      this.event.imagePath = null;
    }
  }

  onSaveEvent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.editMode) {
      this.eventService.addEvent(
        form.value.title,
        form.value.description,
        form.value.date,
        form.value.location,
        this.imageFile!
      );
    } else if (this.editMode) {
      this.eventService.updateEvent(
        this.eventId!,
        form.value.title,
        form.value.description,
        form.value.location,
        form.value.date,
        this.imageFile,
        this.imagePath
      );
    }
    form.resetForm();
  }

  onSubmitClick() {
    this.router.navigate(['/events']);
  }
}
