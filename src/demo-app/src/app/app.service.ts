import { Injectable } from '@angular/core';

import { DatatableSortType } from '../../../../dist/ng2-md-datatable';
import { TShirt, PaginableTshirts } from './app.interfaces';

const demoDatasource: TShirt[] = [
  { id: 1, name: 'State Street Bridge', design: 'Julia Kuo', size: 'M' },
  { id: 2, name: 'State Street Bridge', design: 'Julia Kuo', size: 'S' },
  { id: 3, name: 'State Street Bridge', design: 'Julia Kuo', size: 'L' },
  { id: 4, name: 'Big Heart/Bad Attitude', design: 'Jake Lawrence', size: 'M' },
  { id: 5, name: 'Big Heart/Bad Attitude', design: 'Jake Lawrence', size: 'S' },
  { id: 6, name: 'YIKES', design: 'Jake Lawrence', size: 'M' },
  { id: 7, name: 'YIKES', design: 'Jake Lawrence', size: 'XL' },
  { id: 8, name: 'Welcome to Heck', design: 'Jake Lawrence', size: 'M' },
  { id: 9, name: 'OKAY!', design: 'Jake Lawrence', size: 'M' },
  { id: 10, name: 'HEAD', design: 'Alexander Medvedev', size: 'M' },
  { id: 11, name: 'Dino Fart', design: 'RTSkulls', size: 'M' },
  { id: 12, name: 'Dino Fart', design: 'RTSkulls', size: 'S' },
  { id: 13, name: 'Dino Fart', design: 'RTSkulls', size: 'L' },
  { id: 14, name: 'Dino Fart', design: 'RTSkulls', size: 'XL' },
  { id: 15, name: 'That\' a...', design: 'Mathijs Vissers', size: 'M' },
  { id: 16, name: 'That\' a...', design: 'Mathijs Vissers', size: 'XL' },
  { id: 17, name: 'Cry Berry', design: 'Sabrina Pearcy', size: 'M' },
  { id: 18, name: '4EVR', design: 'lunchboxdomainbrain', size: 'M' },
];

@Injectable()
export class AppService {
  getDemoDatasource(page: number, limit: number, sortBy?: string, sortType?: DatatableSortType): PaginableTshirts {
    const offset = (page - 1) * limit;

    let tshirts;
    if (sortBy) {
      tshirts = demoDatasource
        .sort((tshirt1: TShirt, tshirt2: TShirt) => {
          switch (sortType) {
            case 0:
            case 1:
              return typeof (tshirt1[sortBy]) === 'number' ?
                tshirt1[sortBy] - tshirt2[sortBy] :
                String.prototype.localeCompare.call(tshirt1[sortBy], tshirt2[sortBy]);
            case 2:
              return typeof (tshirt1[sortBy]) === 'number' ?
                tshirt2[sortBy] - tshirt1[sortBy] :
                String.prototype.localeCompare.call(tshirt2[sortBy], tshirt1[sortBy]);
          }
        })
        .slice(offset, offset + limit);
    } else {
      tshirts = demoDatasource.slice(offset, offset + limit);
    }

    return {
      tshirts,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalCount: demoDatasource.length,
      },
    };
  }
}
