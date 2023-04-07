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
    let requests = [];
    data.forEach(function (fellow) {
      let fellowName = "<td>" + "<a href=" + fellow.html_url + ">" +fellow.login + "</a>" + "</td>";
      let fellowContributions = "<td>" + fellow.contributions + "</td>";
      str += "<tr class='fellowRow' id='fellow-" + fellow.login + "'>" + fellowName + fellowContributions + "</tr>";
      requests.push(fetch(fellow.avatar_url));
    });
    if (fellowContainer) {
      fellowContainer.innerHTML = str;
    }
    if (loading) {
        setTimeout(() => {
          loading.classList.add("d-none");
        }, 100);
      }
    Promise.all(requests)
      .then(responses => Promise.all(responses.map(res => res.blob())))
      .then(blobs => {
        blobs.forEach((blob, i) => {
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
            const dataUrl = canvas.toDataURL();
            const tableCell = document.querySelector(`#fellow-${data[i].login} td:first-child`);
            tableCell.innerHTML = `<img class="fellow-avatar" src="${dataUrl}" alt="Contributor Avatar" width="50" height="50">` + tableCell.innerHTML;
            URL.revokeObjectURL(url);
          };
          img.src = url;
        });
      });
    if (loading) {
      loading.classList.add("d-none");
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    if (error) {
      error.classList.remove("d-none");
    }
    if (loading) {
      loading.classList.add("d-none");
    }
  });
