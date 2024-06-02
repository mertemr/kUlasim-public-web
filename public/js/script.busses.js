const search = $("#search");
const searchButton = $("#searchButton");
const searchResults = $("#searchResults");

search.on("input", function () {
  const isInputNotEmpty = search.val().length > 0;
  searchButton.prop("disabled", !isInputNotEmpty);
});

searchButton.on("click", function () {
  performSearch(); 
});

function performSearch() { // Search function
  searchResults.html(`<div class="loader mt-5"></div>`);
  $.ajax({
    url: "/api/busstop/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ busStopCode: search.val() }),
    success: handleSearchSuccess,
    error: handleError,
  });
}

function handleSearchSuccess(data) { // Search results
  searchResults.html("");
  if (data.length === 0) {
    searchResults.html(
      '<div class="col-12 text-center">Şuanda yaklaşan otobüs yok.</div>',
    );
  } else {
    data.forEach(displayBusInfo);
  }
}

function displayBusInfo(bus) { // Bus info card
  const minClass = getMinClass(bus.time_to_stop);
  const leftTimeHtml = `<span class="${minClass}">${bus.time_to_stop}</span>`;
  const direction = bus.direction === "ARRIVAL" ? "Varış" : "Kalkış";

  const busInfoHtml = `
        <div class="col-12">
            <div class="card">
                <div class="card-header">${direction}</div>
                <div class="card-body">
                    <blockquote class="blockquote mb-0">
                        <div class="d-flex justify-content-between">
                            <p class="left-align">
                                <i class="bus-code">${bus.code}</i>${bus.name}
                            </p>
                            <p class="right-align left-time">
                                ${leftTimeHtml} dakika
                            </p>
                        </div>
                        <footer class="blockquote-footer mt-2 plate-num">
                            ${bus.plate_num}
                            <div class="float-end">
                                <a href="/buslines/${bus.code}" class="btn">
                                    <i class="fa-solid fa-directions"></i> Otobüs Güzergahı
                                </a>
                                <a href="#" class="btn" onclick="showBusTimes('${bus.code}')">
                                    <i class="fa-solid fa-calendar-days"></i> Saatleri Göster
                                </a>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    `;

  searchResults.append(busInfoHtml);
}

function getMinClass(time) { // Time to stop class
  return time <= 2 ? "min-2" : time <= 5 ? "min-5" : "min-10";
}

function showBusTimes(busCode) { // Popup modal
  $.ajax({
    url: "/api/timetable/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ busCode: busCode }),
    success: (data) => {
      const timetable = data.timetable;
      const WORKDAY = timetable.WORKDAY || [];
      const SATURDAY = timetable.SATURDAY || [];
      const SUNDAY = timetable.SUNDAY || [];
      const popupModal = $(
        `<div
        class="modal fade"
        id="busTimesModal"
        tabindex="-1"
        aria-labelledby="busTimesModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="busTimesModalLabel">
                Otobüs Kalkış Saatleri
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <ul class="nav nav-tabs" id="timetableTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="workday-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#workday"
                    type="button"
                    role="tab"
                    aria-controls="workday"
                    aria-selected="true"
                  >
                    Hafta İçi
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="saturday-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#saturday"
                    type="button"
                    role="tab"
                    aria-controls="saturday"
                    aria-selected="false"
                  >
                    Cumartesi
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="sunday-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#sunday"
                    type="button"
                    role="tab"
                    aria-controls="sunday"
                    aria-selected="false"
                  >
                    Pazar
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="timetableTabsContent">
                <div
                  class="tab-pane fade show active"
                  id="workday"
                  role="tabpanel"
                  aria-labelledby="workday-tab"
                >
                  <ul class="list-group list-group-flush">
                    ${WORKDAY.map( (time) => `
                    <li class="list-group-item">${time}</li>
                    `, ).join("")}
                  </ul>
                </div>
                <div
                  class="tab-pane fade"
                  id="saturday"
                  role="tabpanel"
                  aria-labelledby="saturday-tab"
                >
                  <ul class="list-group list-group-flush">
                    ${SATURDAY.map( (time) => `
                    <li class="list-group-item">${time}</li>
                    `, ).join("")}
                  </ul>
                </div>
                <div
                  class="tab-pane fade"
                  id="sunday"
                  role="tabpanel"
                  aria-labelledby="sunday-tab"
                >
                  <ul class="list-group list-group-flush">
                    ${SUNDAY.map( (time) => `
                    <li class="list-group-item">${time}</li>
                    `, ).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `,
      );

      popupModal.modal("show");
      $("body").append(popupModal);
    },
    error: handleError,
  });
}

function handleError(err) { // Error handling
  console.error(err);
}
