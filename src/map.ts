import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { Component } from '@ratiosolver/flick';

export class MapComponent extends Component<void, HTMLDivElement> {

  protected map: L.Map | undefined;

  constructor() {
    super(undefined, document.createElement('div'));
  }

  override mounted(): void {
    this.map = L.map(this.element);

    // Set initial view to Matera, Italy
    this.set_view([40.6667, 16.6000], 16);

    // Add OpenStreetMap tile layer
    this.add_tile_layer();
  }

  /**
   * Sets the view of the map to the specified center and zoom level.
   *
   * @param center - The geographical center of the map view, specified as a latitude and longitude pair.
   * @param zoom - The zoom level for the map view. Optional; if not provided, defaults to the current zoom level.
   * @param options - Optional parameters for zooming and panning.
   */
  set_view(center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions): this {
    this.map!.setView(center, zoom, options);
    return this;
  }

  /**
   * Adds a tile layer to the map using the specified URL and options.
   *
   * @param url - The URL template for the tile layer. Defaults to OpenStreetMap's standard tile server.
   * @param options - Optional configuration options for the tile layer.
   */
  add_tile_layer(url: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options: L.TileLayerOptions = {}): void {
    L.tileLayer(url, options).addTo(this.map!);
  }
}