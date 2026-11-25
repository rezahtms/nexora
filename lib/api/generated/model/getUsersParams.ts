
import type { LimitParameter } from './limitParameter';
import type { OrderParameter } from './orderParameter';
import type { SkipParameter } from './skipParameter';
import type { SortByParameter } from './sortByParameter';

export type GetUsersParams = {
  
  limit?: LimitParameter;
  
  skip?: SkipParameter;
  sortBy?: SortByParameter;
  order?: OrderParameter;
};
