import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule, SharedModule],
})
export class GameModule {}
