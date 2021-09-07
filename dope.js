let form = document.querySelector("form");
let input_pin = document.querySelector(".input_pin");
let full_arr = new Array();
let obj;
let centre;
let dist;
let oors;
let vaccine_nam;
let result;
let dose_avi;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  primary(input_pin.value);
    loader_anim();
});

// for fetch the details
let primary = function (pincode_originals) {
  fetch(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode_originals}&date=3-04-2021`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.centers.length === 0 || data.centers === undefined) {
        throw new Error(
          "vaccine is not available in the location or wrong pincode"
        );
      }
      // console.log(data);
      for (let i = 0; i < data.centers.length; i++) {
        oors = data.centers[i].block_name;
        centre = data.centers[i].name;
        dist = data.centers[i].district_name;
        vaccine_nam = data.centers[i].sessions[0].vaccine;
        state = data.centers[i].state_name;
        dose_avi = data.centers[i].sessions[0].available_capacity;
        result = vlogs(centre, oors, dist, state, dose_avi, vaccine_nam);
        setTimeout(function () {
          // console.log(result);
          map_fun(result);
          input_pin.value = "";
        }, 3000);
      }
    })
    .catch((err) => alert(`oh sorry : ${err}`));
};

// for getting geo coordinates

let vlogs = function (centre, oors, dist, state, dose_avi, vaccine_nam) {
  fetch(
    `https://api.geocodify.com/v2/geocode?api_key=f6c614cf752dcaffd961ae391a76ad7cf6e99420&q=${oors} ${dist} ${state} india`
  )
    .then((res) => res.json())
    .then((info) => {
      // console.log(info);
      let coords = info.response.features[0].geometry.coordinates;
      //  swapping two items
      let a_coord = coords[1];
      coords[1] = coords[0];
      coords[0] = a_coord;
      const Obj_in = function (cnt, oor, dst, vacc, dosavi, cod) {
        this.cnt = cnt;
        this.oor = oor;
        this.dst = dst;
        this.dosavi = dosavi;
        this.vacc = vacc;
        this.cod = cod;
      };
      obj = new Obj_in(centre, oors, dist, vaccine_nam, dose_avi, coords);
      full_arr.push(obj);
    });
  return full_arr;
};

// to render the map

let map_fun = function (opt) {
  let pas = document.querySelector(".details");
  var map = L.map("map").setView([10.5414858, 79.8831603], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  var myIcon = L.icon({
    iconUrl: "./pin.png",
    iconSize: [32, 40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });
  opt.forEach((loop) => {
    L.marker(loop.cod, { icon: myIcon })
      .addTo(map)
      .bindPopup(L.popup({ maxWidth: 300, maxHeight: 300,autoClose : false, className: "popup" }))
      .setPopupContent(loop.cnt)
      .openPopup();
    let html = `<div class="det"> <ul>
                                    <li><span class="sub_point">Address:</span> ${loop.cnt}</li>
                                    <li>${loop.oor}</li>
                                    <li><span class="sub_point">District :</span> ${loop.dst}</li>
                                    <li><span class="sub_point">Dose availability</span> : ${loop.dosavi}</li>
                                    <li><span class="sub_point">vaccine :</span> ${loop.vacc}</li>
                                  </ul>
                          </div>`;
    pas.insertAdjacentHTML("beforeend", html);
  });
};
let loader_pg = document.querySelector(".load");
let loader_img = document.querySelector(".load_img");
let loader_anim = function () {
 
    loader_pg.classList.add("dopesf");
    loader_img.classList.add("dopesf");
    timero();
  
}

function timero() {
  setTimeout(() => {
    loader_pg.classList.remove("dopesf");
    loader_img.classList.remove("dopesf");
  },3000)
}