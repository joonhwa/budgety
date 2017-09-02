var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var calculateTotal = function (type) {
        var total = 0;

        budgetData.allItem[type].forEach(function (current) {
            total += current.value;
        });

        budgetData.totals[type] = total;
    }

    var budgetData = {
        allItem: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budgetAmt: 0,
        percentage: -1
    }

    return {
        addItem: function (type, description, value) {

            var newItem, ID;

            if (budgetData.allItem[type].length == 0) {
                ID = 0;
            } else {
                ID = budgetData.allItem[type][budgetData.allItem[type].length - 1].id + 1;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            budgetData.allItem[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            calculateTotal('inc');
            calculateTotal('exp');

            budgetData.budgetAmt = budgetData.totals.inc - budgetData.totals.exp;
            if (budgetData.totals.inc > 0)
                budgetData.percentage = Math.round((budgetData.totals.exp / budgetData.totals.inc) * 100);
            else
                budgetData.percentage = -1;
        },
        getBudget: function () {
            return {
                budget: budgetData.budgetAmt,
                totalINC: budgetData.totals.inc,
                totalEXP: budgetData.totals.exp,
                percentage: budgetData.percentage
            }
        },
        testing: function () {
            console.log(budgetData);
        }
    }

})();



var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeValue: '.budget__income--value',
        expenseValue: '.budget__expenses--value',
        percentageValue: '.budget__expenses--percentage',
        budgetMonth: '.budget__title--month'
    }

    var monthsArray = [];
    monthsArray[0] = 'January';
    monthsArray[1] = 'February';
    monthsArray[2] = 'March';
    monthsArray[3] = 'April';
    monthsArray[4] = 'May';
    monthsArray[5] = 'June';
    monthsArray[6] = 'July';
    monthsArray[7] = 'August';
    monthsArray[8] = 'September';
    monthsArray[9] = 'October';
    monthsArray[10] = 'November';
    monthsArray[11] = 'December';
    document.querySelector(DOMstrings.budgetMonth).textContent = monthsArray[new Date().getMonth()]

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (item, type) {
            var incomeHTML, expenseHTML;

            incomeHTML = '<div class="item clearfix" id="income-%ID%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            expenseHTML = '<div class="item clearfix" id="expense-%ID%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            if (type === 'inc') {
                incomeHTML = incomeHTML.replace('%ID%', item.id);
                incomeHTML = incomeHTML.replace('%DESCRIPTION%', item.description);
                incomeHTML = incomeHTML.replace('%VALUE%', item.value);
                document.querySelector(DOMstrings.incomeContainer).insertAdjacentHTML('beforeend', incomeHTML);
            } else if (type === 'exp') {
                expenseHTML = expenseHTML.replace('%ID%', item.id);
                expenseHTML = expenseHTML.replace('%DESCRIPTION%', item.description);
                expenseHTML = expenseHTML.replace('%VALUE%', item.value);
                document.querySelector(DOMstrings.expenseContainer).insertAdjacentHTML('beforeend', expenseHTML);
            }
        },
        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            fields.forEach(function (current, index, array) {
                current.value = "";
            });
        },
        displayBudget: function (budget) {
            document.querySelector(DOMstrings.budgetValue).textContent = budget.budgetAmt;
            document.querySelector(DOMstrings.incomeValue).textContent = budget.totalINC;
            document.querySelector(DOMstrings.expenseValue).textContent = budget.totalEXP;

            if (budget.percentage > 0)
                document.querySelector(DOMstrings.percentageValue).textContent = budget.percentage + '%';
            else
                document.querySelector(DOMstrings.percentageValue).textContent = '---';
        },
        getDOMStrings: function () {
            return DOMstrings;
        }
    }
})();



var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var updateBudget = function () {

        budgetController.calculateBudget();
        //console.log(budgetController.getBudget());
        UIController.displayBudget(budgetCtrl.getBudget());
    }

    var ctrlAddItem = function () {

        var item, newItem;

        item = UIController.getInput();
        console.log(item);

        if (item.description !== "" && !isNaN(item.value) && item.value > 0) {
            newItem = budgetCtrl.addItem(item.type, item.description, item.value);

            UIController.addListItem(newItem, item.type)
            UIController.clearFields();
            updateBudget();
        }

    }

    return {
        init: function () {
            setupEventListeners();
            UIController.displayBudget({
                budget: 0,
                totalINC: 0,
                totalEXP: 0,
                percentage: -1
            });
        }
    }



})(budgetController, UIController);

controller.init();
