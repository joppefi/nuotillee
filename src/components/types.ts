export type WindowComponentProps<State> = {
  state?: State;
  onStateChange: (state: State) => void;
};
