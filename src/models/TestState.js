import _ from "lodash";

export const TestStatus = {
  NOT_RUN: "not_run",
  RUNNING: "running",
  SUCCESS: "success",
  FAILURE: "failure"
};

export const TestStateReducerAction = {
  RUN: "run",
  SET: "set",
  RESET: "reset"
};

export class TestState {
  static reducer(state, action) {
    switch (action.type) {
    }
  }

  constructor(fn, input, expectedOutput) {
    this.input = input;
    this.expectedOutput = expectedOutput;
    this.reset();
  }

  reset() {
    this.status = TestState.NOT_RUN;
    this.output = undefined;
    this.error = undefined;
    this.onChange = undefined;
    this.fn = undefined;
  }

  async run(fn) {
    const set = (status) => {
      console.log("status", status);
      this.status = status;
      this.onChange && this.onChange(this);
    };
    set(TestStatus.NOT_RUN);
    let inputCopy = _.cloneDeep(this.input);
    try {
      const output = await this.fn(inputCopy);
      this.output = output;
      const isSuccess = _.isEqual(output, this.expectedOutput);
      set(isSuccess ? TestState.SUCCESS : TestState.FAILURE);
    } catch (err) {
      set(TestState.FAILURE);
    }
  }
}
