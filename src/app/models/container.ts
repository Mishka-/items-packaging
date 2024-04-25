import { Item } from './item';

export interface Container {
  id: string;
  name: string;
  volume?: number;
  count?: number;
  items?: Item[];
  containers?: Container[];
  availableCapacity?: number;
  highlighted?: boolean;
}
