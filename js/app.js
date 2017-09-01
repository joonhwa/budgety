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

    var budgetData = {
        allItem: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
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


    var ctrlAddItem = function () {

        var item, newItem;

        item = UIController.getInput();
        console.log(item);

        newItem = budgetCtrl.addItem(item.type, item.description, item.value);

        UIController.addListItem(newItem, item.type)
    }

    return {
        init: function () {
            setupEventListeners();
        }
    }



})(budgetController, UIController);

controller.init();
