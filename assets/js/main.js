/* ============ JASHRAJ CLICKS — main.js ============ */
(function(){
  "use strict";

  var WHATSAPP_NUMBER = "919321052169"; // +91 9321052169
  var STUDIO_EMAIL = "kumawatjasraj80@gmail.com";

  document.addEventListener("DOMContentLoaded", function(){
    setYear();
    initHeaderScroll();
    initMobileNav();
    initThemeToggle();
    initReveal();
    initBackToTop();
    initActiveNav();
    initBookingModal();
    initLightbox();
    initFilters();
    initAccordion();
    initTestimonialNav();
    initVideoModal();
    initFAQSearch();
    initContactForm();
    initFloatingWhatsappDefault();
  });

  function setYear(){
    document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeaderScroll(){
    var header = document.querySelector(".site-header");
    if(!header) return;
    function onScroll(){
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav(){
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if(!toggle || !links) return;
    toggle.addEventListener("click", function(){
      links.classList.toggle("open");
      toggle.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ links.classList.remove("open"); });
    });
  }

  /* ---------------- Theme toggle (dark/light) ---------------- */
  function initThemeToggle(){
    var root = document.documentElement;
    var toggle = document.querySelector(".theme-toggle");
    var saved = null;
    try{ saved = localStorage.getItem("jc-theme"); }catch(e){}
    if(saved){ root.setAttribute("data-theme", saved); }
    if(!toggle) return;
    toggle.addEventListener("click", function(){
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      if(next === "dark"){ root.removeAttribute("data-theme"); }
      else { root.setAttribute("data-theme","light"); }
      try{ localStorage.setItem("jc-theme", next); }catch(e){}
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal(){
    var items = document.querySelectorAll(".reveal");
    if(!items.length) return;
    if(!("IntersectionObserver" in window)){
      items.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:"0px 0px -40px 0px"});
    items.forEach(function(el){ io.observe(el); });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop(){
    var btn = document.querySelector(".back-to-top");
    if(!btn) return;
    window.addEventListener("scroll", function(){
      btn.classList.toggle("show", window.scrollY > 600);
    }, {passive:true});
    btn.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  /* ---------------- Active nav highlight ---------------- */
  function initActiveNav(){
    var page = (document.body.getAttribute("data-page") || "").toLowerCase();
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function(a){
      if(a.getAttribute("data-nav") === page){ a.classList.add("active"); }
    });
  }

  /* ---------------- WhatsApp message builder ---------------- */
  function buildMessage(data){
    var lines = [
      "Hello Jashraj Clicks! I'd like to enquire about a shoot.",
      "",
      "Name: " + (data.name || "-"),
      "Phone: " + (data.phone || "-"),
      "Event Type: " + (data.eventType || "-"),
      "Event Date: " + (data.eventDate || "-"),
      "Location: " + (data.location || "-"),
      "Budget: " + (data.budget || "-"),
      "Additional Requirements: " + (data.notes || "-")
    ];
    return lines.join("\n");
  }

  function openWhatsapp(message){
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  function initFloatingWhatsappDefault(){
    var fab = document.querySelector(".float-whatsapp");
    if(!fab) return;
    fab.addEventListener("click", function(e){
      e.preventDefault();
      openWhatsapp(buildMessage({}));
    });
  }

  /* ---------------- Booking modal (triggered by any [data-book] element) ---------------- */
  function initBookingModal(){
    var modal = document.getElementById("bookingModal");
    if(!modal) return;
    var form = modal.querySelector("form");
    var closeBtn = modal.querySelector(".modal-close");
    var packageField = modal.querySelector("#bk-package");

    document.querySelectorAll("[data-book]").forEach(function(trigger){
      trigger.addEventListener("click", function(e){
        e.preventDefault();
        var pkg = trigger.getAttribute("data-package");
        if(pkg && packageField){ packageField.value = pkg; }
        openModal();
      });
    });

    function openModal(){
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeModal(){
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
    closeBtn && closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function(e){ if(e.target === modal){ closeModal(); } });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape"){ closeModal(); } });

    form && form.addEventListener("submit", function(e){
      e.preventDefault();
      var data = {
        name: form.querySelector("#bk-name").value.trim(),
        phone: form.querySelector("#bk-phone").value.trim(),
        eventType: (form.querySelector("#bk-package") ? form.querySelector("#bk-package").value : "") ,
        eventDate: form.querySelector("#bk-date").value,
        location: form.querySelector("#bk-location").value.trim(),
        budget: form.querySelector("#bk-budget").value,
        notes: form.querySelector("#bk-notes").value.trim()
      };
      if(!data.name || !data.phone){
        alert("Please share your name and phone number so we can reach you.");
        return;
      }
      openWhatsapp(buildMessage(data));
      closeModal();
      form.reset();
    });
  }

  /* ---------------- Lightbox for masonry gallery ---------------- */
  function initLightbox(){
    var items = Array.prototype.slice.call(document.querySelectorAll(".masonry-item[data-full]"));
    var lightbox = document.getElementById("lightbox");
    if(!items.length || !lightbox) return;
    var img = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var visible = [];
    var idx = 0;

    function refreshVisible(){
      visible = items.filter(function(it){ return it.offsetParent !== null; });
    }
    function show(i){
      refreshVisible();
      if(!visible.length) return;
      idx = (i + visible.length) % visible.length;
      img.src = visible[idx].getAttribute("data-full");
      img.alt = visible[idx].getAttribute("data-title") || "Jashraj Clicks photography";
    }
    items.forEach(function(it){
      it.addEventListener("click", function(){
        refreshVisible();
        idx = visible.indexOf(it);
        show(idx);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function close(){ lightbox.classList.remove("open"); document.body.style.overflow=""; }
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function(e){ if(e.target === lightbox){ close(); } });
    prevBtn.addEventListener("click", function(){ show(idx-1); });
    nextBtn.addEventListener("click", function(){ show(idx+1); });
    document.addEventListener("keydown", function(e){
      if(!lightbox.classList.contains("open")) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowLeft") show(idx-1);
      if(e.key === "ArrowRight") show(idx+1);
    });
  }

  /* ---------------- Portfolio filters ---------------- */
  function initFilters(){
    var buttons = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".masonry-item");
    if(!buttons.length || !items.length) return;
    buttons.forEach(function(btn){
      btn.addEventListener("click", function(){
        buttons.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        items.forEach(function(it){
          var cats = (it.getAttribute("data-cat") || "");
          var match = f === "all" || cats.indexOf(f) !== -1;
          it.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- FAQ Accordion ---------------- */
  function initAccordion(){
    document.querySelectorAll(".accordion-item").forEach(function(item){
      var head = item.querySelector(".accordion-head");
      var body = item.querySelector(".accordion-body");
      if(!head || !body) return;
      head.addEventListener("click", function(){
        var isOpen = item.classList.contains("open");
        item.closest(".accordion").querySelectorAll(".accordion-item").forEach(function(other){
          other.classList.remove("open");
          other.querySelector(".accordion-body").style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------- FAQ live search ---------------- */
  function initFAQSearch(){
    var input = document.getElementById("faqSearch");
    if(!input) return;
    input.addEventListener("input", function(){
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(".accordion-item").forEach(function(item){
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---------------- Testimonials nav ---------------- */
  function initTestimonialNav(){
    var track = document.querySelector(".testi-track");
    var prev = document.querySelector(".testi-nav .prev");
    var next = document.querySelector(".testi-nav .next");
    if(!track) return;
    function scrollAmt(){ return track.querySelector(".testi-card").offsetWidth + 26; }
    prev && prev.addEventListener("click", function(){ track.scrollBy({left:-scrollAmt(), behavior:"smooth"}); });
    next && next.addEventListener("click", function(){ track.scrollBy({left:scrollAmt(), behavior:"smooth"}); });
  }

  /* ---------------- Video modal (Films page) ---------------- */
  function initVideoModal(){
    var modal = document.getElementById("videoModal");
    if(!modal) return;
    var frame = modal.querySelector("iframe");
    var closeBtn = modal.querySelector(".video-modal-close");
    document.querySelectorAll("[data-video]").forEach(function(card){
      card.addEventListener("click", function(){
        frame.src = card.getAttribute("data-video") + "?autoplay=1&rel=0";
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function close(){
      modal.classList.remove("open");
      frame.src = "";
      document.body.style.overflow = "";
    }
    closeBtn && closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function(e){ if(e.target === modal){ close(); } });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") close(); });
  }

  /* ---------------- Contact page form -> WhatsApp + mailto ---------------- */
  function initContactForm(){
    var form = document.getElementById("contactForm");
    if(!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var data = {
        name: form.querySelector("#c-name").value.trim(),
        phone: form.querySelector("#c-phone").value.trim(),
        eventType: form.querySelector("#c-eventtype").value,
        eventDate: form.querySelector("#c-date").value,
        location: form.querySelector("#c-location").value.trim(),
        budget: form.querySelector("#c-budget").value,
        notes: form.querySelector("#c-message").value.trim()
      };
      if(!data.name || !data.phone){
        alert("Please share your name and phone number so we can reach you.");
        return;
      }
      openWhatsapp(buildMessage(data));
    });

    var emailBtn = document.getElementById("emailInstead");
    if(emailBtn){
      emailBtn.addEventListener("click", function(){
        var subject = encodeURIComponent("Photography / Videography Enquiry");
        var body = encodeURIComponent(buildMessage({}));
        window.location.href = "mailto:" + STUDIO_EMAIL + "?subject=" + subject + "&body=" + body;
      });
    }
  }

})();
