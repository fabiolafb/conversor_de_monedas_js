let buscar = document.querySelector("#btn-buscar");
let result = document.getElementById("result");
let input = document.querySelector("#input-clp");
let divisa = document.querySelector("#tipo-moneda");

// Captura botón buscar con async para llamar a la funcion convertir, que a su vez es asincrona
buscar.addEventListener("click", async () => {
  if (input.value == "") {
    alert("Debes ingresar un monto en CLP");
  } else {
    await convertir();
    renderGrafica();
  }
});

//  Función fetch que llama a la API de minedas.JSON
async function getMoney() {
  try {
    const res = await fetch("assets/json/monedas.json");
    const dataArray = await res.json();

    return dataArray;
  } catch (e) {
    alert(e.message);
  }
}

//  Funcion que llena los select del HTML en base a los datos de la API
async function llenarSelect() {
  const dataArray = await getMoney();
  let divisa = document.querySelector("#tipo-moneda");

  let html = "";
  for (let moneda of dataArray) {
    html += `
            <option value="${moneda.Codigo}">${moneda.Nombre}</option>
            `;
  }
  divisa.innerHTML = html;
}
llenarSelect();


// Funcion convertidora que filtra la moneda segun la seleccion desde el select de HTML, sacando su valor y el simbolo para mostrarlo en el HTML
async function convertir() {
  const dataArray = await getMoney();
  const filtrarMoneda = dataArray.filter((d) => d.Codigo == divisa.value);
  const simboloMoneda = filtrarMoneda.map((d) => d.Simbolo);
  const valorMoneda = filtrarMoneda.map((d) => d.Valor);
  //console.log(simboloMoneda, valorMoneda);
  let conversion = +input.value / +valorMoneda;
  result.innerHTML = `${simboloMoneda} ${conversion.toFixed(2)}`;
}

//Preparar elementos que contiene el gráfico
function prepararConfiguracionParaGrafica(monedas) {
  // Creamos las variables necesarias para el objeto de configuración
  const titulo = "Monedas";
  const filtrarMoneda = monedas.filter((d) => d.Codigo == divisa.value); 
  const valores = filtrarMoneda.map((moneda) => moneda.Valor );


  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: "line",
    data: {
      labels: ["2018", "2019", "2020", "2021", "2022"],
      datasets: [
        {
          label: titulo,
          backgroundColor: "blue",
          data:  [+(valores *0.8).toFixed(2),
          +(valores *0.6).toFixed(2),
          +(valores *0.7).toFixed(2),
          +(valores *0.5).toFixed(2),
          +(valores *0.9).toFixed(2)],
          pointBackgroundColor: "white",

          fill: false,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    }, 
  };
  return config;
}


//Funcion que llama al grafico para mostrarlo en el HTML
async function renderGrafica() {
  const monedas = await getMoney();
  const config = prepararConfiguracionParaGrafica(monedas);
  const chartDOM = document.getElementById("myChart").getContext('2d');
  new Chart(chartDOM, config);
}
