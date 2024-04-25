import { createSelector } from '@ngrx/store';
import { Item } from '../../models/item';
import { Container } from '../../models/container';

export interface SelectorProps {
  name: string;
}

export const selectFreeItems = (state: any): Item[] => state.appState.freeItems;
export const selectPlacedContainers = (state: any): Container[] =>
  state.appState.placedContainers;
export const selectCurrentHoveredItem = (state: any): Item =>
  state.appState.currentHoveredItem;
export const selectAllContainers = (state: any): Container[] =>
  state.appState.containers;
export const selectHighlightedContainers = (state: any): Container[] =>
  state.appState.highlightedContainers;
export const selectedContainerId = (state: any): string =>
  state.appState.selectedContainerId;

export const selectContainerCapacity = createSelector(
  selectPlacedContainers,
  (placedContainers: Container[], props: { containerId: string }) => {
    const container = placedContainers.find((c) => c.id === props.containerId);
    if (!container || !container.items) {
      return null;
    }
    const usedCapacity = container.items.reduce(
      (sum, item) => sum + item.volume,
      0,
    );
    return container.volume - usedCapacity;
  },
);

export const selectAvailableContainers = createSelector(
  selectAllContainers,
  selectFreeItems,
  selectCurrentHoveredItem,
  (containers, items, hoveredItemName) => {
    if (!hoveredItemName) return [];
    const hoveredItem = items.find(
      (item, i) => item[i].name === hoveredItemName,
    );

    return hoveredItem
      ? containers.filter(
          (container) => container.availableCapacity >= hoveredItem.volume,
        )
      : [];
  },
);

export const selectItemCountByName = createSelector(
  selectFreeItems,
  (items: Item[], props: SelectorProps): number => {
    const total = items
      .filter((item) => item.name === props.name)
      .reduce((acc, item) => acc + item.count, 0);
    return total;
  },
);

export const selectLastItemByName = (itemName: string) =>
  createSelector(selectFreeItems, (allItems) => {
    const filteredItems = allItems.filter((item) => item.name === itemName);
    return filteredItems.length > 0
      ? filteredItems[filteredItems.length - 1]
      : undefined;
  });
