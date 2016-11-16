# ng2-md-datatable

[Angular 2](https://github.com/angular/angular) with [Material 2](https://github.com/angular/material2) is awesome, but it's still lacking a `Data Table` component (as of November 2016).

As I urgently needed one for a project, I decided to make my own `Data Table` component and share it on GitHub.

This may be useful for you (or not).

## Features
- Pagination
- Column sorting
- Row selection (using checkboxes)

## Working with
- Angular 2.x
- Material 2 Alpha (current is 2.0.0-alpha.10)

## Installation
To use ng2-md-datatable in your project install it via [npm](https://www.npmjs.com/package/ng2-md-datatable):
```
npm install --save ng2-md-datatable
```

## Markup
It basically look like this:

```
<app-md-datatable [selectable]="true|false">
  <app-md-datatable-header>
    <app-md-datatable-column sortValue="article">Article</app-md-datatable-column>
    <app-md-datatable-column sortValue="product">Product</app-md-datatable-column>
    <app-md-datatable-column sortValue="quantity">Quantity</app-md-datatable-column>
  </app-md-datatable-header>
  <tbody>
    <app-md-datatable-row selectableValue="K003-0350-001">
      <td>K003-0350-001</td>
      <td>Yirgacheffe Kaffee, 350g ganze Bohne</td>
      <td>232</td>
    </app-md-datatable-row>
    <app-md-datatable-row selectableValue="K003-0350-002">
      <td>K003-0350-002</td>
      <td>Yirgacheffe Kaffee, 350g gemahlen</td>
      <td>124</td>
    </app-md-datatable-row>
    <app-md-datatable-row selectableValue="K003-0350-003">
      <td>K003-0350-003</td>
      <td>Yirgacheffe Kaffee, 1kg ganze Bohne</td>
      <td>464</td>
    </app-md-datatable-row>
    <app-md-datatable-row selectableValue="K003-0350-004">
      <td>K003-0350-003</td>
      <td>Yirgacheffe Kaffee, 1kg gemahlen</td>
      <td>243</td>
    </app-md-datatable-row>
  </tbody>
</app-md-datatable>
```
