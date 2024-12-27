import React, { useState } from 'react';
import './App.css';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, FormGroup, FormHelperText, Modal, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CloseIcon from '@mui/icons-material/Close';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [formValues, setFormValues] = useState({
    age: '',
    weight: '',
    heightFeet: '',
    heightInches: '',
    ivfUsage: '',
    reasonIVF: [],
    eggSource: '',
    priorPregnancies: '',
    priorBirths: 'none'
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      if (value === 'unexplained' || value === 'unknown') {
        setFormValues((prevValues) => ({
          ...prevValues,
          reasonIVF: checked ? [value] : []
        }));
      } else {
        setFormValues((prevValues) => ({
          ...prevValues,
          reasonIVF: checked
            ? [...prevValues.reasonIVF.filter((reason) => reason !== 'unexplained' && reason !== 'unknown'), value]
            : prevValues.reasonIVF.filter((reason) => reason !== value)
        }));
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    }
  };

  const handleClear = () => {
    setFormValues({
      age: '',
      weight: '',
      heightFeet: '',
      heightInches: '',
      ivfUsage: '',
      reasonIVF: [],
      eggSource: '',
      priorPregnancies: '',
      priorBirths: 'none'
    });
    setErrors({});
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.age = formValues.age ? (formValues.age >= 20 && formValues.age <= 50 ? "" : "Age must be between 20 and 50") : "This field is required";
    tempErrors.weight = formValues.weight ? (formValues.weight >= 80 && formValues.weight <= 300 ? "" : "Weight must be between 80 and 300 lbs") : "This field is required";
    tempErrors.heightFeet = formValues.heightFeet ? (formValues.heightFeet >= 3 && formValues.heightFeet <= 8 ? "" : "Height (feet) must be between 3 and 8") : "This field is required";
    tempErrors.heightInches = formValues.heightInches ? (formValues.heightInches >= 0 && formValues.heightInches <= 11 ? "" : "Height (inches) must be between 0 and 11") : "This field is required";
    tempErrors.ivfUsage = formValues.ivfUsage ? "" : "This field is required";
    tempErrors.reasonIVF = formValues.reasonIVF.length > 0 ? "" : "This field is required";
    tempErrors.eggSource = formValues.eggSource ? "" : "This field is required";
    tempErrors.priorPregnancies = formValues.priorPregnancies ? "" : "This field is required";
    if (formValues.priorPregnancies !== 'none') {
      tempErrors.priorBirths = formValues.priorBirths ? "" : "This field is required";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const data = {
        using_own_eggs: formValues.eggSource === 'own',
        attempted_ivf_previously: formValues.ivfUsage !== 'never',
        is_reason_for_infertility_known: !formValues.reasonIVF.includes('unexplained') && !formValues.reasonIVF.includes('unknown'),
        user_age: parseInt(formValues.age, 10),
        user_weight_in_lbs: parseInt(formValues.weight, 10),
        user_height_in_feet: parseInt(formValues.heightFeet, 10),
        user_height_in_inches: parseInt(formValues.heightInches, 10),
        possible_infertility_reasons: {
          tubal_factor: formValues.reasonIVF.includes('tubal'),
          male_factor_infertility: formValues.reasonIVF.includes('male'),
          endometriosis: formValues.reasonIVF.includes('endometriosis'),
          ovulatory_disorder: formValues.reasonIVF.includes('ovulatory'),
          diminished_ovarian_reserve: formValues.reasonIVF.includes('diminished'),
          uterine_factor: formValues.reasonIVF.includes('uterine'),
          other_reason: formValues.reasonIVF.includes('other'),
          unexplained_infertility: formValues.reasonIVF.includes('unexplained')
        },
        num_prior_pregnancies: formValues.priorPregnancies === 'none' ? 0 : parseInt(formValues.priorPregnancies, 10),
        num_prior_live_births: formValues.priorBirths === 'none' ? 0 : parseInt(formValues.priorBirths, 10)
      };

      try {
        const response = await fetch('http://localhost:3001/ivf_calculator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setProgress(parseFloat(result.success_rate.toFixed(0))); // Assuming the result contains a success parameter
        setOpen(true); // Open the modal
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const data = {
    labels: ['Successful', 'Unsuccessful'],
    datasets: [
      {
        label: 'IVF Success Rate',
        data: [progress, 100 - progress],
        backgroundColor: [
          '#CE92D8',
          'white'
        ],
        borderColor: [
          'white',
          'white'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Container maxWidth="md" className="containerSpacing">
          <Typography variant="h4" component="h1" gutterBottom className="title">
            IVF Success Calculator
            <div className="aurora">
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
            </div>
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="row" gap={6} alignItems="flex-start">
              <Box flex={1}>
                <Typography variant="h6" component="h2" gutterBottom className="subtitle">
                  Background and History
                </Typography>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">How old are you?</Typography>
                  <TextField
                    id="age"
                    name="age"
                    type="number"
                    InputProps={{ inputProps: { min: 20, max: 50 } }}
                    placeholder="Enter age between 20 and 50 years"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    value={formValues.age}
                    onChange={handleChange}
                    error={!!errors.age}
                    helperText={errors.age}
                  />
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">How much do you weigh?</Typography>
                  <TextField
                    id="weight"
                    name="weight"
                    type="number"
                    InputProps={{ inputProps: { min: 80, max: 300 } }}
                    placeholder="Enter weight between 80-300 lbs"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    value={formValues.weight}
                    onChange={handleChange}
                    error={!!errors.weight}
                    helperText={errors.weight}
                  />
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">How tall are you?</Typography>
                  <Box display="flex" gap={2}>
                    <TextField
                      id="height-feet"
                      name="heightFeet"
                      type="number"
                      InputProps={{ inputProps: { min: 3, max: 8 } }}
                      placeholder="Feet"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={formValues.heightFeet}
                      onChange={handleChange}
                      error={!!errors.heightFeet}
                      helperText={errors.heightFeet}
                    />
                    <TextField
                      id="height-inches"
                      name="heightInches"
                      type="number"
                      InputProps={{ inputProps: { min: 0, max: 11 } }}
                      placeholder="Inches"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={formValues.heightInches}
                      onChange={handleChange}
                      error={!!errors.heightInches}
                      helperText={errors.heightInches}
                    />
                  </Box>
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">How many times have you used IVF in the past (include all cycles, even those not resulting in pregnancy)?</Typography>
                  <FormControl variant="outlined" margin="dense" fullWidth error={!!errors.ivfUsage}>
                    <InputLabel id="ivf-usage-label">Select an option</InputLabel>
                    <Select
                      labelId="ivf-usage-label"
                      id="ivf-usage"
                      name="ivfUsage"
                      label="Select an option"
                      value={formValues.ivfUsage}
                      onChange={handleChange}
                    >
                      <MenuItem value="never">I've never used IVF</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3+">3 or more</MenuItem>
                    </Select>
                    {errors.ivfUsage && <FormHelperText>{errors.ivfUsage}</FormHelperText>}
                  </FormControl>
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">How many prior pregnancies have you had?</Typography>
                  <FormControl variant="outlined" margin="dense" fullWidth error={!!errors.priorPregnancies}>
                    <InputLabel id="prior-pregnancies-label">Select an option</InputLabel>
                    <Select
                      labelId="prior-pregnancies-label"
                      id="prior-pregnancies"
                      name="priorPregnancies"
                      label="Select an option"
                      value={formValues.priorPregnancies}
                      onChange={handleChange}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2+">2 or more</MenuItem>
                    </Select>
                    {errors.priorPregnancies && <FormHelperText>{errors.priorPregnancies}</FormHelperText>}
                  </FormControl>
                </Box>
                {formValues.priorPregnancies && formValues.priorPregnancies !== 'none' && (
                  <Box marginBottom={1}>
                    <Typography variant="body1" align="left">How many prior live births have you had?</Typography>
                    <FormControl variant="outlined" margin="dense" fullWidth error={!!errors.priorBirths}>
                      <InputLabel id="prior-births-label">Select an option</InputLabel>
                      <Select
                        labelId="prior-births-label"
                        id="prior-births"
                        name="priorBirths"
                        label="Select an option"
                        value={formValues.priorBirths}
                        onChange={handleChange}
                        disabled={formValues.priorPregnancies === 'none'}
                      >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2+" disabled={formValues.priorPregnancies === '1'}>2 or more</MenuItem>
                      </Select>
                      {errors.priorBirths && <FormHelperText>{errors.priorBirths}</FormHelperText>}
                    </FormControl>
                  </Box>
                )}
              </Box>
              <Box flex={1}>
                <Typography variant="h6" component="h2" gutterBottom className="subtitle">
                  Diagnosis and Plan
                </Typography>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">What is the reason you are using IVF? (select all that apply)</Typography>
                  <FormControl component="fieldset" margin="dense" fullWidth error={!!errors.reasonIVF}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('male')} onChange={handleChange} name="reasonIVF" value="male" />}
                        label="Male factor infertility"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('endometriosis')} onChange={handleChange} name="reasonIVF" value="endometriosis" />}
                        label="Endometriosis"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('tubal')} onChange={handleChange} name="reasonIVF" value="tubal" />}
                        label="Tubal factor"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('ovulatory')} onChange={handleChange} name="reasonIVF" value="ovulatory" />}
                        label="Ovulatory disorder (including PCOS)"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('diminished')} onChange={handleChange} name="reasonIVF" value="diminished" />}
                        label="Diminished ovarian reserve"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('uterine')} onChange={handleChange} name="reasonIVF" value="uterine" />}
                        label="Uterine factor"
                        className="checkboxLabel"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formValues.reasonIVF.includes('other')} onChange={handleChange} name="reasonIVF" value="other" />}
                        label="Other reason"
                        className="checkboxLabel"
                      />
                    </FormGroup>
                    <Typography variant="body1" gutterBottom>
                      (Or)
                    </Typography>
                    <FormControlLabel
                      control={<Checkbox checked={formValues.reasonIVF.includes('unexplained')} onChange={handleChange} name="reasonIVF" value="unexplained" />}
                      label="Unexplained (Idiopathic) infertility"
                      className="checkboxLabel"
                    />
                    <Typography variant="body1" gutterBottom>
                      (Or)
                    </Typography>
                    <FormControlLabel
                      control={<Checkbox checked={formValues.reasonIVF.includes('unknown')} onChange={handleChange} name="reasonIVF" value="unknown" />}
                      label="I don't know/no reason"
                      className="checkboxLabel"
                    />
                    {errors.reasonIVF && <FormHelperText>{errors.reasonIVF}</FormHelperText>}
                  </FormControl>
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="body1" align="left">What is the source of your eggs?</Typography>
                  <FormControl variant="outlined" margin="dense" fullWidth error={!!errors.eggSource}>
                    <InputLabel id="egg-source-label">Select an option</InputLabel>
                    <Select
                      labelId="egg-source-label"
                      id="egg-source"
                      name="eggSource"
                      label="Select an option"
                      value={formValues.eggSource}
                      onChange={handleChange}
                    >
                      <MenuItem value="own">My own eggs</MenuItem>
                      <MenuItem value="donor">Donor eggs</MenuItem>
                    </Select>
                    {errors.eggSource && <FormHelperText>{errors.eggSource}</FormHelperText>}
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
              <Button variant="contained" color="primary" type="submit">
                Calculate Success
              </Button>
              <Button variant="contained" color="secondary" onClick={handleClear}>
                Start Over
              </Button>
            </Box>
          </form>
        </Container>
        <Modal open={open} onClose={handleClose} className="popup">
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh" position="relative">
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box display="flex" justifyContent="center" alignItems="center" className="popupBox" position="relative">
            <Doughnut
              data={data}
            />
            <Typography variant="h2" component="h1" gutterBottom className="result">
            {progress}%
          </Typography>
            </Box>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default App;