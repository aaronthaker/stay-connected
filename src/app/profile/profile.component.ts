import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { User } from '../users/user.model';
import { UserService } from '../users/users.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  currentUserId: string;
  currentUser: User;
  editMode = false;
  timestamp: number;

  interests: string[] = [];
  interestCtrl = new FormControl();
  filteredInterests: Observable<string[]>;
  touchDevice: boolean;

  allInterests: string[] = ['3D printing', 'Acroyoga', 'Acting', 'Alternate history', 'Amateur radio', 'Animation', 'Anime', 'Archery', 'Baton twirling', 'Beatboxing', 'Beer tasting', 'Bell ringing', 'Binge watching', 'Bird watching', 'Blacksmith', 'Blogging', 'Bonsai', 'Board/tabletop games', 'Book discussion clubs', 'Book restoration', 'Bowling', 'Brazilian jiu-jitsu', 'Breadmaking', 'Bullet journaling', 'Butchering', 'Calligraphy', 'Candle making', 'Candy making', 'Car spotting', 'Car fixing & building', 'Card games', 'Cardistry', 'Ceramics', 'Chatting', 'Cheesemaking', 'Chess', 'Cleaning', 'Clothesmaking', 'Coffee roasting', 'Collecting', 'Pet care', 'Coloring', 'Communication', 'Community activism', 'Community radio', 'Computer programming', 'Confectionery', 'Conlanging', 'Construction', 'Cooking', 'Cosplaying', 'Couponing', 'Craft', 'Creative writing', 'Crocheting', 'Cross-stitch', 'Crossword puzzles', 'Cryptography', 'Cue sports', 'Dance', 'Decorating', 'Decorative birds', 'Digital arts', 'Dining', 'Diorama', 'Distro Hopping', 'Diving', 'Djembe', 'DJing', 'Do it yourself', 'Drama', 'Drawing', 'Drone racing', 'Editing', 'Electronic games', 'Electronics', 'Embroidery', 'Engraving', 'Entertaining', 'Everyday carry', 'Experimenting', 'Fantasy sports', 'Fashion', 'Fashion design', 'Feng shui decorating', 'Filmmaking', 'Fingerpainting', 'Fishfarming', 'Fishkeeping', 'Flower arranging', 'Fly tying', 'Foreign language learning', 'Furniture building', 'Gambling', 'Genealogy', 'Gingerbread house making', 'Giving advice', 'Glassblowing', 'Gardening', 'Gongfu tea', 'Graphic design', 'Gunsmithing', 'Hacking', 'Hairstyle', 'Hardware', 'Herping', 'Herp keeping', 'Hobby finding', 'Home improvement', 'Homebrewing', 'Homing pigeons', 'Houseplant care', 'Hula hooping', 'Hydroponics', 'Ice skating', 'Insect collecting', 'Inventing', 'Jewelry making', 'Jigsaw puzzles', 'Journaling', 'Judo', 'Juggling', 'Karaoke', 'Karate', 'Kendama', 'Kitemaking', 'Knife making', 'Knitting', 'Knot tying', 'Kombucha brewing', 'Kung fu', 'Lace making', 'Lapidary', 'Leather crafting', 'Lego building', 'Livestreaming', 'Listening to music', 'Listening to podcasts', 'Lock picking', 'Machining', 'Macrame', 'Magic', 'Makeup', 'Manga', 'Massaging', 'Mazes (indoor/outdoor)', 'Mechanics', 'Meditation', 'Memory training', 'Metalworking', 'Micropatriology', 'Miniature art', 'Minimalism', 'Model building', 'Modeling', 'Model engineering', 'Music', 'Nail art', 'Needlepoint', 'Origami', 'Painting', 'Pen Spinning', 'Performance', 'Pet sitting', 'Philately', 'Photography', 'Pilates', 'Pipes', 'Planning', 'Plastic art', 'Playing musical instruments', 'Poetry', 'Poi', 'Pole dancing', 'Postcrossing', 'Pottery', 'Practical jokes', 'Pressed flower craft', 'Proofreading and editing', 'Proverbs', 'Public speaking', 'Puppetry', 'Puzzles', 'Pyrography', 'Quilling', 'Quilting', 'Quizzes', 'Radio-controlled model playing', 'Rail transport modeling', 'Rapping', 'Reading', 'Recipe creation', 'Recreational drug use', 'Refinishing', 'Reiki', 'Reviewing gadgets', 'Robot combat', 'Role-playing', 'Rubiks Cube', 'Scrapbooking', 'Scuba diving', 'Sculpting', 'Sewing', 'Shoemaking', 'Singing', 'Sketching', 'Skipping rope', 'Slot car', 'Shopping', 'Soapmaking', 'Social media', 'Speedrunning', 'Speculative evolution', 'Spreadsheets', 'Stamp collecting', 'Stand-up comedy', 'Storytelling', 'Stretching', 'String Figures', 'Sudoku', 'Talking', 'Tabletop game', 'Taekwondo', 'Tanning (leather)', 'Tapestry', 'Tarot', 'Tattooing', 'Taxidermy', 'Telling jokes', 'Thrifting', 'Upcycling', 'Video editing', 'Video game developing', 'Video gaming', 'Video making', 'VR gaming', 'Wargaming', 'Watch making', 'Watching documentaries', 'Watching movies', 'Watching television', 'Wax sealing', 'Waxing', 'Weaving', 'Weight training', 'Welding', 'Whittling', 'Wikipedia editing', 'Wikipedia racing/Wikiracing', 'Wine tasting', 'Winemaking', 'Witchcraft', 'Wood carving', 'Woodworking', 'Word searches', 'Worldbuilding', 'Writing', 'Writing music', 'Yarn bombing', 'Yo-yoing', 'Yoga', 'Zumba'];

  searchResults: string[] = [];

  constructor(
    private messagesService: MessagesService,
    private soundService: SoundService,
    private userService: UserService,
  ) {
    this.timestamp = new Date().getTime();
  }

  ngOnInit() {
    this.currentUserId = this.messagesService.currentUserId!;
    this.userService.getUser(this.currentUserId).subscribe((user: any) => {
      this.currentUser = user;
      this.interests = this.currentUser.interests || [];
    });
    this.filteredInterests = this.interestCtrl.valueChanges.pipe(
      startWith(null),
      map((interest: string | null) => interest ? this._filter(interest) : this.allInterests.slice())
    );
    this.touchDevice = this.isTouchDevice();
  }

  playButtonSound() {
    this.soundService.playSound(440, 0.3);
  }

  speakText(textToSpeak: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      // Handle the case where the browser doesn't support speech synthesis
      console.error('Speech synthesis is not supported in this browser.');
    }
  }

  darkMode = false;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  remove(interest: string): void {
    const index = this.interests.indexOf(interest);

    if (index >= 0) {
      this.interests.splice(index, 1);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allInterests.filter(interest => interest.toLowerCase().includes(filterValue));
  }

  selected(suggestion: string): void {
    if (!this.interests.includes(suggestion)) {
      this.interests.push(suggestion);
    }
    this.searchResults = [];
    this.interestCtrl.setValue('');
  }

  toggleEditMode() {
    if (this.editMode) {
      this.currentUser.interests = this.interests;
      this.userService.updateUser(this.currentUser).subscribe((user) => {
        if (this.selectedImageFile) {
          this.uploadProfilePicture();
        }
      });
    }
    this.editMode = !this.editMode;
  }


  selectedImageFile: File | null = null;

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const maxSizeMB = 50; // Maximum sized image supported by payload limit in app.js (in MB)

    if (this.isFileSizeValid(file, maxSizeMB)) {
      this.selectedImageFile = file;
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.currentUser.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('File size is too large, must be less than', maxSizeMB, 'MB');
    }
  }

  uploadProfilePicture() {
    const formData = new FormData();
    if (this.selectedImageFile) {
      formData.append('profileImage', this.selectedImageFile);
    }
    this.userService.uploadProfilePicture(this.currentUserId, formData).subscribe(
      (response) => {
        const modifiedString = 'http://localhost:3000/' + response.imagePath.replace(/\\/g, '/');
        this.currentUser.profileImage = modifiedString;
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
      }
    );
  }

  isFileSizeValid(file: File, maxSizeMB: number): boolean {
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = maxSizeMB * 1024 * 1024;
    return fileSizeInBytes <= maxSizeInBytes;
  }

  // Add these properties to your class
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordErrorMessage = '';
  passwordChangeSuccessfulMessage = '';

  changePassword() {
    this.passwordErrorMessage = '';
    this.passwordChangeSuccessfulMessage = '';

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordErrorMessage = 'New passwords do not match';
      return;
    }

    if (!this.currentPassword || !this.newPassword) {
      this.passwordErrorMessage = 'Please fill in all fields';
      return;
    }

    this.userService.changePassword(this.currentUserId, this.currentPassword, this.newPassword)
      .subscribe(
        (response) => {
          // this.passwordErrorMessage = 'Password changed successfully';
          this.passwordChangeSuccessfulMessage = 'Password changed successfully';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        (error) => {
          console.error('Error changing password:', error);
          this.passwordErrorMessage = 'Failed to change password';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        }
      );
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

}
