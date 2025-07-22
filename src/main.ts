import './style.css'
import { AppComponent, BrandComponent } from '@ratiosolver/flick';
import { MapComponent } from './map';
import { Offcanvas } from './offcanvas';

const offcanvas_id = 'urban-flow-offcanvas';

class MyApp extends AppComponent {

  // private readonly body: BodyComponent;
  private map: MapComponent | undefined;

  constructor() {
    super();

    // Create and add brand element
    this.navbar.add_child(new BrandComponent('UrbanFlow', 'favicon.ico', 32, 32, offcanvas_id));

    this.add_child(new Offcanvas(offcanvas_id));

    this.map = new MapComponent();
    this.map.element.style.width = '100%'; // Constrain to parent width
    this.map.element.style.height = '100%'; // Constrain to parent height
    this.add_child(this.map);
  }
}

new MyApp();
