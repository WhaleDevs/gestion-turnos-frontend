import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroUserPlus } from '@ng-icons/heroicons/outline';
import { heroTrashSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-today',
  imports: [NgIcon],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss',
  providers: [provideIcons({heroTrash, heroUserPlus, heroTrashSolid})]
})
export class TodayComponent {

}
