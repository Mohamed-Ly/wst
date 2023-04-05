// =========================== SCROLLING UP BTN ===========================

let btn = document.getElementById('up');

window.onscroll = function () {
    if (window.scrollY >= 600) {
        btn.style.display = "block";
    }
    else {
        btn.style.display = "none";
    }
};

btn.onclick = function () {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
    });
};


// =========================== START CHAT BTN =============================

$(function() {
    var INDEX = 0; 
    $("#chat-submit").click(function(e) {
    e.preventDefault();
    var msg = $("#chat-input").val(); 
    if(msg.trim() == ''){
        return false;
    }
    generate_message(msg, 'self');
    var buttons = [
        {
            name: 'Existing User',
            value: 'existing'
        },
        {
            name: 'New User',
            value: 'new'
        }
        ];
    setTimeout(function() {      
        generate_message(msg, 'user');  
    }, 1000)
    
    })
    
    function generate_message(msg, type) {
    INDEX++;
    var str="";
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
    str += "          <span class=\"msg-avatar\">";
    // str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);
    if(type == 'self'){
    $("#chat-input").val(''); 
    }    
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }  
    
    function generate_button_message(msg, buttons){    
    /* Buttons should be object array 
        [
        {
            name: 'Existing User',
            value: 'existing'
        },
        {
            name: 'New User',
            value: 'new'
        }
        ]
      */
    INDEX++;
    var btn_obj = buttons.map(function(button) {
        return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
    }).join('');
    var str="";
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
    str += "          <span class=\"msg-avatar\">";
    // str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "          <div class=\"cm-msg-button\">";
    str += "            <ul>";   
    str += btn_obj;
    str += "            <\/ul>";
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);   
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
    $("#chat-input").attr("disabled", true);
    }
    
    $(document).delegate(".chat-btn", "click", function() {
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, 'self');
    })
    
    $("#chat-circle").click(function() {    
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
    })
    
    $(".chat-box-toggle").click(function() {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
    })
    
});

// =========================== END CHAT BTN =============================






// ====================== START EXHANGE PAGE =========================
    $(document).ready(function () {

        //Utility methods
        function getAllCurrencies() {
        let allCurrencies = []
        $("#from option").each(function () {
            allCurrencies.push({ value: this.value, currency: this.getAttribute('data-currency') });
        });
        return allCurrencies
        }

        function getSymbolFromCurrency(currency) {

        var symbol;
        switch (currency.slice(0, 3)) {
            case 'USD':
            symbol = "$"
            break;
            case 'LYD':
            symbol = "دينار "
            break;
        }
        return symbol
        }


        //style methods
        function formatWallet(wallet) {
        if (!wallet.id) {
            var $currencyH = $('<div class="currency-header flex"><span class="currency-name">'+ wallet.text +'</span><span class="balance-label">available balance</span>')
            return $currencyH;
        }
        let balance = wallet.element.attributes['data-balance'].textContent
        var $wallet = $(
            '<div class="wallet-item flex"> <span class="wallet-name icon flex"><i class="material-icons md-18">account_balance_wallet</i>' + wallet.text + '</span><span class="balance">' + balance + '</span></div>'
        );
        return $wallet;
        };

        $('.currency-exchange-wallet-sel').select2({
        templateResult: formatWallet,
        templateSelection: formatWallet,
        selectOnClose: true
        });



        // wallet with same currency selection logic
        var fromV, toV,
        currencies = [
            {
            "id": 0,
            "text": "USD ($)",
            "selected": true
            },
            {
            "id": 1,
            "text": "LYD (دينار)"
            }
        ];

        function getValueFirstDifferentCurrency(currency) {
        let c = getAllCurrencies();
        return c.find(function (element) {
            return element.currency != currency
        }).value
        }

        //from select

        // store current value
        $('#from').on("select2:selecting", function (e) {
        fromV = $("#from :selected").attr("value");
        toV = $("#to :selected").attr("value");
        });

        $('#from').on("select2:select", function (e) {
        var data = e.params.data;
        let fromC = data.element.attributes['data-currency'].value;
        let toC = $("#to :selected").attr("data-currency");

        let val = getValueFirstDifferentCurrency(fromC)

        if (fromC === toC) {
            //
            if (fromV === val) {
            $('#to').val(val).trigger("change");
            } else {
            $('#to').val(fromV).trigger("change");
            }
        }

        getCurrencySelected()
        updateDeltas()
        });

        // to select

        //store currenct value
        $('#to').on("select2:selecting", function (e) {
        fromV = $("#from :selected").attr("value");
        toV = $("#to :selected").attr("value");
        });

        $('#to').on("select2:select", function (e) {
        var data = e.params.data;
        let fromC = $("#from :selected").attr("data-currency");
        let toC = data.element.attributes['data-currency'].value;

        let val = getValueFirstDifferentCurrency(toC)

        if (fromC === toC) {
            console.log('uguali')
            if (toV === val) {
            $('#from').val(val).trigger("change");
            } else {
            $('#from').val(toV).trigger("change");
            }
        }

        getCurrencySelected()
        updateDeltas()

        });

        function getCurrencySelected() {
        let fromC = $("#from :selected").attr("data-currency");
        let toC = $("#to :selected").attr("data-currency");

        let sF = getSymbolFromCurrency(fromC)
        let sT = getSymbolFromCurrency(toC)
        
        let selC = $("#currency-amount :selected")[0].value;

        currencies[0].text = fromC + ' (' + sF + ')'
        currencies[1].text = toC + ' (' + sT + ')'
        
        // in here we check if the user selected the first of the second currency for the amount. and we remember it
        if(selC == 0){
            currencies[0].selected = true
            currencies[1].selected = false
        }else{
            currencies[0].selected = false
            currencies[1].selected = true
        }
        // let's reset the currency elector with the new 2 currencies
        $('#currency-amount').select2('destroy').empty().select2({ data: currencies, minimumResultsForSearch: -1 }).trigger("change")

        }


        $('#currency-amount').on('change', function (e) {
        let selC = $("#currency-amount :selected").text();
        $('.input-currency').text(getSymbolFromCurrency(selC.toString()))
        updateDeltas()
        })

        $('#currency-amount').select2({
        data: currencies,
        minimumResultsForSearch: -1
        })





        //input logic

        var inputAmount = new Cleave('.input-amount', {
        numeral: true,
        numeralDecimalMark: '.',
        delimiter: ','
        });


        var amount = $('.input-amount');
        var badge = $('.exchange-rate-badge')

        //mock of exchange rates
        var exchangeRates = {
        "USD": {
            "name": 'USD',
            "quotes": {
            "LYD": 5.25,
            }
        },
        "LYD": {
            "name": 'LYD',
            "quotes": {
            "USD": 0.19047619,
            }
        },
        }
        
    

        // this method updates the dynamic text around the interface
        function updateDeltas() {
        
        var fromW = $('#from :selected').text(),
            toW = $('#to :selected').text();
        
        let firstC = currencies[0].text;
        let secC = currencies[1].text;
        let amaV = getMoneyAmount(amount);

        let selC = $("#currency-amount :selected")[0].value;
        var deltaFrom,deltaTo;
        
        if (selC == 0) {
            //if we are converting using the 'from wallet' currency we keep the same amount of the input as a negative variation under the from wallet selector. 
            // And on the 'To wallet' we convert the amount in the destination exchange rate as a positive variation under the to wallet selector.
            //  we use utility methods to retrieve the correct symbol and format the number correctly
            
            deltaFrom = getSymbolFromCurrency(firstC.toString()) + formatMoney(amaV);
            deltaTo =  getSymbolFromCurrency(secC.toString()) + formatMoney(getValueFromCurrencyToCurrency(amaV, firstC.slice(0, 3), secC.slice(0, 3)))
            
            $('.delta-from').text('-' + deltaFrom);
            $('.delta-to').text('+' + deltaTo);
            console.log(deltaFrom)
            badge.text(firstC.slice(0, 3)+' 1 = '+ secC.slice(0, 3)+ ' ' + getRateFromCurrencyToCurrency(firstC.slice(0, 3),secC.slice(0, 3)));

        }
        else if (selC == 1) {
            //if we are converting using the 'to wallet' we convert the input amount in the starting exchange rate as a negative variation under the from wallet selector. 
            // in the ' To wallet' we keep the same amount as a positive variation under the to wallet selector.
            // we use utility methods to retrieve the correct symbol and format the number correctly
            
            deltaFrom = getSymbolFromCurrency(firstC.toString()) + formatMoney(getValueFromCurrencyToCurrency(amaV, secC.slice(0, 3), firstC.slice(0, 3)));
            deltaTo = getSymbolFromCurrency(secC.toString()) + formatMoney(amaV);
            
            $('.delta-from').text('-' + deltaFrom);
            $('.delta-to').text('+' + deltaTo);

            badge.text(secC.slice(0, 3)+' 1 = '+ firstC.slice(0, 3)+ ' ' + getRateFromCurrencyToCurrency(secC.slice(0, 3),firstC.slice(0, 3)));
        }

        //do the math
            let balanceFrom = numeral($('#from :selected')[0].attributes['data-balance'].textContent),
                differenceFrom = balanceFrom._value - numeral(deltaFrom.toString())._value;
        
            let balanceTo = numeral($('#to :selected')[0].attributes['data-balance'].textContent),
                differenceTo = balanceTo._value + ( numeral(deltaTo.toString())._value)
                
            
        
        
        //at last update the summary text
        var summaryText =  ' > ' + fromW + ' سيبقى في محفظتك بعد خصم القيمة => '  +  getSymbolFromCurrency(firstC.toString()) + formatMoney(differenceFrom)
                            + ' > ' + toW + '  سيبقى في محفظتك بعد القيمة المضافة => '  + getSymbolFromCurrency(secC.toString()) + formatMoney(differenceTo)
        
        $('.summary').text(summaryText);
        }


        function getValueFromCurrencyToCurrency(amount, a, b) {
        let convertedAmount;
        convertedAmount = amount * exchangeRates[a].quotes[b]
        return convertedAmount;
        }

        function getRateFromCurrencyToCurrency(a, b) {
        return parseFloat(exchangeRates[a].quotes[b]).toFixed(4)
        }

        function getMoneyAmount(amount) {
        return numeral(amount.val()).value();
        }

        function formatMoney(amount) {
        return numeral(amount).format('0,0.00')
        }

        //update the values while typing, should be on change if we want to simulate the current BC behaviour
        // amount.keydown(function () {
        //   updateDeltas();
        // })
        amount
        // event handler
        .keyup(resizeInput)
        .keyup(updateDeltas)
        // resize on page load
        .each(resizeInput);

        amount.on('change', function (e) {
        updateDeltas();
        })

        function resizeInput() {
        $(this).attr('size', $(this).val().length);
        }

    });




// ====================== END EXHANGE PAGE =========================
