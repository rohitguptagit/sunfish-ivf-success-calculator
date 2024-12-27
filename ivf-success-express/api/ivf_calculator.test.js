const { calculateIVFSuccess } = require("./ivf_calculator");

describe("calculateIVFSuccess", () => {
  it("should calculate the success rate correctly", async () => {
    const params = {
      using_own_eggs: true,
      attempted_ivf_previously: false,
      is_reason_for_infertility_known: false,
      user_age: 32,
      user_weight_in_lbs: 145.6,
      user_height_in_feet: 5,
      user_height_in_inches: 7,
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
