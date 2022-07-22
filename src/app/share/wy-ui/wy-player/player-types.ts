export type PlayMode = {
  type: 'loop' | 'random' | 'singleLoop';
  label: 'loop' | 'random' | 'singleLoop';
};

export type StateArrType = {
  type: any;
  cb: (param: any) => void;
};
