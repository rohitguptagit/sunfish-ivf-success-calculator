import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('IVF Success Calculator App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders IVF Success Calculator title', () => {
    const titleElement = screen.getByText(/IVF Success Calculator/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders age input field with placeholder and helper text', () => {
    const ageInput = screen.getByPlaceholderText(/Enter age between 20 and 50 years/i);
    expect(screen.getByTestId('age')).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
  });

  test('renders weight input field', () => {
    const weightInput = screen.getByPlaceholderText(/Enter weight between 80-300 lbs/i);
    expect(screen.getByTestId('weight')).toBeInTheDocument();
    expect(weightInput).toBeInTheDocument();
  });

  test('renders height input fields', () => {
    const heightFeetInput = screen.getByPlaceholderText(/Feet/i);
    const heightInchesInput = screen.getByPlaceholderText(/Inches/i);
    expect(screen.getByTestId('height-feet')).toBeInTheDocument();
    expect(screen.getByTestId('height-inches')).toBeInTheDocument();
    expect(heightFeetInput).toBeInTheDocument();
    expect(heightInchesInput).toBeInTheDocument();
  });

  test('renders IVF usage label and select field', () => {
    expect(screen.getByTestId('ivf-usage-label')).toBeInTheDocument();
    expect(screen.getByTestId('ivf-usage')).toBeInTheDocument();
  });

  test('renders prior pregnancies label and select field', () => {
    expect(screen.getByTestId('prior-pregnancies-label')).toBeInTheDocument();
    expect(screen.getByTestId('prior-pregnancies')).toBeInTheDocument();
  });

  // test('renders prior live births select field when prior pregnancies is not "none"', async () => {
  //   const priorPregnanciesSelect = screen.getByTestId('prior-pregnancies');

  //   userEvent.click(priorPregnanciesSelect);

  //   const option = screen.findByText('1');
  //   userEvent.click(option);

  //   await waitFor(() => {
  //     expect(screen.getByTestId('prior-births')).toBeInTheDocument();
  //   });
  // });

  test('renders reason for IVF checkboxes', () => {
    const maleFactorCheckbox = screen.getByLabelText(/Male factor infertility/i);
    const endometriosisCheckbox = screen.getByLabelText(/Endometriosis/i);
    const tubalFactorCheckbox = screen.getByLabelText(/Tubal factor/i);
    const ovulatoryCheckbox = screen.getByLabelText(/Ovulatory disorder/i);
    const diminishedCheckbox = screen.getByLabelText(/Diminished ovarian reserve/i);
    const uterineFactorCheckbox = screen.getByLabelText(/Uterine factor/i);
    const otherCheckbox = screen.getByLabelText(/Other reason/i);
    const unexplainedCheckbox = screen.getByLabelText(/Unexplained \(Idiopathic\) infertility/i);
    const unknownCheckbox = screen.getByLabelText(/I don't know\/no reason/i);

    expect(maleFactorCheckbox).toBeInTheDocument();
    expect(endometriosisCheckbox).toBeInTheDocument();
    expect(tubalFactorCheckbox).toBeInTheDocument();
    expect(ovulatoryCheckbox).toBeInTheDocument();
    expect(diminishedCheckbox).toBeInTheDocument();
    expect(uterineFactorCheckbox).toBeInTheDocument();
    expect(otherCheckbox).toBeInTheDocument();
    expect(unexplainedCheckbox).toBeInTheDocument();
    expect(unknownCheckbox).toBeInTheDocument();
  });

  test('renders egg source select field and label', () => {
    expect(screen.getByTestId('egg-source-label')).toBeInTheDocument();
    expect(screen.getByTestId('egg-source')).toBeInTheDocument();
  });

  test('renders Calculate Success button', () => {
    const calculateButton = screen.getByText(/Calculate Success/i);
    expect(calculateButton).toBeInTheDocument();
  });

  test('renders Start Over button', () => {
    const startOverButton = screen.getByText(/Start Over/i);
    expect(startOverButton).toBeInTheDocument();
  });

  // -----------------------------
  // Error Handling Tests
  // -----------------------------
  // test('displays error messages if required fields are empty on submission', async () => {
  //   const calculateButton = screen.getByText(/Calculate Success/i);
  //   fireEvent.click(calculateButton);

  //   // Wait for error messages to appear.
  //   await waitFor(() => {
  //     expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
  //   });
  // });

  // -----------------------------
  // "Start Over" (Clear) Tests
  // -----------------------------
  test('clears the form when "Start Over" is clicked', () => {
    // Fill out a couple of fields
    const ageInput = screen.getByPlaceholderText(/Enter age between 20 and 50 years/i);
    fireEvent.change(ageInput, { target: { value: '30' } });

    const weightInput = screen.getByPlaceholderText(/Enter weight between 80-300 lbs/i);
    fireEvent.change(weightInput, { target: { value: '150' } });

    // Click "Start Over"
    const startOverButton = screen.getByText(/Start Over/i);
    fireEvent.click(startOverButton);

    // Check if fields have been cleared
    expect(ageInput.value).toBe('');
    expect(weightInput.value).toBe('');
  });

  // -----------------------------
  // Form Submission and Modal Tests
  // -----------------------------
  // test('opens modal with a doughnut chart on successful form submission', async () => {
  //   const ageInput = screen.getByPlaceholderText(/Enter age between 20 and 50 years/i);
  //   fireEvent.change(ageInput, { target: { value: '30' } });

  //   const weightInput = screen.getByPlaceholderText(/Enter weight between 80-300 lbs/i);
  //   fireEvent.change(weightInput, { target: { value: '150' } });

  //   const heightFeetInput = screen.getByPlaceholderText(/Feet/i);
  //   fireEvent.change(heightFeetInput, { target: { value: '5' } });

  //   const heightInchesInput = screen.getByPlaceholderText(/Inches/i);
  //   fireEvent.change(heightInchesInput, { target: { value: '6' } });

  //   const ivfUsageSelect = screen.getAllByLabelText(/Select an option/i)[0];
  //   fireEvent.change(ivfUsageSelect, { target: { value: 'never' } });

  //   const priorPregnanciesSelect = screen.getAllByLabelText(/Select an option/i)[1];
  //   fireEvent.change(priorPregnanciesSelect, { target: { value: 'none' } });

  //   const maleFactorCheckbox = screen.getByLabelText(/Male factor infertility/i);
  //   fireEvent.click(maleFactorCheckbox);

  //   const eggSourceSelect = screen.getByLabelText(/What is the source of your eggs\?/i);
  //   fireEvent.change(eggSourceSelect, { target: { value: 'own' } });

  //   const calculateButton = screen.getByText(/Calculate Success/i);
  //   fireEvent.click(calculateButton);

  //   const modal = await screen.findByRole('dialog');
  //   expect(modal).toBeInTheDocument();

  //   const canvasElements = modal.getElementsByTagName('canvas');
  //   expect(canvasElements.length).toBeGreaterThan(0);
  // });
});