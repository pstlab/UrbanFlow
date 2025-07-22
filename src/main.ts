import './style.css'
import { AppComponent, BrandComponent, Component } from '@ratiosolver/flick';
import { HeatMapLayer, MapComponent, type HeatTile } from './map';
import { Offcanvas, type Prediction } from './offcanvas';

const offcanvas_id = 'urban-flow-offcanvas';

class SliderComponent extends Component<void, HTMLDivElement> {

  public readonly input: HTMLInputElement;

  constructor(onInput: (value: number) => void) {
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
    this.input.addEventListener('input', () => onInput(parseInt(this.input.value)));

    this.element.appendChild(this.input);
  }
}

interface Tile {
  Lat: number;
  LatMax: number;
  LatMin: number;
  Lon: number;
  LonMax: number;
  LonMin: number;
  TileX: number;
  TileY: number;
}

class MyApp extends AppComponent {

  private map: MapComponent | undefined;
  private tiles: L.LatLngBoundsExpression[] = []; // Store tile bounds
  private layers: Map<string, HeatMapLayer[]> = new Map();
  private c_layers: Map<string, HeatMapLayer> = new Map();
  private times: Map<string, number[]> = new Map();

  constructor() {
    super();

    // Create and add brand element
    this.navbar.add_child(new BrandComponent('UrbanFlow', 'favicon.ico', 32, 32, offcanvas_id));

    const slider = new SliderComponent((value: number) => {
      for (const [category, layer] of this.c_layers.entries()) {
        this.map?.remove_layer(layer);
        const new_layer = this.layers.get(category)![value];
        this.map?.add_layer(new_layer);
        this.c_layers.set(category, new_layer);
      }
    });

    this.add_child(new Offcanvas(offcanvas_id, (start: string, end: string, hours: string, predictions: Prediction[]) => {
      console.log('Start:', start);
      console.log('End:', end);
      console.log('Hours:', hours);
      console.log('Predictions:', predictions);
      this.layers.clear();
      this.c_layers.clear();
      this.times.clear();
      let times = 0;
      for (const prediction of predictions) {
        this.layers.set(prediction.Category, []);
        this.times.set(prediction.Category, prediction.time);
        if (times < prediction.time.length) times = prediction.time.length;
        for (const [time_idx, _] of prediction.time.entries()) {
          const tiles: HeatTile[] = [];
          for (const [tile_idx, tile_id] of prediction['Tile ID'].entries())
            tiles.push({ bounds: this.tiles[tile_id], value: prediction.Tile_predictions[tile_idx][time_idx] });
          const layer = new HeatMapLayer(tiles);
          this.layers.get(prediction.Category)?.push(layer);
        }
      }
      slider.input.max = String(times - 1);
    }));

    this.map = new MapComponent();
    this.map.element.style.width = '100%'; // Constrain to parent width
    this.map.element.style.height = '100%'; // Constrain to parent height
    this.add_child(this.map);

    this.map.add_child(slider);

    fetch('/tiles')
      .then(response => response.json())
      .then((data: Tile[]) => {
        this.tiles = data.map(tileData => [[tileData.LatMin, tileData.LonMin], [tileData.LatMax, tileData.LonMax]]);
        console.log('Tiles loaded:', this.tiles);
      })
      .catch(error => console.error('Error fetching tiles:', error));
  }
}

new MyApp();
