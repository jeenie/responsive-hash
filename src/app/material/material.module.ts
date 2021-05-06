import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';

import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule
  ],
  exports: [
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    DragDropModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule
  ]
})
export class MaterialModule { }
