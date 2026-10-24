/**
 * KKK Wheel Care - jQuery DOM Traversal and Manipulation Engine
 * Satisfies Requirement 4: jQuery DOM traversal and manipulation.
 */

$(document).ready(function () {
  console.log("KKK Wheel Care: jQuery DOM Traversal & Manipulation initialized.");

  // -------------------------------------------------------------
  // 1. DYNAMIC CATALOGUE FILTERING (DOM Manipulation: show/hide/fade)
  // -------------------------------------------------------------
  $('.filter-btn').on('click', function () {
    // DOM Traversal: .siblings() to reset active states
    $(this).addClass('active btn-brand').removeClass('btn-outline-secondary')
           .siblings('.filter-btn').removeClass('active btn-brand').addClass('btn-outline-secondary');

    const selectedCategory = $(this).attr('data-category');
    logConsole("jQuery: Filter clicked. Traversed siblings with .siblings('.filter-btn') to toggle active classes.");

    if (selectedCategory === 'all') {
      $('.product-item').stop(true, true).fadeIn(300);
      logConsole("jQuery: .fadeIn() triggered on all product items.");
    } else {
      // DOM Traversal & Filtering using .each() and .attr()
      $('.product-item').each(function () {
        const itemCategory = $(this).attr('data-category');
        if (itemCategory === selectedCategory) {
          $(this).stop(true, true).fadeIn(300);
        } else {
          $(this).stop(true, true).fadeOut(200);
        }
      });
      logConsole(`jQuery: Filtered products for category [${selectedCategory}] using .each() and .fadeOut()/.fadeIn().`);
    }
    updateProductCount();
  });

  // Price Range Slider Filter
  $('#priceRangeInput').on('input change', function () {
    const maxPrice = parseInt($(this).val(), 10);
    $('#priceDisplay').text(`₹${maxPrice.toLocaleString('en-IN')}`);

    $('.product-item').each(function () {
      const price = parseInt($(this).attr('data-price'), 10);
      if (price <= maxPrice) {
        $(this).stop(true, true).slideDown(250);
      } else {
        $(this).stop(true, true).slideUp(250);
      }
    });
    updateProductCount();
  });

  function updateProductCount() {
    setTimeout(function() {
      // DOM Traversal: count visible elements
      const visibleCount = $('.product-item:visible').length;
      $('#activeProductCount').text(visibleCount);
    }, 350);
  }

  // -------------------------------------------------------------
  // 2. EXPLICIT DOM TRAVERSAL LAB (Requirement 4 Focus Demonstration)
  // -------------------------------------------------------------

  // Demo Action A: Traverse to PARENT
  $(document).on('click', '.btn-jq-parent', function (e) {
    e.stopPropagation();
    clearHighlights();
    // DOM Traversal: .parent()
    const parentEl = $(this).parent();
    parentEl.addClass('jq-highlight-parent');
    logConsole(`DOM Traversal: $(this).parent() selected <${parentEl.prop('tagName').toLowerCase()} class="${parentEl.attr('class')}">`);
    showToast("Traversed Upwards: Selected immediate .parent() element.");
  });

  // Demo Action B: Traverse to CLOSEST ancestor card
  $(document).on('click', '.btn-jq-closest', function (e) {
    e.stopPropagation();
    clearHighlights();
    // DOM Traversal: .closest()
    const closestCard = $(this).closest('.product-item');
    closestCard.addClass('jq-highlight-target');
    const title = closestCard.find('.product-title').text().trim();
    logConsole(`DOM Traversal: $(this).closest('.product-item') identified card for: "${title}"`);
    showToast(`Found closest card: ${title}`);
  });

  // Demo Action C: Traverse downwards to CHILDREN and FIND
  $(document).on('click', '.btn-jq-children', function (e) {
    e.stopPropagation();
    clearHighlights();
    const currentCard = $(this).closest('.product-item');
    // DOM Traversal: .find() and .children()
    const cardBody = currentCard.children('.card').children('.card-body');
    const allBadges = currentCard.find('.badge');
    
    cardBody.addClass('jq-highlight-parent');
    allBadges.addClass('jq-highlight-target');
    logConsole(`DOM Traversal: .find('.badge') found ${allBadges.length} badge element(s) inside current card.`);
    showToast(`Found ${allBadges.length} badge(s) using .find()`);
  });

  // Demo Action D: Traverse horizontally to SIBLINGS
  $(document).on('click', '.btn-jq-siblings', function (e) {
    e.stopPropagation();
    clearHighlights();
    // DOM Traversal: .siblings()
    const siblings = $(this).siblings('button');
    siblings.addClass('jq-highlight-sibling');
    logConsole(`DOM Traversal: $(this).siblings('button') matched ${siblings.length} sibling action button(s).`);
    showToast(`Highlighted ${siblings.length} sibling buttons.`);
  });

  // Reset highlight styles
  function clearHighlights() {
    $('.jq-highlight-target, .jq-highlight-parent, .jq-highlight-sibling')
      .removeClass('jq-highlight-target jq-highlight-parent jq-highlight-sibling');
  }

  $('#resetJqHighlights').on('click', function () {
    clearHighlights();
    logConsole("jQuery: Reset all DOM visual highlight overlays.");
  });

  // -------------------------------------------------------------
  // 3. DYNAMIC DOM MANIPULATION: ESTIMATE / CART TRAY
  // -------------------------------------------------------------
  $(document).on('click', '.btn-add-service', function () {
    const card = $(this).closest('.product-item, .card-service');
    const name = card.find('.product-title, .service-title').text().trim();
    const price = card.find('.product-price, .service-price').text().trim();
    const category = card.find('.badge').first().text().trim() || 'Service';

    // DOM Manipulation: create and append item row to estimate drawer
    const estimateRow = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center bg-white border-bottom py-2 estimate-item">
        <div>
          <strong class="d-block text-dark">${name}</strong>
          <small class="text-muted"><span class="badge bg-secondary">${category}</span> ${price}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger btn-remove-estimate" title="Remove">
          <i class="bi bi-trash"></i>
        </button>
      </li>
    `);

    $('#estimateList').append(estimateRow);
    estimateRow.hide().fadeIn(300);

    // Update total count
    calculateEstimateTotal();
    logConsole(`DOM Manipulation: .append() dynamically inserted "${name}" into quotation estimate.`);
    showToast(`Added ${name} to estimate drawer!`);
  });

  // Dynamic remove with DOM Traversal & Animation
  $(document).on('click', '.btn-remove-estimate', function () {
    // DOM Traversal: .closest('li')
    const item = $(this).closest('li');
    item.slideUp(200, function () {
      // DOM Manipulation: .remove()
      $(this).remove();
      calculateEstimateTotal();
      logConsole("DOM Manipulation: .remove() detached selected line item after .slideUp().");
    });
  });

  function calculateEstimateTotal() {
    let total = 0;
    let count = 0;
    $('#estimateList .estimate-item').each(function () {
      count++;
      const text = $(this).find('small').text();
      const match = text.match(/₹([\d,]+)/);
      if (match) {
        total += parseInt(match[1].replace(/,/g, ''), 10);
      }
    });

    $('#estimateTotal').text(`₹${total.toLocaleString('en-IN')}`);
    $('#estimateBadgeCount').text(count);

    if (count === 0) {
      $('#estimateEmptyNotice').show();
      $('#estimateSummaryBlock').hide();
    } else {
      $('#estimateEmptyNotice').hide();
      $('#estimateSummaryBlock').show();
    }
  }

  // -------------------------------------------------------------
  // 4. SMART TYRE RECOMMENDATION FILTER (Rule Preview)
  // -------------------------------------------------------------
  $('#tyreFinderForm').on('submit', function (e) {
    e.preventDefault();
    const vehicleType = $('#finderVehicleType').val();
    const terrain = $('#finderTerrain').val();
    const priority = $('#finderPriority').val();

    let matchedCount = 0;
    $('.product-item[data-category="tyres"]').each(function () {
      const itemVehicle = $(this).attr('data-vehicle');
      const itemTerrain = $(this).attr('data-terrain');

      const matchesVehicle = (!vehicleType || itemVehicle === vehicleType || itemVehicle === 'all');
      const matchesTerrain = (!terrain || itemTerrain === terrain || itemTerrain === 'all');

      if (matchesVehicle && matchesTerrain) {
        $(this).slideDown(300);
        matchedCount++;
      } else {
        $(this).slideUp(200);
      }
    });

    // Hide non-tyres
    $('.product-item:not([data-category="tyres"])').slideUp(200);

    logConsole(`jQuery Rule Match: Found ${matchedCount} tyres matching [Vehicle: ${vehicleType || 'Any'}, Terrain: ${terrain || 'Any'}, Priority: ${priority || 'Any'}].`);
    $('#recommendationAlert').removeClass('d-none').html(`
      <i class="bi bi-check-circle-fill me-2"></i>
      Found <strong>${matchedCount} recommended tyre options</strong> matching your driving conditions.
    `);
  });

  // Helper log function
  function logConsole(msg) {
    const time = new Date().toLocaleTimeString();
    const line = $(`<div>[${time}] ${msg}</div>`);
    $('#jqueryConsole').prepend(line);
  }

  function showToast(msg) {
    const toastEl = $('#liveActionToast');
    if (toastEl.length) {
      $('#liveToastMsg').text(msg);
      const bsToast = new bootstrap.Toast(toastEl[0]);
      bsToast.show();
    }
  }

  // Initial count
  updateProductCount();
});
