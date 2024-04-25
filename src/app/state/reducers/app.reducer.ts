import { createReducer, on } from '@ngrx/store';
import { initialState } from '../app.state';
import * as AppActions from '../actions/app.actions';
import {
  addItemToContainer,
  highlightPlacedContainers,
  moveContainerToContainer,
  selectContainer,
} from '../actions/app.actions';

export const appReducer = createReducer(
  initialState,
  on(AppActions.addFreeItem, (state, { id, name, volume, count }) => ({
    ...state,
    freeItems: [...state.freeItems, { id, name, volume, count }],
  })),

  on(AppActions.removeFreeItem, (state, { name }) => {
    const lastIndex = [...state.freeItems]
      .reverse()
      .findIndex((item) => item.name === name);
    const index =
      lastIndex >= 0 ? state.freeItems.length - 1 - lastIndex : lastIndex;

    if (index !== -1) {
      return {
        ...state,
        freeItems: [
          ...state.freeItems.slice(0, index),
          ...state.freeItems.slice(index + 1),
        ],
      };
    }

    return state;
  }),

  on(AppActions.moveContainerToPlacedByName, (state, { containerName }) => {
    const containerIndex = state.freeItems.findIndex(
      (item) => item.name === containerName,
    );
    if (containerIndex === -1) return state;
    const container = state.freeItems[containerIndex];
    const updatedContainer = {
      ...container,
      items: [],
      availableCapacity: container.volume,
    };

    return {
      ...state,
      freeItems: state.freeItems.filter((_, index) => index !== containerIndex),
      placedContainers: [...state.placedContainers, updatedContainer],
      selectedContainerId: null,
    };
  }),

  on(AppActions.removeContainerFromPlaced, (state, { containerId }) => {
    const container = state.placedContainers.find(
      (item) => item.id === containerId,
    );

    if (!container) return state;

    return {
      ...state,
      placedContainers: state.placedContainers.filter(
        (item) => item.id !== containerId,
      ),
      freeItems: [...state.freeItems],
      selectedContainerId: null,
    };
  }),

  on(highlightPlacedContainers, (state, { containerId }) => {
    const selectedContainer = state.placedContainers.find(
      (c) => c.id === containerId,
    );

    const highlightedPlacedContainers = selectedContainer
      ? state.placedContainers.filter(
          (container) =>
            selectedContainer.availableCapacity <=
              container?.availableCapacity && container.id !== containerId,
        )
      : [];

    return {
      ...state,
      highlightedContainers: state.placedContainers.filter(
        (container) =>
          container.availableCapacity >= selectedContainer.volume &&
          container.id !== containerId,
      ),
    };
  }),

  on(selectContainer, (state, { containerId }) => {
    return {
      ...state,
      selectedContainerId: containerId,
    };
  }),

  on(moveContainerToContainer, (state, { containerId, targetContainerId }) => {
    const newContainers = state.placedContainers
      .map((container) => {
        if (container.id === containerId) {
          const targetContainer = state.placedContainers.find(
            (c) => c.id === targetContainerId,
          );
          const updatedContainers = container.containers
            ? [...container.containers, targetContainer]
            : [targetContainer];
          return {
            ...container,
            containers: updatedContainers,
          };
        } else if (container.id !== targetContainerId) {
          return container;
        } else {
          return null;
        }
      })
      .filter((c) => c !== null);

    return {
      ...state,
      placedContainers: newContainers,
      selectedContainerId: null,
    };
  }),

  on(AppActions.highlightContainers, (state, { item }) => ({
    ...state,
    highlightedContainers: state.placedContainers.filter(
      (container) => container.availableCapacity >= item?.volume,
    ),
  })),
  on(AppActions.ResetHighlight, (state) => ({
    ...state,
    currentHoveredItem: null,
    highlightedContainers: [],
    selectedContainerId: null,
  })),

  on(AppActions.hoverItemToAdd, (state, { item }) => ({
    ...state,
    currentHoveredItem: item,
    selectedContainerId: null,
  })),

  on(addItemToContainer, (state, { containerId, itemId }) => {
    const item = state.freeItems.find((item) => item.id === itemId);
    if (!item) return state;

    const newFreeItems = state.freeItems.filter((item) => item.id !== itemId);

    const newContainers = state.placedContainers.map((container) => {
      if (container.id === containerId) {
        const newItems = [...(container.items || []), item];
        const newAvailableCapacity = container.availableCapacity - item.volume;

        return {
          ...container,
          items: newItems,
          availableCapacity: newAvailableCapacity,
          selectedContainerId: null,
        };
      }
      return container;
    });

    return {
      ...state,
      freeItems: newFreeItems,
      currentHoveredItem: null,
      placedContainers: newContainers,
      selectedContainerId: null,
    };
  }),
);
