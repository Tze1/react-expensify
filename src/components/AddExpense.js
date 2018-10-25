import React from 'react';
import { connect } from 'react-redux';
import ExpenseForm from './ExpenseForm';
import { addExpense } from '../actions/expensesActions';

export class AddExpense extends React.Component {
  constructor (props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = (expense) => {
    this.props.addExpense(expense);
    this.props.history.push('/');
  };

  render () {
    return (
      <div className="addexpense component">
      <h2 className="addexpense-title">Add Expense</h2>
      <ExpenseForm onSubmit={this.onSubmit}
      />
      <button className="addexpense-cancel" onClick={() => this.props.history.push('/')}>Cancel</button>
    </div>
      );
  };
};

const mapDispatchToProps = (dispatch) => ({
  addExpense: (expense) => dispatch(addExpense(expense))
});

export default connect(undefined, mapDispatchToProps)(AddExpense);
