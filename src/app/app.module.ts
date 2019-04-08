import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TruncateStr } from './truncate-str.pipe';

// Material
import{MatButtonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule,} from '@angular/material';

// ng-Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Angular Material
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular SVG round progressbar
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    AppComponent,
    TruncateStr,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
    RoundProgressModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
