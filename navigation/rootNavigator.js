import { StackActions } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigateParam(name, params) {
  navigationRef.current?.navigate(name, params);
}


export function navigate(name) {
    navigationRef.current?.navigate(name);
}

export function reset(name) {
    navigationRef.current?.reset({
        index: 0,
        routes: [
          {
            name,
          },
        ],
      });

}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}
export function pop() {
    navigationRef.current?.dispatch(StackActions.pop());
}