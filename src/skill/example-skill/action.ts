/**
 * @typedef {Object} Input - The input parameters for the example action.
 * @property {string} arg1 - The first argument for the example action.
 * @property {number} arg2 - The second argument for the example action (optional).
 */
type Input = {
  arg1: string;
  arg2?: number;
};

/**
 * @typedef {Object} Output - The output of the example action.
 * @property {string} result1 - The first result of the example action.
 * @property {string} result2 - The second result of the example action.
 */
type Output = {
  result1: string;
  result2: string;
};

/**
 * This is an example action function. You can replace this with your own action logic.
 *
 * @param {Input} input - The input parameters for the example action.
 *
 * @returns {Output} The output of the example action.
 */
export default function exampleAction({ arg1, arg2 = 1 }: Input): Output {
  return {
    result1: `Received arg1: ${arg1}`,
    result2: `Received arg2: ${arg2}`,
  };
}
