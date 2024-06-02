const q = $("#search");
const results = $("#searchResults");
const searchType = $("#searchType");
const searchButton = $("#searchButton");

q.on("input", function (e) {
  if (q.val() !== "") {
    searchButton.prop("disabled", false);
  } else {
    searchButton.prop("disabled", true);
  }

  if (e.keyCode === 13 && !searchButton.prop("disabled")) {
    // Enter key
    search();
  }
});

searchButton.on("click", function () {
  search();
});

function createSearchResult(data) {
  let icon = "";
  let type = data.type;
  let code = data.code;
  if (type === "otobus") {
    icon = `<i class="fas fa-bus"></i><span> Otobüs</span>`;
  } else if (type === "otobus_durak") {
    icon = `<i class="fas fa-location-dot"></i><span> Otobüs Durağı</span>`;
  } else if (type === "tramvay") {
    icon = `<i class="fas fa-train"></i><span> Tramvay</span>`;
  } else if (type === "tramvay_durak") {
    icon = `<i class="fas fa-car-tunnel"></i><span> Tramvay Durağı</span>`;
  }

  let bookmarkIcon =
    localStorage.getItem("bookmarks") &&
    JSON.parse(localStorage.getItem("bookmarks"))[`${type}_${code}`]
      ? "fas"
      : "far";

  return `
        <div class="result ${type}" onclick="getContents('${type}', '${code}')">
            <div class="icon">${icon}</div>
            <div class="code">${code}</div>
            <div class="name">${data.name}</div>
            <div class="bookmark" onclick="event.stopPropagation(); bookmark('${type}_${code}', this)">
                <i class="${bookmarkIcon} fa-bookmark"></i>
            </div>
        </div>
    `;
}

function bookmark(item, element) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  if (bookmarks[item]) {
    delete bookmarks[item];
    $(element).children().removeClass("fas").addClass("far");
  } else {
    bookmarks[item] = true;
    $(element).children().removeClass("far").addClass("fas");
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function search() {
  results.html(`<div class="loader mt-5"></div>`);
  searchButton.prop("disabled", true);
  $.ajax({
    url: "/api/search",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      text: q.val(),
    }),
    success: function (data) {
      results.html("");
      if (data.length === 0) {
        results.html("<h3 class='text-center'>Sonuç bulunamadı!</h3>");
        return;
      }
      results.append(`
            <div class="table-header">
                <div class="icon"><span>Tür</span></div>
                <div class="code"><span>ID</span></div>
                <div class="name"><span>Ad</span></div>
            </div>
            `);
      for (let i = 0; i < data.length; i++) {
        results.append(createSearchResult(data[i]));
      }
      filterResults(searchType.val());
      searchButton.prop("disabled", false);
    },
    error: function (err) {
      results.html(`<li>Error: ${err.responseJSON.error}</li>`);
      searchButton.prop("disabled", false);
    },
  });
}

function filterResults(type) {
  if (type === "all") {
    $(".result").show();
  } else {
    $(".result").hide();
    $(`.${type}`).show();
  }
}

function getContents(type, code) {
  if (type === "otobus_durak") {
    window.location.href = `/busses/${code}`;
  } else if (type === "otobus") {
    window.location.href = `/buslines/${code}`;
  } else if (type === "tramvay") {
    window.location.href = `/tramlines/${code}`;
  } else if (type === "tramvay_durak") {
    window.location.href = `/tramstops/${code}`;
  }
}

searchType.on("change", function () {
  filterResults(searchType.val());
});

if (!localStorage.getItem("bookmarks"))
  localStorage.setItem("bookmarks", JSON.stringify({}));
