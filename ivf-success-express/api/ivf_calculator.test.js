const { calculateIVFSuccess } = require("./ivf_calculator");

// GitHub Example 1: Using Own Eggs / Did Not Previously Attempt IVF / Known Infertility Reason
describe("calculateIVFSuccess", () => {
  it("should calculate the success rate correctly -example_1", async () => {
    const params = {
      using_own_eggs: true,
      attempted_ivf_previously: false,
      is_reason_for_infertility_known: true,
      user_age: 32,
      user_weight_in_lbs: 150,
      user_height_in_feet: 5,
      user_height_in_inches: 8,
      possible_infertility_reasons: {
        tubal_factor: false,
        male_factor_infertility: false,
        endometriosis: true,
        ovulatory_disorder: true,
        diminished_ovarian_reserve: false,
        uterine_factor: false,
        other_reason: false,
        unexplained_infertility: false,
      },
      num_prior_pregnancies: 1,
      num_prior_live_births: 1,
    };

    const result = await calculateIVFSuccess(params);

    expect(result.score).toBeCloseTo(0.4982, 3);
    expect(result.success_rate).toBeCloseTo(62.21, 2);
  });
});

// GitHub Example 2: Using Own Eggs / Did Not Previously Attempt IVF / Unknown Infertility Reason
describe("calculateIVFSuccess", () => {
  it("should calculate the success rate correctly -example_2", async () => {
    const params = {
      using_own_eggs: true,
      attempted_ivf_previously: false,
      is_reason_for_infertility_known: false,
      user_age: 32,
      user_weight_in_lbs: 150,
      user_height_in_feet: 5,
      user_height_in_inches: 8,
      possible_infertility_reasons: {
        tubal_factor: false,
        male_factor_infertility: false,
        endometriosis: false,
        ovulatory_disorder: false,
        diminished_ovarian_reserve: false,
        uterine_factor: false,
        other_reason: false,
        unexplained_infertility: false,
      },
      num_prior_pregnancies: 1,
      num_prior_live_births: 1,
    };

    const result = await calculateIVFSuccess(params);

    expect(result.score).toBeCloseTo(0.3985, 3);
    expect(result.success_rate).toBeCloseTo(59.83, 2);
  });
});

// GitHub Example 3: Using Own Eggs / Previously Attempted IVF / Known Infertility Reason
describe("calculateIVFSuccess", () => {
  it("should calculate the success rate correctly -example_3", async () => {
    const params = {
      using_own_eggs: true,
      attempted_ivf_previously: true,
      is_reason_for_infertility_known: true,
      user_age: 32,
      user_weight_in_lbs: 150,
      user_height_in_feet: 5,
      user_height_in_inches: 8,
      possible_infertility_reasons: {
        tubal_factor: true,
        male_factor_infertility: false,
        endometriosis: false,
        ovulatory_disorder: false,
        diminished_ovarian_reserve: true,
        uterine_factor: false,
        other_reason: false,
        unexplained_infertility: false,
      },
      num_prior_pregnancies: 1,
      num_prior_live_births: 1,
    };

    const result = await calculateIVFSuccess(params);

    expect(result.score).toBeCloseTo(-0.3683, 3);
    expect(result.success_rate).toBeCloseTo(40.89, 2);
  });
});
