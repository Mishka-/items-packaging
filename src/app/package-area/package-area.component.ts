import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { Container } from '../models/container';
import { Item } from '../models/item';
import {
  selectAvailableContainers,
  selectContainerCapacity,
  selectCurrentHoveredItem,
  selectedContainerId,
  selectHighlightedContainers,
  selectPlacedContainers,
} from '../state/selectors/app.selectors';
import { Observable, Subscription } from 'rxjs';
import {
  addItemToContainer,
  highlightPlacedContainers,
  moveContainerToContainer,
  removeContainerFromPlaced,
  ResetHighlight,
  selectContainer,
} from '../state/actions/app.actions';

@Component({
  selector: 'app-carousel',
  templateUrl: './package-area.component.html',
  styleUrl: './package-area.component.scss',
})
export class PackageAreaComponent implements OnInit, OnDestroy {
  public currentContainerId;
  public currentHoveredItemId: string | null;
  public displayedContainers$: Observable<Container[]>;
  public maxContainersPerPage: number = 3;
  public displayedContainers: Container[];
  public currentPage: number = 0;
  public maxPage: number;
  public selectedContainerId: string;
  private availableContainers$: Observable<Container[]>;
  private currentHoveredItem$: Observable<Item | null>;
  private selectedContainerId$: Observable<string | null>;
  private highlightedContainers: string[] = [];
  private subscription: Subscription = new Subscription();
  private totalCapacity$: Observable<number>;

  @Input() containerId: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.displayedContainers$ = this.store.select(selectPlacedContainers);
    this.availableContainers$ = this.store.select(selectAvailableContainers);
    this.currentHoveredItem$ = this.store.select(selectCurrentHoveredItem);
    this.selectedContainerId$ = this.store.select(selectedContainerId);

    this.subscription.add(
      this.displayedContainers$.subscribe((containers) => {
        this.maxPage =
          Math.ceil(containers.length / this.maxContainersPerPage) - 1;
        this.displayedContainers = containers;
        if (containers.length > 0) {
          this.currentContainerId = containers[containers.length - 1].id;
        }
      }),
    );

    this.totalCapacity$ = this.store.select(selectContainerCapacity, {
      containerId: this.currentContainerId,
    });

    this.store.select(selectHighlightedContainers).subscribe((highlighted) => {
      this.highlightedContainers = highlighted.map((container) => container.id);
    });

    this.subscription.add(
      this.currentHoveredItem$.subscribe((item) => {
        if (item && item.id) {
          this.currentHoveredItemId = item.id;
        }
      }),
    );

    this.subscription.add(
      this.selectedContainerId$.subscribe((id) => {
        this.selectedContainerId = id;
      }),
    );
  }
  next(): void {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  removeContainer(containerId: string) {
    this.store.dispatch(removeContainerFromPlaced({ containerId }));
  }

  moveContainer(containerId: string, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(
      moveContainerToContainer({
        containerId,
        targetContainerId: this.selectedContainerId,
      }),
    );
    this.store.dispatch(ResetHighlight());
  }

  onSelectContainer(containerId: string, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(selectContainer({ containerId }));
    this.store.dispatch(highlightPlacedContainers({ containerId }));
  }

  isContainerHighlighted(containerId: string): boolean {
    return this.highlightedContainers.includes(containerId);
  }

  addItemToContainer(containerId: string): void {
    if (this.isContainerHighlighted) {
      this.store.dispatch(
        addItemToContainer({ containerId, itemId: this.currentHoveredItemId }),
      );
      this.store.dispatch(ResetHighlight());
    }
  }

  add(): void {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  previous(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  isContainerVisible(index: number): boolean {
    const startIndex = this.currentPage * this.maxContainersPerPage;
    return (
      index >= startIndex && index < startIndex + this.maxContainersPerPage
    );
  }

  containsElement(names: string[], index: number): boolean {
    const container = this.displayedContainers[index];
    return names.some((name) => this.searchElement(name, container));
  }

  private searchElement(name: string, container: any): boolean {
    const hasItem = container?.items?.some((item) => item.name === name);
    const hasContainer = container?.containers?.some((subContainer) =>
      this.searchElement(name, subContainer),
    );
    return !!hasItem || !!hasContainer;
  }

  getSvgUrl(name: string): string {
    return `/assets/${name}.svg`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
