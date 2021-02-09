'use strict';
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
};
const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};
const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};
const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};
const accounts = [account1, account2, account3, account4];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const displayMovements = function (movements) {
    containerMovements ? containerMovements.innerHTML = '' : null;
    movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'withdrawal' : 'deposit';
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}€</div>
        </div>
        `;
        containerMovements?.insertAdjacentHTML("afterbegin", html);
    });
};
const user = 'Steven Thomas Williams';
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance ? labelBalance.textContent = `${acc.balance}€` : null;
};
const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn ? labelSumIn.textContent = `${Math.abs(incomes)}€` : null;
    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut ? labelSumOut.textContent = `${out}€` : null;
    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest ? labelSumInterest.textContent = `${interest}€` : null;
};
const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLocaleLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts);
/////////////////////////////
const updateUI = (currentAccount) => {
    //Display movements
    displayMovements(currentAccount.movements);
    //Display balance
    calcDisplayBalance(currentAccount);
    //Display summary
    calcDisplaySummary(currentAccount);
};
///////////////////
//Event Handlers
let currentAccount;
const loginHandler = (e) => {
    e.preventDefault();
    currentAccount = accounts.find((acc) => acc.username === inputLoginUsername?.value);
    if (currentAccount) {
        if (currentAccount.pin === Number(inputLoginPin?.value)) {
            //Display UI and message
            labelWelcome.textContent = `
                Welcome Back, ${currentAccount.owner.split(' ')[0]}
            `;
            containerApp.style.opacity = '100';
            //clear input fields
            inputLoginUsername.value = '';
            inputLoginPin.value = '';
            inputLoginPin.blur();
            //Updating UI
            updateUI(currentAccount);
        }
    }
};
const transferHandler = (e) => {
    e.preventDefault();
    const amount = inputTransferAmount ? Number(inputTransferAmount.value) : null;
    const receiverAccount = accounts.find((acc) => acc.username === inputTransferTo?.value);
    // console.log(amount, receiverAccount);
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    if (amount && currentAccount && currentAccount.balance && receiverAccount) {
        if ((amount > 0) && currentAccount.balance >= amount &&
            receiverAccount.username !== currentAccount.username) {
            //doing the transfer
            currentAccount.movements.push(-amount);
            receiverAccount.movements.push(amount);
            //Updating UI
            updateUI(currentAccount);
        }
    }
};
//Adding Event Listeneres
btnLogin.addEventListener('click', loginHandler);
btnTransfer?.addEventListener('click', transferHandler);
