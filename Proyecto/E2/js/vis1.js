console.log("Cargando vis1.js");

const WIDTH = 400;
const HEIGHT = 700;

const svg = d3.select("#map")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .call(d3.zoom().on("zoom", function(event) {
        svg.attr("transform", event.transform);
    }))
    .append("g");

const projection = d3.geoMercator()
    .scale(600)
    .center([-70, -45])
    .translate([WIDTH / 2, HEIGHT / 2]);

const path = d3.geoPath().projection(projection);

const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 0.3]);

function cargarMapa() {
    const geojsonPaths = [
        "data/Comunas/R01.geojson",
        "data/Comunas/R02.geojson",
        "data/Comunas/R03.geojson",
        "data/Comunas/R04.geojson",
        "data/Comunas/R05.geojson",
        "data/Comunas/R06.geojson",
        "data/Comunas/R07.geojson",
        "data/Comunas/R08.geojson",
        "data/Comunas/R09.geojson",
        "data/Comunas/R10.geojson",
        "data/Comunas/R11.geojson",
        "data/Comunas/R12.geojson",
        "data/Comunas/R13.geojson",
        "data/Comunas/R14.geojson",
        "data/Comunas/R15.geojson",
        "data/Comunas/R16.geojson"
    ];

    let combinedGeojson = { type: "FeatureCollection", features: [] };
    let loaded = 0;

    geojsonPaths.forEach(function(path) {
        d3.json(path).then(function(geojson) {
            combinedGeojson.features = combinedGeojson.features.concat(geojson.features);
            loaded++;
            if (loaded === geojsonPaths.length) {
                cargarDatosPobreza(combinedGeojson);
            }
        }).catch(function(error) {
            console.error("Error al cargar los datos del GeoJSON: ", error);
        });
    });
}

function cargarDatosPobreza(geojson) {
    d3.dsv(";", "data/pobreza_ingreso.csv").then(function(data) {
        console.log("Datos de pobreza cargados correctamente");
        console.log(data);

        const processedData = data.map(function(d) {
            return {
                comuna: d.Comuna.trim().toLowerCase(),
                pobreza: parseFloat(d["Pobreza Ingreso"].replace(',', '.')) || 0
            };
        });

        const pobrezaPorComuna = new Map(processedData.map(function(d) {
            return [d.comuna, d.pobreza];
        }));

        svg.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "#ccc")
            .attr("stroke", "#fdfdfd")
            .attr("stroke-width", 0.05)
            .on("click", function(event, d) {
                const comuna = d.properties.NOM_COMUNA.trim().toLowerCase();
                const pobreza = pobrezaPorComuna.get(comuna);
                mostrarDetalles(d.properties.NOM_COMUNA.trim(), pobreza);
            })
            .transition()
            .duration(1000)
            .attr("fill", function(d) {
                const comuna = d.properties.NOM_COMUNA.trim().toLowerCase();
                const pobreza = pobrezaPorComuna.get(comuna);
                return pobreza !== undefined ? colorScale(pobreza) : "#ccc";
            })
            .append("title")
            .text(function(d) {
                const comuna = d.properties.NOM_COMUNA.trim().toLowerCase();
                const pobreza = pobrezaPorComuna.get(comuna);
                return `${d.properties.NOM_COMUNA}: ${pobreza !== undefined ? (pobreza * 100).toFixed(2) + "%" : "Sin datos"}`;
            });

        console.log("Mapa renderizado correctamente");
    }).catch(function(error) {
        console.error("Error al cargar los datos de pobreza: ", error);
    });
}

// se pregunto a chatgpt como hacerlo para Object.entries(sucursalesData)..., sin hacer for loop

function mostrarDetalles(comuna, pobreza) {
    d3.dsv(";", "data/sucursales.csv").then(function(data) {
        const sucursalesData = data.find(function(d) {
            return d.Comuna.trim().toLowerCase() === comuna.toLowerCase();
        });

        console.log("Datos de la comuna: ", comuna);
        console.log("Datos de sucursales: ", sucursalesData);

        let detallesHTML = `<h4>Comuna: ${comuna}</h4>`;
        if (pobreza !== undefined) {
            detallesHTML += `<p>Pobreza: ${(pobreza * 100).toFixed(2)}%</p>`;
        } else {
            detallesHTML += `<p>Pobreza: Sin datos</p>`;
        }

        if (sucursalesData) {
            detallesHTML += `<h4>Sucursales Bancarias: ${sucursalesData.Total}</h4><ul>`;
            detallesHTML += Object.entries(sucursalesData)
                .filter(([key, value]) => key !== "Region" && key !== "Comuna" && key !== "Total")
                .map(([key, value]) => `<li>${key}: ${value}</li>`)
                .join("");
            detallesHTML += `</ul>`;
        } else {
            detallesHTML += `<p>No hay datos de sucursales para la comuna seleccionada.</p>`;
        }
        document.getElementById("comuna-details").innerHTML = detallesHTML;
    }).catch(function(error) {
        console.error("Error al cargar los datos de sucursales: ", error);
    });
}

cargarMapa();
