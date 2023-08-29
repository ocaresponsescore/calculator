window.onload = init;

function init() {
      // UI input elements
      const alp = document.querySelector("#alp");
      const alp_uln = document.querySelector("#alp_uln");
      const age_start = document.querySelector("#age_start");
      const pruritus = document.querySelector("#pruritus");
      const cirrhosis = document.querySelector("#cirrhosis");
      const total_bilirubin = document.querySelector("#total_bilirubin");
      const alt = document.querySelector("#alt");
      const alt_uln = document.querySelector("#alt_uln");
      const ggt = document.querySelector("#ggt");
      const ggt_uln = document.querySelector("#ggt_uln");
      const ors_plus = document.querySelector("#ors_plus");
      const alp_six_month = document.querySelector("#alp_six_month");
      const alp_uln_six_month = document.querySelector("#alp_uln_six_month");
      const total_bilirubin_six_month = document.querySelector("#total_bilirubin_six_month");

      // UI output elements
      const poise_12m = document.querySelector("#poise_12m");
      const poise_24m = document.querySelector("#poise_24m");
      const alp_12m = document.querySelector("#alp_12m");
      const alp_24m = document.querySelector("#alp_24m");
      const nr_12m = document.querySelector("#nr_12m");
      const nr_24m = document.querySelector("#nr_24m");

      // UI interaction
      const calculate = document.querySelector("#calculate");
      const toast = document.querySelector("#toast_message");

      // ORS Calculation on click
      calculate.onclick = () => {
          calculate.addEventListener("transitionend", () => {
            toast.classList.remove("hidden");
            // TODO: Check input variables here
            toast.classList.remove("fade-out");
          }, {once:true});
          calculate.classList.add("fade-out");

          setTimeout( ()=> {
            toast.addEventListener("transitionend", () => {
              toast.classList.add("hidden");
              calculate.classList.remove("fade-out");
            }, {once:true});
            toast.classList.add("fade-out");
          }, 5000);
      };

      // ORS+ visibiliy control
      ors_plus.onchange = () => {
        if (ors_plus.checked) {
          document.querySelectorAll(".ors-plus-toggle").forEach( (elem) => {
            elem.classList.remove("hidden");
          });
        } else {
          document.querySelectorAll(".ors-plus-toggle").forEach( (elem) => {
            elem.classList.add("hidden");
          });
        }
      };
}

function calculate_score() {
      const data =  {};
      data.alp = alp.value ? alp.value : undefined;
      data.alp_uln = alp_uln.value ? alp_uln.value : undefined;
      data.age_start = age_start.value ? age_start.value : undefined;
      data.pruritus = pruritus.value !== 'Select a value' ? pruritus.value : undefined;
      data.cirrhosis = cirrhosis.value !== 'Select a value' ? cirrhosis.value : undefined;
      data.total_bilirubin = total_bilirubin.value ? total_bilirubin.value : undefined;
      data.alt = alt.value ? alt.value : undefined;
      data.alt_uln = alt_uln.value ? alt_uln.value : undefined;
      data.ggt = ggt.value ? ggt.value : undefined;
      data.ggt_uln = ggt_uln.value ? ggt_uln.value : undefined;

      if (ors_plus.checked) {
            data.alp_six_month = alp_six_month.value ? alp_six_month.value : undefined;
            data.alp_uln_six_month = alp_uln_six_month.value ? alp_uln_six_month.value : undefined;
            data.total_bilirubin_six_month = total_bilirubin_six_month.value ? total_bilirubin_six_month.value : undefined;
      }

      console.log(data); // FOR DEBUG
}
