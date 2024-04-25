import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {
  addFreeItem,
  highlightContainers,
  hoverItemToAdd,
  moveContainerToPlacedByName,
  removeFreeItem,
} from '../state/actions/app.actions';
import { AppState } from '../state/app.state';
import {
  selectItemCountByName,
  selectLastItemByName,
} from '../state/selectors/app.selectors';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '../models/item';

type ItemName = 'credit-card' | 'keys' | 'smartphone';

type ContainerName = 'wallet' | 'org-box' | 'closet';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @Input() src!: string;
  @Input() name!: string;

  private readonly elementsVolume: Record<ItemName, number> = {
    'credit-card': 1,
    keys: 2,
    smartphone: 3,
  };

  private readonly containerCapacity: Record<ContainerName, number> = {
    wallet: 5,
    'org-box': 10,
    closet: 20,
  };

  @Input() itemCount$: Observable<number> | undefined;
  @Input() objectType: string;
  @Input() capacity: number;
  private currentItem: Item;
  lastItem$: Observable<Item | undefined>;
  svgContent: SafeHtml = '';
  volume;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.lastItem$ = this.store.select(selectLastItemByName(this.name));
    if (this.src) {
      this.loadSvg(this.src);
    }
    this.itemCount$ = this.store.select(selectItemCountByName, {
      name: this.name,
    });
    this.volume = this.elementsVolume[this.name as unknown as ItemName];
    this.capacity =
      this.containerCapacity[this.name as unknown as ContainerName];

    this.lastItem$.subscribe((item) => {
      if (item) {
        this.currentItem = item;
      }
    });
  }

  addElement(name: string) {
    if (name in this.elementsVolume) {
      const volume = this.elementsVolume[name as ItemName];
      this.store.dispatch(
        addFreeItem({
          id: uuidv4(),
          name: name as ItemName,
          volume,
          count: 1,
        }),
      );
    } else if (name in this.containerCapacity) {
      const volume = this.containerCapacity[name as ContainerName];
      this.store.dispatch(
        addFreeItem({
          id: uuidv4(),
          name: name as ContainerName,
          volume,
          count: 1,
        }),
      );
    } else {
      console.error('Invalid element name:', name);
    }
  }

  removeElement(name: string) {
    this.store.dispatch(removeFreeItem({ name }));
  }

  placeElementInPackageArea() {
    if (this.objectType === 'container') {
      this.store.dispatch(
        moveContainerToPlacedByName({ containerName: this.name }),
      );
    } else {
      this.store.dispatch(highlightContainers({ item: this.currentItem }));
      this.store.dispatch(hoverItemToAdd({ item: this.currentItem }));
    }
  }

  loadSvg(url: string): void {
    this.httpClient.get(url, { responseType: 'text' }).subscribe({
      next: (response) =>
        (this.svgContent = this.sanitizer.bypassSecurityTrustHtml(response)),
      error: (err) => console.error('Error loading the SVG: ', err),
    });
  }
}
