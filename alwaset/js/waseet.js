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

// =========================== SECOND SECTION AT INDEX PAGE ===========================

const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}


// ================================= OWL CARUSEL ====================================

const cardsContainer = document.querySelector(".card-carousel");
const cardsController = document.querySelector(".card-carousel + .card-controller")

class DraggingEvent {
constructor(target = undefined) {
    this.target = target;
}

event(callback) {
    let handler;
    
    this.target.addEventListener("mousedown", e => {
    e.preventDefault()
    
    handler = callback(e)
    
    window.addEventListener("mousemove", handler)
    
    document.addEventListener("mouseleave", clearDraggingEvent)
    
    window.addEventListener("mouseup", clearDraggingEvent)
    
    function clearDraggingEvent() {
        window.removeEventListener("mousemove", handler)
        window.removeEventListener("mouseup", clearDraggingEvent)
    
        document.removeEventListener("mouseleave", clearDraggingEvent)
        
        handler(null)
    }
    })
    
    this.target.addEventListener("touchstart", e => {
    handler = callback(e)
    
    window.addEventListener("touchmove", handler)
    
    window.addEventListener("touchend", clearDraggingEvent)
    
    document.body.addEventListener("mouseleave", clearDraggingEvent)
    
    function clearDraggingEvent() {
        window.removeEventListener("touchmove", handler)
        window.removeEventListener("touchend", clearDraggingEvent)
        
        handler(null)
    }
    })
}

  // Get the distance that the user has dragged
getDistance(callback) {
    function distanceInit(e1) {
    let startingX, startingY;
    
    if ("touches" in e1) {
        startingX = e1.touches[0].clientX
        startingY = e1.touches[0].clientY
    } else {
        startingX = e1.clientX
        startingY = e1.clientY
    }
    

    return function(e2) {
        if (e2 === null) {
        return callback(null)
        } else {
        
        if ("touches" in e2) {
            return callback({
            x: e2.touches[0].clientX - startingX,
            y: e2.touches[0].clientY - startingY
            })
        } else {
            return callback({
            x: e2.clientX - startingX,
            y: e2.clientY - startingY
            })
        }
        }
    }
    }
    
    this.event(distanceInit)
}
}


class CardCarousel extends DraggingEvent {
constructor(container, controller = undefined) {
    super(container)
    
    // DOM elements
    this.container = container
    this.controllerElement = controller
    this.cards = container.querySelectorAll(".card")
    
    // Carousel data
    this.centerIndex = (this.cards.length - 1) / 2;
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.xScale = {};
    
    // Resizing
    window.addEventListener("resize", this.updateCardWidth.bind(this))
    
    if (this.controllerElement) {
    this.controllerElement.addEventListener("keydown", this.controller.bind(this))      
    }

    
    // Initializers
    this.build()
    
    // Bind dragging event
    super.getDistance(this.moveCards.bind(this))
}

updateCardWidth() {
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    
    this.build()
}

build(fix = 0) {
    for (let i = 0; i < this.cards.length; i++) {
    const x = i - this.centerIndex;
    const scale = this.calcScale(x)
    const scale2 = this.calcScale2(x)
    const zIndex = -(Math.abs(i - this.centerIndex))
    
    const leftPos = this.calcPos(x, scale2)
    
    
    this.xScale[x] = this.cards[i]
    
    this.updateCards(this.cards[i], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
    })
    }
}


controller(e) {
    const temp = {...this.xScale};
    
    if (e.keyCode === 39) {
        // Left arrow
        for (let x in this.xScale) {
        const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;

        temp[newX] = this.xScale[x]
        }
    }
    
    if (e.keyCode == 37) {
        // Right arrow
        for (let x in this.xScale) {
        const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;

        temp[newX] = this.xScale[x]
        }
    }
    
    this.xScale = temp;
    
    for (let x in temp) {
        const scale = this.calcScale(x),
            scale2 = this.calcScale2(x),
            leftPos = this.calcPos(x, scale2),
            zIndex = -Math.abs(x)

        this.updateCards(this.xScale[x], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
        })
    }
}

calcPos(x, scale) {
    let formula;
    
    if (x < 0) {
      formula = (scale * 100 - this.cardWidth) / 2
    
    return formula

    } else if (x > 0) {
      formula = 100 - (scale * 100 + this.cardWidth) / 2
    
    return formula
    } else {
      formula = 100 - (scale * 100 + this.cardWidth) / 2
    
    return formula
    }
}

updateCards(card, data) {
    if (data.x || data.x == 0) {
    card.setAttribute("data-x", data.x)
    }
    
    if (data.scale || data.scale == 0) {
    card.style.transform = `scale(${data.scale})`

    if (data.scale == 0) {
        card.style.opacity = data.scale
    } else {
        card.style.opacity = 1;
    }
    }

    if (data.leftPos) {
    card.style.left = `${data.leftPos}%`        
    }
    
    if (data.zIndex || data.zIndex == 0) {
    if (data.zIndex == 0) {
        card.classList.add("highlight")
    } else {
        card.classList.remove("highlight")
    }
    
    card.style.zIndex = data.zIndex  
    }
}

calcScale2(x) {
    let formula;

    if (x <= 0) {
      formula = 1 - -1 / 5 * x
    
    return formula
    } else if (x > 0) {
      formula = 1 - 1 / 5 * x
    
    return formula
    }
}

calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)
    
    if (formula <= 0) {
    return 0 
    } else {
    return formula      
    }
}

checkOrdering(card, x, xDist) {    
    const original = parseInt(card.dataset.x)
    const rounded = Math.round(xDist)
    let newX = x
    
    if (x !== x + rounded) {
    if (x + rounded > original) {
        if (x + rounded > this.centerIndex) {
        
        newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex
        }
    } else if (x + rounded < original) {
        if (x + rounded < -this.centerIndex) {
        
        newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex
        }
    }
    
    this.xScale[newX + rounded] = card;
    }
    
    const temp = -Math.abs(newX + rounded)
    
    this.updateCards(card, {zIndex: temp})

    return newX;
}

moveCards(data) {
    let xDist;
    
    if (data != null) {
    this.container.classList.remove("smooth-return")
    xDist = data.x / 250;
    } else {

    
    this.container.classList.add("smooth-return")
    xDist = 0;

    for (let x in this.xScale) {
        this.updateCards(this.xScale[x], {
        x: x,
        zIndex: Math.abs(Math.abs(x) - this.centerIndex)
        })
    }
    }

    for (let i = 0; i < this.cards.length; i++) {
    const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist),
            scale = this.calcScale(x + xDist),
            scale2 = this.calcScale2(x + xDist),
            leftPos = this.calcPos(x + xDist, scale2)
    
    
    this.updateCards(this.cards[i], {
        scale: scale,
        leftPos: leftPos
    })
    }
}
}

const carousel = new CardCarousel(cardsContainer)




// =========================== FORTH SECTION AT INDEX PAGE ===========================

$('.brand-carousel').owlCarousel({
    loop:true,
    margin:10,
    autoplay:true,
    responsive:{
    0:{
        items:1
    },
    600:{
        items:3
    },
    1000:{
        items:5
    }
    }
});


// =========================== CHAT BTN =============================

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
    str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
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
    str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
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
