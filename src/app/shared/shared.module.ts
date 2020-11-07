import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {QuillModule} from 'ngx-quill';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    QuillModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    QuillModule]

})
export class SharedModule {

}
