const csv = require("csvtojson");

const readIVFFormulas = async () => {
  return await csv().fromFile(__dirname + "/../ivf_success_formulas.csv");
};

const getIVFFormula = async (
  using_own_eggs,
  attempted_ivf_previously,
  is_reason_for_infertility_known
) => {
  const formulas = await readIVFFormulas();

  // Find correct formula
  const formula = formulas.find(
    (f) =>
      f.param_using_own_eggs === using_own_eggs &&
      (f.param_attempted_ivf_previously === attempted_ivf_previously ||
        f.param_attempted_ivf_previously === "N/A") &&
      f.param_is_reason_for_infertility_known ===
        is_reason_for_infertility_known
  );

  // Parse floats
  Object.keys(formula).forEach((key) => {
    if (
      ![
        "param_using_own_eggs",
        "param_attempted_ivf_previously",
        "param_is_reason_for_infertility_known",
        "cdc_formula",
      ].includes(key)
    ) {
      formula[key] = parseFloat(formula[key]);
    }
  });

  return formula;
};

const calculateBMI = (
  user_weight_in_lbs,
  user_height_in_feet,
  user_height_in_inches
) => {
  return (
    (user_weight_in_lbs /
      (user_height_in_feet * 12 + user_height_in_inches) ** 2) *
    703
  );
};

const calculateSumReasonFactors = (possible_infertility_reasons, formula) => {
  let sum = 0.0;
  for (const [reason, value] of Object.entries(possible_infertility_reasons)) {
    const value_text = value ? "true" : "false";
    sum += formula[`formula_${reason}_${value_text}_value`];
  }
  return sum;
};

const calculateSumNumericalFactors = (
  num_prior_pregnancies,
  num_prior_live_births,
  formula
) => {
  let sum = 0.0;

  const num_prior_pregnancies_value =
    num_prior_pregnancies < 2 ? num_prior_pregnancies : "2+";
  const num_prior_live_births_value =
    num_prior_live_births < 2 ? num_prior_live_births : "2+";

  sum +=
    formula[`formula_prior_pregnancies_${num_prior_pregnancies_value}_value`];
  sum +=
    formula[`formula_prior_live_births_${num_prior_live_births_value}_value`];

  return sum;
};

const calculateIVFSuccess = async (params = {}) => {
  const {
    using_own_eggs,
    attempted_ivf_previously,
    is_reason_for_infertility_known,
    user_age,
    user_weight_in_lbs,
    user_height_in_feet,
    user_height_in_inches,
    possible_infertility_reasons,
    num_prior_pregnancies,
    num_prior_live_births,
  } = params;

  const formula = await getIVFFormula(
    using_own_eggs ? "TRUE" : "FALSE",
    attempted_ivf_previously ? "TRUE" : "FALSE",
    is_reason_for_infertility_known ? "TRUE" : "FALSE"
  );

  console.log("Using IVF formula", formula.cdc_formula);

  const user_bmi = calculateBMI(
    user_weight_in_lbs,
    user_height_in_feet,
    user_height_in_inches
  );

  const score =
    formula.formula_intercept +
    formula.formula_age_linear_coefficient * user_age +
    formula.formula_age_power_coefficient *
      Math.pow(user_age, formula.formula_age_power_factor) +
    formula.formula_bmi_linear_coefficient * user_bmi +
    formula.formula_bmi_power_coefficient *
      Math.pow(user_bmi, formula.formula_bmi_power_factor) +
    calculateSumReasonFactors(possible_infertility_reasons, formula) +
    calculateSumNumericalFactors(
      num_prior_pregnancies,
      num_prior_live_births,
      formula
    );

  const success_rate = ((Math.exp(score) / (1 + Math.exp(score))) * 100);

  console.log("score:", score);
  console.log("success_rate:", success_rate);

  return {
    score,
    success_rate,
  };
};

module.exports = {
  calculateIVFSuccess,
};
