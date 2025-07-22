import { Component } from "@ratiosolver/flick";

export class Offcanvas extends Component<void, HTMLDivElement> {

  constructor(id: string) {
    super(undefined, document.createElement('div'));

    this.element.classList.add('offcanvas', 'offcanvas-start', 'd-flex');
    this.element.tabIndex = -1;
    this.element.id = id;

    const body = document.createElement('div');
    body.classList.add('offcanvas-body', 'flex-column', 'flex-shrink-0', 'p-3', 'bg-light');

    const num_days_group = document.createElement('div');
    num_days_group.classList.add('input-group', 'mb-3');

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
    });

    num_days_group.append(num_days_input, num_days_button);

    const make_predictions_button = document.createElement('button');
    make_predictions_button.classList.add('btn', 'btn-primary', 'mb-3', 'w-100');
    make_predictions_button.type = 'button';
    make_predictions_button.textContent = 'Make Predictions';
    make_predictions_button.addEventListener('click', () => {
      console.log('Extra button clicked');
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

    body.append(num_days_group, make_predictions_button, get_predictions_group);

    this.element.append(body);
  }
}