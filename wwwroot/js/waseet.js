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


// =========================== SECOND SECTION AT INDEX PAGE ===========================

const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}


// =========================== START THIRD SECTION AT INDEX PAGE ===========================


// =========================== END THIRD SECTION AT INDEX PAGE ===========================




// =========================== START FORTH SECTION AT INDEX PAGE ===========================

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

// =========================== END FORTH SECTION AT INDEX PAGE ===========================


// ======================= START NUMBER COUNTER SECTION =======================

// Just added bootstrap v4.5 css
// You don't need any other library to run this counter
const animationDuration = 3000;

const frameDuration = 1000 / 60;

const totalFrames = Math.round( animationDuration / frameDuration );

const easeOutQuad = t => t * ( 2 - t );

const animateCountUp = el => {
	let frame = 0;
	const countTo = parseInt( el.innerHTML, 10 );
	
	const counter = setInterval( () => {
		frame++;

		const progress = easeOutQuad( frame / totalFrames );

		const currentCount = Math.round( countTo * progress );


		if ( parseInt( el.innerHTML, 10 ) !== currentCount ) {
			el.innerHTML = currentCount;
		}

		if ( frame === totalFrames ) {
			clearInterval( counter );
		}
	}, frameDuration );
};

	const countupEls = document.querySelectorAll( '.timer' );
	countupEls.forEach( animateCountUp );

// ======================= END NUMBER COUNTER SECTION =======================







// ====================== START TYPING SCRIPT =======================
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["لشراء الكروت المحلية والعالمية", "لتسديد فواتير المواقع العالمية", "لتحويل بين العملات بأمان"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
} 
else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
}
}

function erase() {
if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
} 
else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
}
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
if(textArray.length) setTimeout(type, newTextDelay + 250);
});
// ====================== END TYPING SCRIPT =========================










// ===================== START COMMON QUESTIONS =========================
// select all accordion items
const accItems = document.querySelectorAll(".accordion__item");

// add a click event for all items
accItems.forEach((acc) => acc.addEventListener("click", toggleAcc));

function toggleAcc() {
  // remove active class from all items exept the current item (this)
    accItems.forEach((item) => item != this ? item.classList.remove("accordion__item--active") : null
    );

    // toggle active class on current item
    if (this.classList != "accordion__item--active") {
        this.classList.toggle("accordion__item--active");
    }
}
// ===================== END COMMON QUESTIONS =========================