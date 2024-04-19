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

        const color_serie = d3.scaleOrdinal().domain(series.map(d => d.serie)).range(["purple", "green", "white"]);
        const color_bycap = d3.scaleLinear([0, 300], ["white", "black"]) // Escala de color


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


        // Libro izquierdo
        console.log(series)
        g.selectAll(".libro-izquierdo").data(series).join("rect").attr("class", "libro-izquierdo").attr("width", 50).attr("height", d => y(0) - y(d.personajes_extras)).attr("x", d => x(d.serie)).attr("y", d => y(d.personajes_extras)).attr("fill", d => d.manga ? "red" : "blue"); 
        g.selectAll(".tejuelo-izquierdo").data(series).join("rect").attr("class", "tejuelo-izquierdo").attr("width", 50).attr("height", 5).attr("x", d => x(d.serie)).attr("y", d => y(d.personajes_extras) + 5 + 5).attr("fill", "yellow"); // Tejuelas
        
        // Libro medio
        g.selectAll(".libro-medio").data(series).join("rect").attr("class", "libro-medio").attr("width", d => 3 * d.aventuras).attr("height", d => (y(0) - y(d.personajes_extras)) / 2).attr("x", d => x(d.serie) + 50).attr("y", d => y(d.personajes_extras) + (y(0) - y(d.personajes_extras)) / 2).attr("fill", d => color_bycap(d.cantidad_caps));
        g.selectAll(".tejuelo-medio").data(series).join("rect").attr("class", "tejuelo-medio").attr("width", d => 3 * d.aventuras).attr("height", 5).attr("x", d => x(d.serie) + 50).attr("y", d => y(d.personajes_extras) + (y(0) - y(d.personajes_extras)) / 2 + 5 + 5).attr("fill", "yellow"); // Tejuelas

        // Libro derecho
        g.selectAll(".libro-derecho").data(series).join("rect").attr("class", "libro-derecho").attr("width", 50).attr("height", y(0) - 90).attr("x", d => x(d.serie) + 50 + 3 * d.aventuras).attr("y", 90).attr("fill", d => color_serie(d.serie)); 
        g.selectAll(".tejuelo-derecho").data(series).join("rect").attr("class", "tejuelo-derecho").attr("width", 50).attr("height", 5).attr("x", d => x(d.serie) + 50 + 3 * d.aventuras).attr("y", 90 + 5 + 5).attr("fill", "yellow"); // Tejuelas


        // Eventos
        
        g.selectAll(".libro-izquierdo, .libro-medio, .libro-derecho").on("mouseover", function (event, d) {
            
            // console.log("Mouse over: ", d);
            // console.log("Serie Name: ", d.serie);
            d3.select("#detailName").text(d.serie);
            d3.select("#detailCaps").text(d.cantidad_caps);
            d3.select("#detailAventuras").text(d.aventuras);
            d3.select("#detailPersRecurrent").text(d.personajes_recurrentes);
            d3.select("#detailPersExtras").text(d.personajes_extras);
            d3.select("#detailPersManga").text(d.manga);
        })

        /* 
        Cada vez que se haga click en un conjunto de libros. Debes llamar a
        preprocesarPersonajes(serie, false) donde "serie" 
        corresponde al nombre de la serie presionada.
        */

        g.selectAll(".libro-izquierdo, .libro-medio, .libro-derecho").on("click", function (event, d) {
            console.log("Click: ", d.serie);
            preprocesarPersonajes(d.serie, false);

            // https://developer.mozilla.org/es/docs/Web/API/Window/scrollBy
            window.scrollBy({
                top: 300,
                behavior: 'smooth'
            });
        })
    
        /*
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
