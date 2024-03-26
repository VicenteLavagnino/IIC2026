const { Row } = require("react-bootstrap");

const APPLE = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Apple.csv"
const data_path = APPLE;


// COMPLETAR CON CÓDIGO JS y D3.JS NECESARIO

const WIDTH = 900;
const HEIGHT = 600;

const svg = d3.select("#vis")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);


// Función para parsear los datos, luego esto se lo pasamos a d3.csv
const parseo = row => {
    return {
        date: d3.timeParse("%Y-%m-%d")(row.fecha),
        start: parseFloat(row.inicio),
        max: parseFloat(row.maximo),
        min: parseFloat(row.minimo),
        end: parseFloat(row.fin),
    }
}

// Función para leer y preprocesar los datos
function preprocessingBarchartDataset(data) {
    // console.log(data);

    d3.csv(data, parseo).then(function (data) {
        // Ver los datos parseados
        // console.log(data);

        /* Ordenamos la información por fechas */
        let sortedData = data.sort((a, b) => d3.ascending(a.date, b.date));

        // Llamamos a nuestra función que genera la visualización
        barplot(sortedData);
    });
}


function barplot(parsed_data) {

    // Ver los datos
    console.log(parsed_data);

    // SETEAR LA VISUALIZACION

    // Máximo para los datos según el atributo "max"
    let max_point = d3.max(parsed_data, d => d.max);

    // definimos las escalas
    let escala_horizontal = d3.scaleLinear().domain([0, max_point * 1.1]).range([0, WIDTH]);
    let escala_vertical = d3.scaleBand().domain(parsed_data.map(d => d.date)).range([0, HEIGHT]);

    // Definimos los ejes en relación a las escalas
    let ejeX = d3.axisBottom(escala_horizontal);
    let ejeY = d3.axisLeft(escala_vertical);

    // Creamos nuestro primer RECT que será el fondo
    SVG.append("rect")
        .attr("x", 0) // Definimos atributo X
        .attr("y", 0) // Definimos atributo Y
        .attr("width", WIDTH) // Definimos atributo "ancho"
        .attr("height", HEIGHT) // Definimos atributo "largo"
        .attr("fill", " #D2EBF1") // Definimos el relleno
        .attr("stroke", "black"); // Definimos el color del borde

    // Agregamos el eje X. Para esto usamos call y d3.axisBottom(escala_horizontal)
    SVG.append("g")
        .attr("id", "ejeX") // Le damos un ID
        .attr("transform", `translate(0, ${HEIGHT})`) // Trasladamos el G
        .call(ejeX); // Usamos call para crear el eje

    //Agregamos el eje Y. Para esto usamos call y d3.axisLeft(escala_vertical)
    SVG.append("g")
        .attr("id", "ejeY") // Le damos un ID
        .attr("transform", `translate(0, 0)`) // Trasladamos el G
        .call(ejeY); // Usamos call para crear el eje






}

/* Llamamos a nuestra función encargada de procesar los datos, que a su vez se encarga de llamar
a la función que crea la visualización */
preprocessingBarchartDataset(data_path);
