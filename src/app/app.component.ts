import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Metadata Registry Service';

  public dynamicClass = 'notScrolled';

  @ViewChild('navbar')
  public navbar: ElementRef;

  @HostListener('window:scroll', ['$event'])
  navBarScroll(event) {
    if (window.scrollY > 50) {
      this.dynamicClass = 'scrolled';
    } else {
      this.dynamicClass = 'notScrolled';
    }
    // console.log('this works');
    // console.log(event);
  }

  // navBarScroll(event) {
  //   if (this.navbar.nativeElement.scrollHeight > 20) {
  //     console.log('Scroll > 20!!');
  //   }
  //   console.log('this works');
  //   console.log(event);
  // }
}
