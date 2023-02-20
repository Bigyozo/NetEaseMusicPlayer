export interface PlayMode {
  type: 'loop' | 'random' | 'singleLoop';
  label: 'loop' | 'random' | 'singleLoop';
}

export interface StateArrType {
  type: any;
  cb: (param: any) => void;
}
