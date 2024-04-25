import { Component, Input } from '@angular/core';
import { Container } from '../models/container';

@Component({
  selector: 'app-main-room',
  templateUrl: './main-room.component.html',
  styleUrl: './main-room.component.scss',
})
export class MainRoomComponent {
  @Input() displayedContainers: Container[] = [];
  maxContainersPerPage: number = 3;
  currentPage: number = 0;
  maxPage: number;

  constructor() {
    this.maxPage =
      Math.ceil(this.displayedContainers.length / this.maxContainersPerPage) -
      1;
  }

  next(): void {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  previous(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
