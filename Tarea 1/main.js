const APPLE = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Apple.csv"
const SONY = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Sony.csv"

const data_path = APPLE;


// COMPLETAR CON CÓDIGO JS y D3.JS NECESARIO

const WIDTH = 900;
const HEIGHT = 600;

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
    // console.log(parsed_data);

    // SETEAR LA VISUALIZACION

    const margin = { top: 20, right: 50, bottom: 30, left: 50 },
        width = WIDTH - margin.left - margin.right,
        height = HEIGHT - margin.top - margin.bottom;


    // ESCALAS
    const escala_horizontal = d3.scaleTime().domain(d3.extent(parsed_data, d => d.date)).range([0, width]);
    const escala_vertical = d3.scaleLinear().domain([0.9 * d3.min(parsed_data, d => Math.min(d.min, d.start, d.end)), 1.1 * d3.max(parsed_data, d => Math.max(d.max, d.start, d.end))]).range([height, 0]);

    // SVG
    const svg = d3.select("#vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // TITULO

    svg.append("text")
        .attr("x", (WIDTH / 2))
        .style("font-size", "20px")
        .text("Acciones Apple")


    // EJES X e Y EN RELACION A LAS ESCALAS
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(escala_horizontal));

    svg.append("g")
        .call(d3.axisLeft(escala_vertical));

    // LINEA MAX y MIN
    svg.selectAll("difference-line")
        .data(parsed_data)
        .enter()
        .append("line")
        .attr("x1", d => escala_horizontal(d.date))
        .attr("y1", d => escala_vertical(d.max))
        .attr("x2", d => escala_horizontal(d.date))
        .attr("y2", d => escala_vertical(d.min))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // BARRAS
    svg.selectAll(".bar")
        .data(parsed_data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => escala_horizontal(d.date) - 2)
        .attr("y", d => escala_vertical(Math.max(d.start, d.end)))
        .attr("width", 5)
        .attr("height", d => Math.abs(escala_vertical(d.start) - escala_vertical(d.end)))
        .attr("fill", d => d.start > d.end ? "red" : "green")
        .attr("stroke", "black");
}

/* Llamamos a nuestra función encargada de procesar los datos, que a su vez se encarga de llamar
a la función que crea la visualización */
preprocessingBarchartDataset(data_path);
