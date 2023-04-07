const url = "https://api.github.com/repos/MLH-Fellowship/prep-portfolio-23.APR.PREP.2/contributors";
const fellowContainer = document.getElementById("fellowContainer");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

if (!loading) {
    setTimeout(() => {
      loading.classList.remove("d-none");
    }, 500);
  }

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    let str = "";
    data.forEach(function (fellow) {
      let fellowName = "<td>" + "<a href=" + fellow.html_url + ">" +fellow.login + "</a>" + "</td>";
      let fellowContributions = "<td>" + fellow.contributions + "</td>";
      str += "<tr class='fellowRow'>" + fellowName + fellowContributions + "</tr>";
    });
    fellowContainer.innerHTML = str;
    if (loading) {
        setTimeout(() => {
            loading.classList.add("d-none");
          }, 500)
      }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    error.classList.remove("d-none");
    if (loading) {
        loading.classList.add("d-none");
      }
    
  });
