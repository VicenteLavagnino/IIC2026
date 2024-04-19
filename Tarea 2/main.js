// El archivo incluye reproducciónn de música. 
// Al final se explica como apagarlo por si acaso 😅

const SERIES_URL = "https://raw.githubusercontent.com/Hernan4444/public_files/main/db_series.csv"

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

// Editar tamaños como estime conveniente
const WIDTH_VIS_1 = 800;
const HEIGHT_VIS_1 = 250;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 1600;

// código sacado de https://github.com/PUC-Infovis/Syllabus-2024-1/blob/main/Ayudantias/Ayudantia_3/data_join.js
const MARGIN = {
    top: 30,
    bottom: 30,
    right: 30,
    left: 30,
  };

SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

crearSeries();

function crearSeries() {
    /* 
    Esta función utiliza el dataset indicado en SERIES_URL para crear 
    la primeva visualización.
    En esta visualización están las 3 series que deben ser dibujadas aplicando data-join 
    */
    d3.csv(SERIES_URL, d3.autoType).then(series => {
        console.log(series)
        console.log(series.map(d => d.serie))

        // No olvides actualizar los <span> con el "style" de background-color
        // según el color categóricos elegidos. Cada span tiene un ID único.

        // Tamaño
        const width = WIDTH_VIS_1 - MARGIN.left - MARGIN.right;
        const height = HEIGHT_VIS_1 - MARGIN.top - MARGIN.bottom;

        // Grafico
        const g = SVG1.append("g")

        // Escala X
        const x = d3.scaleBand()
            .domain(series.map(d => d.serie))
            .range([MARGIN.left, width + MARGIN.left])
            .padding(0.2);

        g.append("g").attr("transform", `translate(0, ${height + MARGIN.top})`).call(d3.axisBottom(x)); // Formato sacado de ayudantía

        // Escala Y
        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d.personajes_extras + 5)])
            .range([height + MARGIN.top, MARGIN.top]);

        g.append("g").attr("transform", `translate(${MARGIN.left}, 0)`).call(d3.axisLeft(y)); // Formato sacado de ayudantía


        // añadir libro

        // Libro izquierdo + tejuelos
        g.append("rect").attr("width", 50).attr("height", y(0) - y(series[0].personajes_extras)).attr("x", x(series[0].serie)).attr("y", y(series[0].personajes_extras)).attr("fill", series[0].manga ? "red" : "blue");
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[0].serie)).attr("y", y(series[0].personajes_extras) + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 50).attr("height", y(0) - y(series[1].personajes_extras)).attr("x", x(series[1].serie)).attr("y", y(series[1].personajes_extras)).attr("fill", series[1].manga ? "red" : "blue");
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[1].serie)).attr("y", y(series[1].personajes_extras) + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 50).attr("height", y(0) - y(series[2].personajes_extras)).attr("x", x(series[2].serie)).attr("y", y(series[2].personajes_extras)).attr("fill", series[2].manga ? "red" : "blue");
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[2].serie)).attr("y", y(series[2].personajes_extras) + 5 + 5).attr("fill", "yellow"); // Tejuelo

        // Definir colores
        const color_bycap = d3.scaleLinear([0, 300], ["white", "green"])

        // Libro medio
        g.append("rect").attr("width", 3 * series[0].aventuras).attr("height", (y(0) - y(series[0].personajes_extras)) / 2).attr("x", x(series[0].serie) + 50).attr("y",y(series[0].personajes_extras) + (y(0) - y(series[0].personajes_extras)) / 2).attr("fill", color_bycap(series[0].cantidad_caps));
        g.append("rect").attr("width", 3 * series[0].aventuras).attr("height", 5).attr("x", x(series[0].serie) + 50).attr("y",y(series[0].personajes_extras) + (y(0) - y(series[0].personajes_extras)) / 2 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 3 * series[1].aventuras).attr("height", (y(0) - y(series[1].personajes_extras)) / 2).attr("x", x(series[1].serie) + 50).attr("y",y(series[1].personajes_extras) + (y(0) - y(series[1].personajes_extras)) / 2).attr("fill", color_bycap(series[1].cantidad_caps));
        g.append("rect").attr("width", 3 * series[1].aventuras).attr("height", 5).attr("x", x(series[1].serie) + 50).attr("y",y(series[1].personajes_extras) + (y(0) - y(series[1].personajes_extras)) / 2 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 3 * series[2].aventuras).attr("height", (y(0) - y(series[2].personajes_extras)) / 2).attr("x", x(series[2].serie) + 50).attr("y",y(series[2].personajes_extras) + (y(0) - y(series[2].personajes_extras)) / 2).attr("fill", color_bycap(series[2].cantidad_caps));
        g.append("rect").attr("width", 3 * series[2].aventuras).attr("height", 5).attr("x", x(series[2].serie) + 50).attr("y",y(series[2].personajes_extras) + (y(0) - y(series[2].personajes_extras)) / 2 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        
        // Libro derecho
        g.append("rect").attr("width", 50).attr("height", y(0) - 90).attr("x", x(series[0].serie) + 50 + 3 * series[0].aventuras).attr("y", 90).attr("fill", "purple");
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[0].serie) + 50 + 3 * series[0].aventuras).attr("y", 90 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 50).attr("height", y(0) - 90).attr("x", x(series[1].serie) + 50 + 3 * series[1].aventuras).attr("y", 90).attr("fill", "white");
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[1].serie) + 50 + 3 * series[1].aventuras).attr("y", 90 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        g.append("rect").attr("width", 50).attr("height", y(0) - 90).attr("x", x(series[2].serie) + 50 + 3 * series[2].aventuras).attr("y", 90);
        g.append("rect").attr("width", 50).attr("height", 5).attr("x", x(series[2].serie) + 50 + 3 * series[2].aventuras).attr("y", 90 + 5 + 5).attr("fill", "yellow"); // Tejuelo
        

        /* 
        Cada vez que se haga click en un conjunto de libros. Debes llamar a
        preprocesarPersonajes(serie, false) donde "serie" 
        corresponde al nombre de la serie presionada.
    
        preprocesarPersonajes se encargará de ejecutar a crearPersonajes(...)
        */
    })



}

function crearPersonajes(dataset, serie, filtrar_dataset, ordenar_dataset) {
    // Actualizo nombre de un H4 para saber qué hacer con el dataset
    let texto = `Serie: ${serie} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto);

    // Nos quedamos con los personajes asociados a la serie seleccionada
    let datos = dataset.filter(d => {
        if (serie == "Dragon Ball") {
            return d.Dragon_ball == true;
        }
        else if (serie == "Dragon Ball Z") {
            return d.Dragon_ball_z == true;
        }
        else if (serie == "Dragon Ball GT") {
            return d.Dragon_ball_gt == true;
        }
    })

    // 1. Filtrar, cuando corresponde, por poder_aumenta > 10
    // Completar aquí
    console.log(filtrar_dataset)


    // 2. Ordenar, según corresponda, los personajes. Completar aquí
    console.log(ordenar_dataset)


    // 3. Confeccionar la visualización 
    // Todas las escalas deben estar basadas en la información de "datos"
    // y NO en "dataset".

    console.log(datos)
    // No olvides que está prohibido el uso de loop (no son necesarios)
    // Y debes aplicar correctamente data-join
    // ¡Mucho éxito 😁 !
}



/* 
Código extra para reproducir música acorde a la tarea.
Si no quieres escuchar cuando se carga la página, solo cambia la línea:
let playAudio = true; por let playAudio = false;
O bien elimina todo el código que está a continuación 😅 
*/
try {
    const audio = new Audio('https://github.com/Hernan4444/public_files/raw/main/dbgt.mp3');
    audio.volume = 0.3;
    audio.loop = true;
    let playAudio = false;
    if (playAudio) {
        audio.play();
        d3.select("#sound").text("OFF Music 🎵")
    }
    d3.select("#sound").on("click", d => {
        playAudio = !playAudio;
        if (playAudio) {
            audio.play();
            d3.select("#sound").text("OFF Music 🎵")
        }
        else {
            audio.pause();
            d3.select("#sound").text("ON Music 🎵")
        }
    })
} catch (error) { };
