import 'react-redux';
import { AppDispatch, RootState } from './store/configureStore';

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
  export function useDispatch<TDispatch = AppDispatch>(): TDispatch;
}
