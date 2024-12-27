# Getting Started with `IVF Success Calculator App`

This version of the IVF Success Calculator was built to mimic the version available on the official CDC website (https://www.cdc.gov/art/ivf-success-estimator/). A similar front-end setup is used for the form and identical formulas are used in the back-end for result calculations.

For this project, the front-end and back-end servers need to be set up separately. Before we get started, please go through the following steps to make sure you have the project ready to go:

**Step 1:** Clone the repository to your computer and open the folder in your desired Code Editor.

**Step 2:** Ensure you have two separate terminal windows open in your Code Editor.

**Step 3:** Ensure your Node.js version is up to date (this was built using Node.js `v23.5.0`). You can check your current Node.js version by running the command `node -v`.

**Step 4:** Ensure `npm` is up to date (`v11.0.0` was used here). You can check your current `npm` version by running the command `npm -v`.



## Front-End Setup

The front-end of this application was developed using a React framework. In order to run the front-end on your local server, please follow these steps:

**Step 1:** In the first terminal window, `cd` into the ivf-success-calculator folder using the command `cd ivf-success-calculator`.

**Step 2:** Run the command `npm install --legacy-peer-deps` to install all packages needed for this project to run properly.

**Step 3:** Run all tests using the command `npm run test` to ensure front-end rendering test cases are passing properly.

**Step 4:** Run the command `npm run start` to start the development server (the default URL for this is localhost:3000). This should open up your default browser to the URL http://localhost:3000/. If that doesn't happen, then feel free to copy and paste that URL in the browser to access the front-end UI of the application.



## Back-End Setup

The back-end of this application was developed using an Express.js framework. In order to run the back-end on your local server, please follow these steps:

**Step 1:** In the second terminal window, `cd` into the ivf-success-express folder using the command `cd ivf-success-express`.

**Step 2:** Run the command `npm install` to install all packages needed for this project to run properly.

**Step 3:** Run all tests using the command `npm run test` to ensure back-end formula-based test cases are passing properly.

**Step 4:** Run the command `npm start` to start the back-end server (hosted by default at Port `3001`).



## Ready to Go!

At this stage, you should have both the front-end and the back-end up and running. Feel free to use different form values within the application to test different results for each calculation. You can submit the form request using the 'Calculate Success' button at the bottom of the page. You will receive a response in the form of an object containing the score and the success rate (this can be viewed using the browser console). The visual representation of the response is discussed below.

### Notes:

* The application has error handling built in to the front-end to ensure numerical input submission ranges are satisfied and all required fields are populated.

* The form can be reset using the 'Start Over' button at the bottom of the page.

* Clicking the 'Calculate Success' button sends the form submission elements to the pre-configured REST API (POST request) endpoint which signals the Express.js back-end setup to perform the calculation.

* After the calculation has been completed, a modal containing a Doughnut Chart should appear with the Success Rate result appearing in the middle of the chart as a percentage. The pink portion of the chart represents the Success Rate while the white portion represents the failure rate. The modal can be closed by clicking the close icon at the top right of the page or by hitting the `Esc` key.