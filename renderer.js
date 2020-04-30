// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var classes = {
    item: '.item',
    itemAdd: '.item-add',
    itemPrice: '.item-price',
    itemAmount: '.item-amount',
    itemTemplate: '.item-template',
    personalSummary: '.personal-summary',
    personalSummaryList: '.personal-summary-list',
    personalSummaryAdd: '.personal-summary-add',
    personalSummaryTemplate: '.personalSummary-template',
    personalTitle: '.personal-title',
    calculateButton: '.calculate',
    orderCostWithoutReduce: '.input-order-cost-without-reduce',
    orderActualCost: '.input-order-actual-cost',
    sellerReduce: '.input-seller-reduce',
    clientReduce: '.input-client-reduce',
    deliveryCharge: '.input-delivery-charge',
    packageCharge: '.input-package-charge',
    calculateResult: '.calculate-result',
    resultItemTemplate: '.result-item-template',
    resultTitle: '.result-title',
    resultCost: '.result-cost'
};

var orderCostWithoutReduce,
    orderActualCost,
    sellerReduce,
    clientReduce,
    deliveryCharge,
    packageCharge;
var personalSummaryList = [];
var packageAmount = 0;

$(document).ready(function () {
    var index = 2;

    var getPersonalSummaryList = function () {
        $(classes.personalSummaryList).find(classes.personalSummary).each(function (event) {
            var itemList = [];
            var totalAmount = 0;
            var totalPrice = 0;
            var personalTitle = $(this).find(classes.personalTitle).html();

            $(this).find(classes.item).each(function (event) {
                var price = parseInt($(this).find(classes.itemPrice).val());
                var amount = parseInt($(this).find(classes.itemAmount).val());

                itemList.push({
                    totalPrice: price * amount,
                    amount: amount
                });
                totalAmount = totalAmount + amount;
                totalPrice = totalPrice + price * amount;
            });

            personalSummaryList.push({
                personalTitle: personalTitle,
                itemList: itemList,
                totalAmount: totalAmount,
                totalPrice: totalPrice
            });
            packageAmount = packageAmount + totalAmount;
        });
    };

    var setPersonalSummaryReduce = function (totalReduce, deliveryCharge, packageCharge) {
        var personNumber = personalSummaryList.length;

        personalSummaryList.forEach(function (personalSummary) {
            personalSummary.packageCharge = personalSummary.totalAmount / packageAmount * packageCharge;
            personalSummary.deliveryCharge = deliveryCharge / personNumber;
            personalSummary.reduce = personalSummary.totalPrice / orderCostWithoutReduce * totalReduce;
            personalSummary.actualCost =
                personalSummary.totalPrice -
                personalSummary.reduce +
                personalSummary.packageCharge +
                personalSummary.deliveryCharge;
        });
    };

    var renderResult = function (personalSummaryList) {
        personalSummaryList.forEach(function (personalSummary) {
            var template = $(classes.resultItemTemplate).html();

            $(classes.calculateResult).append(template);
            $(classes.calculateResult + ' li').last().find(classes.resultTitle).html(personalSummary.personalTitle);
            $(classes.calculateResult + ' li').last().find(classes.resultCost).text(personalSummary.actualCost);
        });
    };

    $(classes.personalSummaryList).on('click', classes.personalSummaryAdd, function () {
        var template = $(classes.personalSummaryTemplate).html();

        $(this).before(template);
        $(this).prev().find('.person-index').text(index);
        index++;
    });

    $(classes.personalSummaryList).on('click', classes.itemAdd, function () {
        var template =  $(classes.itemTemplate).html();
        $(this).before(template);
    });

    $(classes.calculateButton).click(function () {
       orderCostWithoutReduce = parseInt($(classes.orderCostWithoutReduce).val());
       orderActualCost = parseInt($(classes.orderActualCost).val());
       sellerReduce = parseInt($(classes.sellerReduce).val());
       clientReduce = parseInt($(classes.clientReduce).val());
       deliveryCharge = parseInt($(classes.deliveryCharge).val());
       packageCharge = parseInt($(classes.packageCharge).val());

       var totalReduce = sellerReduce + clientReduce;

        getPersonalSummaryList();
        setPersonalSummaryReduce(totalReduce, deliveryCharge, packageCharge);
        renderResult(personalSummaryList);

        personalSummaryList = [];
    });
});
