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
    url: "/api/tramstop/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ query: search.val() }),
    success: handleSearchSuccess,
    error: handleError,
  });
}

function handleSearchSuccess(data) { // Search results
  searchResults.html("");
  if (data.length === 0) {
    searchResults.html(
      '<div class="col-12 text-center">Şuanda yaklaşan tramvay yok.</div>',
    );
  } else {
    data.forEach(displayBusInfo);
  }
}

function displayBusInfo(data) {
  const tramStop = data.tramStop;
  const trams = data.trams;

  console.log(tramStop, trams);
  // tramStop
  // {stop_name: 'Organize Sanayi', direction: 'ARRIVAL', tram_id: 'T1', tram_direction: 'İldem-Organize', tram_uuid: '2fb54e8b-7dea-4578-ae2f-b73677adc430'}

  // trams
  // [{doorNo: '34 - 38', timeToStop: 12}, {doorNo: '34 - 38', timeToStop: 12}...]

  // TODO CSS düzeltilecek
  const tramStopElement = $(`
  <div class="col">
      <div class="card">
          <div class="card-body">
              <div
                  class="d-flex justify-content-between align-items-center"
              >
                  <h4 class="card-title mb-1 text-truncate">
                      ${tramStop.stop_name} [${tramStop.tram_id}]
                  </h4><br /><br /><br />
                  <p class="card-text text-muted" style="padding-left: 1rem">
                      ${tramStop.tram_direction}
                  </p>
                  </div>
              <div class="d-flex align-items-center flex-column" style="min-width: 100px">
                  ${ trams.map( (tram) => `
                  <h5>
                      <span class="badge bg-primary">${tram.doorNo}</span>
                      ${tram.timeToStop} dakika sonra geçecek
                  </h5>
                  `, ).join("") }
              </div>
          </div>
      </div>
  </div>

  `);

  searchResults.append(tramStopElement);
}

function handleError(error) {
  console.error(error);
  searchResults.html(
    '<div class="col-12 text-center">Bir hata oluştu. Lütfen tekrar deneyin.</div>',
  );
}