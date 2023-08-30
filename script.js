window.onload = init;
const ATTAINED = "Attained";
const App = {};

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
          const oca_response_propability = calculate_score();
          console.log("> OCA predicted response probability: ", oca_response_propability); // FOR DEBUG

          show_results(oca_response_propability);
          show_notifications(oca_response_propability, toast);


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
} // END init()

function calculate_score() {
      const baseline_survival = {
            poise_12m: 0.6954680,
            poise_24m: 0.6115819,
            alpuln_12m: 0.4327055,
            alpuln_24m: 0.3369205,
            nr_12m: 0.9285800,
            nr_24m: 0.8760027
      };
      const baseline_survival_plus = {
            poise_12m: 0.7026726,
            poise_24m: 0.6179623,
            alpuln_12m: 0.3938514,
            alpuln_24m: 0.2930832,
            nr_12m: 0.9549920,
            nr_24m: 0.9180344
      };

      const data =  {};
      data.alp = alp.value ? alp.value : undefined;
      data.alp_uln = alp_uln.value ? alp_uln.value : undefined;
      data.age_start = age_start.value ? age_start.value : undefined;
      data.pruritus = pruritus.value !== 'Select a value' && pruritus.value == "Yes" ? 1 : pruritus.value !== 'Select a value' && pruritus.value == "No" ? 0 : undefined;
      data.cirrhosis = cirrhosis.value !== 'Select a value' && cirrhosis.value == "Yes" ? 1 : cirrhosis.value !== 'Select a value' && cirrhosis.value == "No" ? 0 : undefined;
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

      console.log("> Variables read from form: ", data); // FOR DEBUG

      const ors_score = ors_plus.checked ? calculate_ors_plus(data) : calculate_ors(data);
      console.log("> ORS Scores calculated: ", ors_score); // FOR DEBUG

      const oca_response_propability = ors_plus.checked ? calculate_oca_response_propability(ors_score, baseline_survival_plus) : calculate_oca_response_propability(ors_score, baseline_survival);
      return oca_response_propability;
}

function calculate_ors(data) {
      const ors_score = {};
      ors_score.poise = 1.5530021
                        - (0.014619049 * data.age_start)
                        + (0.64567037 * data.pruritus)
                        + (0.68734539 * (data.alp / data.alp_uln))
                        - (1.3477237 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.38), 0), 3))
                        + (2.3394176 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.8), 0), 3))
                        - (1.0333051 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 2.471429), 0), 3))
                        + (0.041611269 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 4.87), 0), 3))
                        - (0.26753893 * data.cirrhosis)
                        - (1.2938781 * data.total_bilirubin)
                        - (0.26917078 * Math.min(data.alt/data.alt_uln, 1.5))
                        + (0.063070033 * (data.ggt / data.ggt_uln));

      ors_score.alpuln = 3.2969418
                        - (0.52175514 * data.pruritus)
                        - (1.3061516 * (data.alp / data.alp_uln))
                        + (0.2527601 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.5), 0), 3))
                        - (0.32479018 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 2.05), 0), 3))
                        + (0.07203008 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 3.98), 0), 3))
                        - (0.22389756 * data.cirrhosis)
                        - (0.49623968 * data.total_bilirubin)
                        + (0.021747561 * (data.ggt / data.ggt_uln));

      ors_score.normal_range = 4.4364308
                        - (0.44185524 * data.pruritus)
                        - (1.6629714 * (data.alp / data.alp_uln))
                        + (0.4761417 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.5), 0), 3))
                        - (0.61182975 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 2.05), 0), 3))
                        + (0.13568805 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 3.98), 0), 3))
                        - (1.2762865 * data.total_bilirubin);

      return ors_score;
}

function calculate_ors_plus(data) {
      const ors_score = {};
      ors_score.poise = (data.alp_six_month / data.alp_uln_six_month) < 1.67
                        &&
                        (((data.alp_six_month / data.alp_uln_six_month) - (data.alp / data.alp_uln)) / (data.alp / data.alp_uln)) < -0.15
                        &&
                        data.total_bilirubin_six_month <= 1
                        ?
                        ATTAINED
                        :
                        2.9645625
                        - (0.010079541 * data.age_start)
                        - (0.35115548 * data.pruritus)
                        - (0.69673211 * (data.alp / data.alp_uln))
                        - (0.29445138 * data.cirrhosis)
                        - (1.37536 * data.total_bilirubin)
                        - (0.34807907 * Math.min(data.alt/data.alt_uln, 1.5))
                        + (0.050888012 * (data.ggt / data.ggt_uln))
                        - (2.9107294 * (((data.alp_six_month / data.alp_uln_six_month) - (data.alp / data.alp_uln)) / (data.alp / data.alp_uln)))
                        - (0.34485537 * ((data.total_bilirubin_six_month - data.total_bilirubin) / data.total_bilirubin));

      ors_score.alpuln = (data.alp_six_month / data.alp_uln_six_month) < 1.67
                        ?
                        ATTAINED
                        :
                        3.599032
                        - (0.3174984 * data.pruritus)
                        - (1.9028261 * (data.alp / data.alp_uln))
                        + (0.37678444 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.5), 0), 3))
                        - (0.48415824 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 2.05), 0), 3))
                        + (0.1073738 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 3.98), 0), 3))
                        - (0.2170505 * data.cirrhosis)
                        - (0.31490853 * data.total_bilirubin)
                        + (0.0031310468 * (data.ggt / data.ggt_uln))
                        - (2.9417792 * (((data.alp_six_month / data.alp_uln_six_month) - (data.alp / data.alp_uln)) / (data.alp / data.alp_uln)))
                        + (0.15460768 * ((data.total_bilirubin_six_month - data.total_bilirubin) / data.total_bilirubin));

      ors_score.normal_range = (data.alp_six_month / data.alp_uln_six_month) <= 1
                        &&
                        data.total_bilirubin_six_month <= 1
                        ?
                        ATTAINED
                        :
                        5.0951908
                        - (0.12683862 * data.pruritus)
                        - (2.6602294 * (data.alp / data.alp_uln))
                        + (0.65691461 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 1.5), 0), 3))
                        - (0.84411826 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 2.05), 0), 3))
                        + (0.18720365 * Math.pow( Math.max( ((data.alp / data.alp_uln) - 3.98), 0), 3))
                        - (1.3707677 * data.total_bilirubin)
                        - (5.2589765 * (((data.alp_six_month / data.alp_uln_six_month) - (data.alp / data.alp_uln)) / (data.alp / data.alp_uln)))
                        + (0.067090469 * ((data.total_bilirubin_six_month - data.total_bilirubin) / data.total_bilirubin));

      return ors_score;
}

function calculate_oca_response_propability(ors_score, baseline_survival) {
      const oca_response_propability = {};

      oca_response_propability.poise_12m = 1 - Math.pow(baseline_survival.poise_12m, Math.pow(Math.E, ors_score.poise));
      oca_response_propability.poise_24m = 1 - Math.pow(baseline_survival.poise_24m, Math.pow(Math.E, ors_score.poise));
      oca_response_propability.alpuln_12m = 1 - Math.pow(baseline_survival.alpuln_12m, Math.pow(Math.E, ors_score.alpuln));
      oca_response_propability.alpuln_24m = 1 - Math.pow(baseline_survival.alpuln_24m, Math.pow(Math.E, ors_score.alpuln));
      oca_response_propability.nr_12m = 1 - Math.pow(baseline_survival.nr_12m, Math.pow(Math.E, ors_score.normal_range));
      oca_response_propability.nr_24m = 1 - Math.pow(baseline_survival.nr_24m, Math.pow(Math.E, ors_score.normal_range));

      return oca_response_propability;
}

function show_results(oca_response_propability) {
      poise_12m.innerText = oca_response_propability.poise_12m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.poise_12m) ? "--" : oca_response_propability.poise_12m;
      poise_24m.innerText = oca_response_propability.poise_24m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.poise_24m) ? "--" : oca_response_propability.poise_24m;
      alp_12m.innerText = oca_response_propability.alpuln_12m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.alpuln_12m) ? "--" : oca_response_propability.alpuln_12m;
      alp_24m.innerText = oca_response_propability.alpuln_24m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.alpuln_24m) ? "--" : oca_response_propability.alpuln_24m;
      nr_12m.innerText = oca_response_propability.nr_12m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.nr_12m) ? "--" : oca_response_propability.nr_12m;
      nr_24m.innerText = oca_response_propability.nr_24m == ATTAINED ? ATTAINED : isNaN(oca_response_propability.nr_24m) ? "--" : oca_response_propability.nr_24m;
}

function show_notifications(oca_response_propability, toast) {
      const svg_ok = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-base-200 shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      const svg_error = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      const poise_text = !isNaN(oca_response_propability.poise_12m) ? "POISE, " : oca_response_propability.poise_12m == ATTAINED ? "POISE, " : "";
      const alpuln_text = !isNaN(oca_response_propability.alpuln_12m) ? "ALP < 1.67, " : oca_response_propability.alpuln_12m == ATTAINED ? "ALP < 1.67, " : "";
      const nr_text = !isNaN(oca_response_propability.nr_12m) ? "Normal Range " : oca_response_propability.nr_12m == ATTAINED ? "Normal Range " : "";
      if ( poise_text || alpuln_text || nr_text) {
          let toast_message = "ORS for " + poise_text + alpuln_text + nr_text + "criteria has been calculated.";
          toast.innerHTML = svg_ok + toast_message;
          toast.classList.remove("alert-error");
          toast.classList.add("alert-success");
      }
      else {
          let toast_message = "ORS cannot be calcolated !"
          toast.innerHTML = svg_error + toast_message;
          toast.classList.add("alert-error");
          toast.classList.remove("alert-success");
      }
}
