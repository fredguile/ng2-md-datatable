# ng2-md-datatable

[Angular 2](https://github.com/angular/angular) with [Material 2](https://github.com/angular/material2) is awesome, but it's still lacking a `DataTable` component (as of November 2016).

As I urgently needed one for a project, I decided to make my own `DataTable` component and share it on GitHub.

This may be useful for you (or not).

## Features
- Pagination Component
- Column sorting (ascending/descending)
- Row selection (using checkboxes)

## Working with
- Angular 2.x
- Material 2 current Alpha (current is 2.0.0-alpha.10)

## Installation
To use ng2-md-datatable in your project install it via [npm](https://www.npmjs.com/package/ng2-md-datatable):
```
npm install --save ng2-md-datatable
```

Then include it in your application's main module:

```ts
import { MdDataTableModule } from 'ng2-md-datatable';

@NgModule({
  imports: [
    ...
    MdDataTableModule.forRoot(),
    ...
```

## Usage
Your datatable would look like this in a Angular 2 template:

```
<ng2-md-datatable [selectable]="true|false">
  <ng2-md-datatable-header>
    <ng2-md-datatable-column sortValue="article">Article</ng2-md-datatable-column>
    <ng2-md-datatable-column sortValue="product">Product</ng2-md-datatable-column>
    <ng2-md-datatable-column sortValue="quantity">Quantity</ng2-md-datatable-column>
  </ng2-md-datatable-header>
  <tbody>
    <ng2-md-datatable-row selectableValue="K003-0350-001">
      <td>K003-0350-001</td>
      <td>Yirgacheffe Kaffee, 350g ganze Bohne</td>
      <td>232</td>
    </ng2-md-datatable-row>
    <ng2-md-datatable-row selectableValue="K003-0350-002">
      <td>K003-0350-002</td>
      <td>Yirgacheffe Kaffee, 350g gemahlen</td>
      <td>124</td>
    </ng2-md-datatable-row>
    <ng2-md-datatable-row selectableValue="K003-0350-003">
      <td>K003-0350-003</td>
      <td>Yirgacheffe Kaffee, 1kg ganze Bohne</td>
      <td>464</td>
    </ng2-md-datatable-row>
    <ng2-md-datatable-row selectableValue="K003-0350-004">
      <td>K003-0350-003</td>
      <td>Yirgacheffe Kaffee, 1kg gemahlen</td>
      <td>243</td>
    </ng2-md-datatable-row>
  </tbody>
</ng2-md-datatable>
```

Here's the pagination component:

```
<ng2-md-datatable-pagination
  [currentPage]="1"
  [itemsPerPage]="5"
  [itemsCount]="700"
  [itemsPerPageChoices]="[5,10,20,50]"
  [itemsPerPageFirstChoice]="10"
  >
</ng2-md-datatable-pagination>
```

As you might have noticed, these two components are not initially linked, it is up to you to bind them to your datasource and react to events they fire.

## Events

You should subscribe to these event emitters:

**src/md-datatable.component.ts**
```ts
@Output() selectionChange: EventEmitter<IDatatableSelectionEvent>;
@Output() sortChange: EventEmitter<IDatatableSortEvent>;
```

**src/md-datatable-pagination.component.ts**
```ts
@Output() paginationChange: EventEmitter<IDatatablePaginationEvent>;
```

Please read **src/md-datatable.interfaces.ts** for details about the payload of each event.

## Theming

To add `ng2-md-datatable` to your Material 2 theming file:

```scss
@import '~ng2-md-datatable/md-datatable-theme';
...
@include md-datatable-theme($theme);
```

This is based on the [current guide](https://github.com/angular/material2/blob/master/docs/theming-your-components.md) for theming components with Material 2 Alpha.
