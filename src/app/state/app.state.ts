import { Item } from '../models/item';
import { Container } from '../models/container';

export interface AppState {
  freeItems: (Item | Container)[];
  currentHoveredItem: Item | null;
  placedContainers: Container[];
  highlightedContainers: Container[];
  selectedContainerId: string | null;
}

export const initialState: AppState = {
  freeItems: [
    {
      id: 'abb038a4-8f09-4888-91cd-57478ee46d83',
      name: 'org-box',
      volume: 10,
      count: 1,
    },
    {
      id: '7c1a23de-a019-43bb-9234-57dbf3a3cad1',
      name: 'credit-card',
      volume: 1,
      count: 1,
    },
    {
      id: '918f5c6c-8523-40ad-a6bc-220a4d070455',
      name: 'keys',
      volume: 2,
      count: 1,
    },
    {
      id: '675cee01-c3b5-48fe-971a-8389eabdc24b',
      name: 'smartphone',
      volume: 3,
      count: 1,
    },
    {
      id: '16a6db77-f335-4385-a811-93dd116d3aee',
      name: 'closet',
      volume: 20,
      count: 1,
    },
    {
      id: '23aa25ef-a64c-4f41-bb9b-3990843b6ea9',
      name: 'wallet',
      volume: 5,
      count: 1,
    },
  ],
  placedContainers: [],
  currentHoveredItem: null,
  highlightedContainers: [],
  selectedContainerId: null,
};
