import React from 'react';
import { connect } from 'react-redux';
import ExpenseForm from './ExpenseForm';
import { editExpense, removeExpense } from '../actions/expensesActions';

export class EditExpense extends React.Component {
  constructor (props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onSubmit = (expense) => {
    this.props.editExpense(this.props.expense.id, expense);
    this.props.history.push('/');
  };

  onRemove = () => {
    this.props.removeExpense({ id: this.props.expense.id });
    this.props.history.push('/');
  };

  render () {
    return (
      <div className="editexpense component">
        <h2 className="editexpense-title">Edit Expense</h2>
        <ExpenseForm
          expense={this.props.expense}
          onSubmit={this.onSubmit}
        />
        <div className="editexpense-actions">
          <button className="editexpense-cancel" onClick={() => this.props.history.push('/')}>Cancel</button>&nbsp;
          <button className="editexpense-remove" onClick={this.onRemove}>Remove Expense</button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, props) => ({
  expense: state.expenses.find(item => item.id === props.match.params.id)
});
const mapDispatchToProps = (dispatch, props) => ({
  editExpense: (id, expense) => dispatch(editExpense(id, expense)),
  removeExpense: (data) => dispatch(removeExpense(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditExpense);