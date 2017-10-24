import { bindActionCreators } from "redux";
import { bindRoutineCreators } from 'redux-saga-routines';


export const getDispatchMapper = reduxActions => dispatch => bindActionCreators(reduxActions, dispatch);
export const getRoutineMapper = sagaRoutines => dispatch => bindRoutineCreators(sagaRoutines, dispatch);
export const getAllMapper = (sagaRoutines = {}, reduxActions = {}) => dispatch => ({
  ...bindRoutineCreators(sagaRoutines, dispatch),
  ...bindActionCreators(reduxActions, dispatch),
});


/*
 * Usage:
 *

  import { connect } from "react-redux";
  import { getDispatchMapper } from '../../base/redux/dispatch';
  import { hideDialog, showDialog } from './fooRedux';
  @connect(
    state => ({}),
    getDispatchMapper({
      hideDialog,
      showDialog,
    })
  )

*/