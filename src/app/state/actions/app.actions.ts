import { createAction, props } from '@ngrx/store';
import { Item } from '../../models/item';

export const addFreeItem = createAction(
  '[Item] Add Free Item',
  props<{ id: string; name: string; volume: number; count: number }>(),
);

export const removeFreeItem = createAction(
  '[Item] Remove Free Item',
  props<{ name: string }>(),
);

export const hoverItemToAdd = createAction(
  '[Item] Hover Add',
  props<{ item: Item }>(),
);

export const addItemToContainer = createAction(
  '[Container] Add Item',
  props<{ containerId: string; itemId: string }>(),
);

export const highlightContainers = createAction(
  '[Container] Highlight Containers',
  props<{ item: Item }>(),
);

export const moveContainerToPlacedByName = createAction(
  '[Container] Move to Placed by Name',
  props<{ containerName: string }>(),
);

export const removeContainerFromPlaced = createAction(
  '[Container] Remove from Placed',
  props<{ containerId: string }>(),
);

export const highlightPlacedContainers = createAction(
  '[Container] Highlight Placed Containers',
  props<{ containerId: string }>(),
);

export const moveContainerToContainer = createAction(
  '[Container] Move Container To Container',
  props<{ containerId: string; targetContainerId: string }>(),
);

export const selectContainer = createAction(
  '[Container] Select',
  props<{ containerId: string }>(),
);

export const ResetHighlight = createAction('[Container] Reset Highlight');
