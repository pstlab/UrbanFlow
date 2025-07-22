import { Component } from "@ratiosolver/flick";

export interface Prediction {
  Category: string;
  time: number[];
  "Tile ID": number[];
  Tile_predictions: number[][];
}

export class Offcanvas extends Component<void, HTMLDivElement> {

  constructor(id: string, onPredictionsLoaded: (start: string, end: string, hours: string, predictions: Prediction[]) => void) {
    super(undefined, document.createElement('div'));

    this.element.classList.add('offcanvas', 'offcanvas-start', 'd-flex');
    this.element.tabIndex = -1;
    this.element.id = id;

    const body = document.createElement('div');
    body.classList.add('offcanvas-body', 'flex-column', 'flex-shrink-0', 'p-3', 'bg-light');

    // Add from date select group
    const from_date_select_group = document.createElement('div');
    from_date_select_group.classList.add('mb-3');

    const from_date_select_label = document.createElement('label');
    from_date_select_label.classList.add('form-label');
    from_date_select_label.textContent = 'From Date';

    const from_date_select = document.createElement('input');
    from_date_select.type = 'date';
    from_date_select.classList.add('form-control');
    // Set default to one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    from_date_select.value = oneMonthAgo.toISOString().split('T')[0];

    from_date_select_group.append(from_date_select_label, from_date_select);

    // Add to date select group
    const to_date_select_group = document.createElement('div');
    to_date_select_group.classList.add('mb-3');

    const to_date_select_label = document.createElement('label');
    to_date_select_label.classList.add('form-label');
    to_date_select_label.textContent = 'To Date';

    const to_date_select = document.createElement('input');
    to_date_select.type = 'date';
    to_date_select.classList.add('form-control');
    // Set default to today
    to_date_select.value = new Date().toISOString().split('T')[0];

    to_date_select_group.append(to_date_select_label, to_date_select);

    const load_data_button = document.createElement('button');
    load_data_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    load_data_button.type = 'button';
    load_data_button.textContent = 'Load Data';
    load_data_button.addEventListener('click', () => {
      console.log('Load data button clicked');
      load_data_button.disabled = true;
      load_data_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      fetch(`/set_input_data/${from_date_select.value}/${to_date_select.value}`)
        .then(response => response.text())
        .then(data => {
          load_data_button.disabled = false;
          load_data_button.textContent = 'Load Data';
          console.log('Data loaded:', data);
        })
        .catch(error => {
          load_data_button.disabled = false;
          load_data_button.textContent = 'Load Data';
          console.error('Error loading data:', error);
        });
    });

    const make_preprocessed_data_button = document.createElement('button');
    make_preprocessed_data_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    make_preprocessed_data_button.type = 'button';
    make_preprocessed_data_button.textContent = 'Make Preprocessed Data';
    make_preprocessed_data_button.addEventListener('click', () => {
      console.log('Make processed data button clicked');
      make_preprocessed_data_button.disabled = true;
      make_preprocessed_data_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
      fetch('/make_preprocessed_data')
        .then(response => response.text())
        .then(data => {
          make_preprocessed_data_button.disabled = false;
          make_preprocessed_data_button.textContent = 'Make Preprocessed Data';
          console.log('Processed data created:', data);
        })
        .catch(error => {
          make_preprocessed_data_button.disabled = false;
          make_preprocessed_data_button.textContent = 'Make Preprocessed Data';
          console.error('Error creating processed data:', error);
        });
    });

    const num_hours_group = document.createElement('div');
    num_hours_group.classList.add('input-group', 'mb-3');

    const num_hours_input = document.createElement('input');
    num_hours_input.type = 'number';
    num_hours_input.classList.add('form-control');
    num_hours_input.placeholder = 'Number of hours';
    num_hours_input.value = '24'; // Default value
    num_hours_input.min = '1';
    num_hours_input.step = '1';

    const num_hours_button = document.createElement('button');
    num_hours_button.classList.add('btn', 'btn-outline-secondary', 'btn-sm');
    num_hours_button.type = 'button';
    num_hours_button.textContent = 'Make Predictions';
    num_hours_button.addEventListener('click', () => {
      num_hours_button.disabled = true;
      num_hours_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      fetch(`/make_predictions/${from_date_select.value}/${to_date_select.value}/${num_hours_input.value}`)
        .then(response => response.text())
        .then(data => {
          num_hours_button.disabled = false;
          num_hours_button.textContent = 'Make Predictions';
          console.log('Data loaded:', data);
        })
        .catch(error => {
          num_hours_button.disabled = false;
          num_hours_button.textContent = 'Make Predictions';
          console.error('Error loading data:', error);
        });
    });

    num_hours_group.append(num_hours_input, num_hours_button);

    const get_predictions_button = document.createElement('button');
    get_predictions_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    get_predictions_button.type = 'button';
    get_predictions_button.textContent = 'Get Predictions';
    get_predictions_button.addEventListener('click', () => {
      console.log('Get predictions button clicked');
      get_predictions_button.disabled = true;
      get_predictions_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

      const predictionTypes = [
        "all",
        "foreigners",
        "intraregion",
        "italians",
        "outregion",
        "pendolari",
        "resident"
      ];
      const predictions: Prediction[] = [];
      for (const type of predictionTypes)
        fetch(`/get_predictions/${type}`)
          .then(response => response.json())
          .then((data: Prediction) => {
            get_predictions_button.disabled = false;
            get_predictions_button.textContent = 'Get Predictions';
            console.log('Predictions loaded:', data);
            predictions.push(data);
          })
          .catch(error => {
            get_predictions_button.disabled = false;
            get_predictions_button.textContent = 'Get Predictions';
            console.error('Error loading predictions:', error);
          });
      onPredictionsLoaded(from_date_select.value, to_date_select.value, num_hours_input.value, predictions);
    });

    body.append(from_date_select_group, to_date_select_group, load_data_button, make_preprocessed_data_button, num_hours_group, get_predictions_button);

    this.element.append(body);
  }
}