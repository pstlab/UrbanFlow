import './style.css'
import { AppComponent, BrandComponent, Component } from '@ratiosolver/flick';
import { MapComponent } from './map';
import { Offcanvas } from './offcanvas';

const offcanvas_id = 'urban-flow-offcanvas';

class SliderComponent extends Component<void, HTMLDivElement> {

  public readonly input: HTMLInputElement;

  constructor() {
    super(undefined, document.createElement('div'));
    this.element.style.position = 'absolute';
    this.element.style.left = '0';
    this.element.style.right = '0';
    this.element.style.bottom = '24px';
    this.element.style.display = 'flex';
    this.element.style.justifyContent = 'center';
    this.element.style.zIndex = '1000'; // ensure it is above other elements

    this.input = document.createElement('input');
    this.input.type = 'range';
    this.input.min = '0';
    this.input.max = '100';
    this.input.value = '50';
    this.input.style.width = '70%';

    // Prevent map from handling drag events when interacting with the slider
    this.input.addEventListener('pointerdown', e => e.stopPropagation());
    this.input.addEventListener('pointermove', e => e.stopPropagation());
    this.input.addEventListener('pointerup', e => e.stopPropagation());
    this.input.addEventListener('mousedown', e => e.stopPropagation());
    this.input.addEventListener('mousemove', e => e.stopPropagation());
    this.input.addEventListener('mouseup', e => e.stopPropagation());
    this.input.addEventListener('touchstart', e => e.stopPropagation());
    this.input.addEventListener('touchmove', e => e.stopPropagation());
    this.input.addEventListener('touchend', e => e.stopPropagation());
    this.input.addEventListener('input', () => {
    });

    this.element.appendChild(this.input);
  }
}

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

    const slider = new SliderComponent();
    this.map.add_child(slider);
  }
}

new MyApp();
