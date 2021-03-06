import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { startSetExpenses, setExpenses, startAddExpense, addExpense, startEditExpense, editExpense, startRemoveExpense, removeExpense } from '../../actions/expensesActions';
import testExpenses from '../fixtures/testExpenses';
import db from '../../firebase/firebase';

const createMockStore = configureMockStore([thunk]),
  uid = 'testAbc123!',
  defaultAuthState = { auth: { uid } };

beforeEach((done) => {
  const expensesData = {};
  testExpenses.forEach(({ id, createdAt, description, amount, note }) => {
    expensesData[id] = { createdAt, description, amount, note };
  })
  db.ref(`users/${uid}/expenses`).set(expensesData).then(done());
});

test('Should fetch db expenses correctly', (done) => {
  const mStore = createMockStore(defaultAuthState);

  mStore.dispatch(startSetExpenses()).then(() => {
    const mActions = mStore.getActions();

    expect(mActions[0]).toEqual({
      type: 'SET_EXPENSES',
      expenses: testExpenses
    });

    done();
  });
});

test('Should set up SET_EXPENSES action object with data', () => {
  const action = setExpenses(testExpenses);

  expect(action).toEqual({
    type: 'SET_EXPENSES',
    expenses: testExpenses
  });
});

test('Should add expense to database and store', (done) => {
  const store = createMockStore(defaultAuthState),
    expenseData = {
      description: 'Mouse',
      amount: 1299,
      createdAt: 1000,
      note: 'test add-expense'
    };

  store.dispatch(startAddExpense(expenseData)).then(() => {
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...expenseData
      }
    });

    return db.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
  }).then((snapshot) => {
    expect(snapshot.val()).toEqual(expenseData);
    done();
  });
});

test('Should set up add-expense action-object with provided values', () => {
  const actionObj = addExpense(testExpenses[2]);

  expect(actionObj).toEqual({
    type: 'ADD_EXPENSE',
    expense: testExpenses[2]
  });
});

test('Should add expense with defaults to database', (done) => {
  const store = createMockStore(defaultAuthState),
    expenseDefaults = {
      description: '',
      amount: 0,
      createdAt: 0,
      note: ''
    };

  store.dispatch(startAddExpense(expenseDefaults)).then(() => {
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...expenseDefaults
      }
    });

    return db.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
  }).then((snapshot) => {
    expect(snapshot.val()).toEqual(expenseDefaults);
    done();
  });
});

test('Should edit expense in database properly', (done) => {
  const store = createMockStore(defaultAuthState),
    id = testExpenses[1].id,
    updates = {
      ...testExpenses[1],
      amount: 119500,
      note: '[updated note]'
    };

  store.dispatch(startEditExpense(id, updates)).then(() => {
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'EDIT_EXPENSE',
      id,
      updates
    });

    return db.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then((snapshot) => {
    expect(snapshot.val().amount).toBe(updates.amount);
    expect(snapshot.val().note).toBe(updates.note);
    done();
  });
});

test('Should set up edit-expense action-object', () => {
  const id = '123abc',
    updates = {
      note: '[updated note]'
    },
    actionObj = editExpense(id, updates);

  expect(actionObj).toEqual({
    type: 'EDIT_EXPENSE',
    id: id,
    updates: updates
  });
});

test('Should remove expense from database', (done) => {
  const store = createMockStore(defaultAuthState),
    id = testExpenses[2].id;

  store.dispatch(startRemoveExpense({ id })).then(() => {
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'REMOVE_EXPENSE',
      id
    });

    return db.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then((snapshot) => {
    expect(snapshot.val()).toBeFalsy();
    done();
  });
});

test('Should set up remove-expense action-object', () => {
  const action = removeExpense({ id: '123abc' });

  // Use toEqual to compare objects/arrays
  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '123abc'
  });
});
