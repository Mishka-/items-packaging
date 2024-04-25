import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainRoomComponent } from './main-room/main-room.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ItemComponent } from './item/item.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { PackageAreaComponent } from './package-area/package-area.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { reducers, metaReducers } from './state/reducers';

@NgModule({
  declarations: [
    AppComponent,
    MainRoomComponent,
    ItemComponent,
    PackageAreaComponent,
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatCardModule,
    MatSidenavModule,
    AppRoutingModule,
    HttpClientModule,
    MatTooltipModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 10 }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
