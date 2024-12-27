import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders IVF Success Calculator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/IVF Success Calculator/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders age input field', () => {
  render(<App />);
  const ageInput = screen.getByPlaceholderText(/Enter age between 20 and 50 years/i);
  expect(ageInput).toBeInTheDocument();
});

test('renders weight input field', () => {
  render(<App />);
  const weightInput = screen.getByPlaceholderText(/Enter weight between 80-300 lbs/i);
  expect(weightInput).toBeInTheDocument();
});

test('renders height input fields', () => {
  render(<App />);
  const heightFeetInput = screen.getByPlaceholderText(/Feet/i);
  const heightInchesInput = screen.getByPlaceholderText(/Inches/i);
  expect(heightFeetInput).toBeInTheDocument();
  expect(heightInchesInput).toBeInTheDocument();
});

test('renders IVF usage select field', () => {
  render(<App />);
  const ivfUsageSelect = screen.getByLabelText(/Select an option/i);
  expect(ivfUsageSelect).toBeInTheDocument();
});

test('renders prior pregnancies select field', () => {
  render(<App />);
  const priorPregnanciesSelect = screen.getByLabelText(/Select an option/i);
  expect(priorPregnanciesSelect).toBeInTheDocument();
});

test('renders prior live births select field when prior pregnancies is not none', () => {
  render(<App />);
  const priorPregnanciesSelect = screen.getByLabelText(/Select an option/i);
  fireEvent.change(priorPregnanciesSelect, { target: { value: '1' } });
  const priorBirthsSelect = screen.getByLabelText(/Select an option/i);
  expect(priorBirthsSelect).toBeInTheDocument();
});

test('renders reason for IVF checkboxes', () => {
  render(<App />);
  const maleFactorCheckbox = screen.getByLabelText(/Male factor infertility/i);
  const endometriosisCheckbox = screen.getByLabelText(/Endometriosis/i);
  expect(maleFactorCheckbox).toBeInTheDocument();
  expect(endometriosisCheckbox).toBeInTheDocument();
});

test('renders egg source select field', () => {
  render(<App />);
  const eggSourceSelect = screen.getByLabelText(/Select an option/i);
  expect(eggSourceSelect).toBeInTheDocument();
});

test('renders Calculate Success button', () => {
  render(<App />);
  const calculateButton = screen.getByText(/Calculate Success/i);
  expect(calculateButton).toBeInTheDocument();
});

test('renders Start Over button', () => {
  render(<App />);
  const startOverButton = screen.getByText(/Start Over/i);
  expect(startOverButton).toBeInTheDocument();
});

test('opens modal with doughnut chart on successful form submission', async () => {
  render(<App />);
  const calculateButton = screen.getByText(/Calculate Success/i);
  fireEvent.click(calculateButton);
  const modal = await screen.findByRole('dialog');
  expect(modal).toBeInTheDocument();
  const doughnutChart = screen.getByRole('img', { name: /chart/i });
  expect(doughnutChart).toBeInTheDocument();
});