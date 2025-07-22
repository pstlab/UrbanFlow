import { Component } from "@ratiosolver/flick";

export class Offcanvas extends Component<void, HTMLDivElement> {

  constructor(id: string) {
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

    const num_days_group = document.createElement('div');
    num_days_group.classList.add('input-group', 'mb-3');

    const load_data_button = document.createElement('button');
    load_data_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    load_data_button.type = 'button';
    load_data_button.textContent = 'Load Data';
    load_data_button.addEventListener('click', () => {
      console.log('Load data button clicked');
      load_data_button.disabled = true;
      load_data_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      fetch(`/set_input_data/${from_date_select.value}/${to_date_select.value}`)
        .then(response => response.json())
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

    const num_days_input = document.createElement('input');
    num_days_input.type = 'number';
    num_days_input.classList.add('form-control');
    num_days_input.placeholder = 'Number of days';
    num_days_input.value = '7'; // Default value
    num_days_input.min = '1';
    num_days_input.step = '1';

    const num_days_button = document.createElement('button');
    num_days_button.classList.add('btn', 'btn-outline-secondary', 'btn-sm');
    num_days_button.type = 'button';
    num_days_button.textContent = 'Load';
    num_days_button.addEventListener('click', () => {
      num_days_button.disabled = true;
      num_days_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      fetch(`/set_input_data/${num_days_input.value}`)
        .then(response => response.json())
        .then(data => {
          num_days_button.disabled = false;
          num_days_button.textContent = 'Load';
          console.log('Data loaded:', data);
        })
        .catch(error => {
          num_days_button.disabled = false;
          num_days_button.textContent = 'Load';
          console.error('Error loading data:', error);
        });
    });

    num_days_group.append(num_days_input, num_days_button);

    const make_predictions_button = document.createElement('button');
    make_predictions_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    make_predictions_button.type = 'button';
    make_predictions_button.textContent = 'Make Predictions';
    make_predictions_button.addEventListener('click', () => {
      console.log('Make predictions button clicked');
    });

    const get_predictions_group = document.createElement('div');
    get_predictions_group.classList.add('input-group', 'mb-3');

    const get_predictions_select = document.createElement('select');
    get_predictions_select.classList.add('form-select');
    get_predictions_select.innerHTML = `
      <option value="all">All Predictions</option>
      <option value="foreigners">Foreigners</option>
      <option value="intraregion">Intraregion</option>
      <option value="italians">Italians</option>
      <option value="outregion">Outregion</option>
      <option value="pendolari">Commuters</option>
      <option value="resident">Resident</option>
    `;
    get_predictions_select.value = 'all';

    const get_predictions_button = document.createElement('button');
    get_predictions_button.classList.add('btn', 'btn-outline-secondary', 'btn-sm');
    get_predictions_button.type = 'button';
    get_predictions_button.textContent = 'Get Predictions';
    get_predictions_button.addEventListener('click', () => {
      get_predictions_button.disabled = true;
      get_predictions_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    });

    get_predictions_group.append(get_predictions_select, get_predictions_button);

    body.append(from_date_select_group, to_date_select_group, load_data_button, num_days_group, make_predictions_button, get_predictions_group);

    this.element.append(body);
  }
}