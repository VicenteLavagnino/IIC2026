console.log("Cargando vis2.js");

const WIDTH2 = 1000;
const HEIGHT2 = 800;
const MARGIN = { top: 20, right: 30, bottom: 100, left: 50 };

const svg2 = d3.select("#bar-chart")
    .append("svg")
    .attr("width", WIDTH2 + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT2 + MARGIN.top + MARGIN.bottom)
    .append("g")
    .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

// https://using-d3js.com/03_01_d3_fetch.html y https://stackoverflow.com/questions/27420887/d3-replacing-semicolon-with-comma, luego se utilizó sugerencia de copilot para reemplazar comas por puntos
Promise.all([
    d3.dsv(";", "data/pobreza_ingreso.csv"),
    d3.dsv(";", "data/sucursales.csv")
]).then(function([data1, data2]) {
    console.log("Datos cargados correctamente");
    console.log("Data 1:", data1);
    console.log("Data 2:", data2);

    const columnas1 = Object.keys(data1[0]);
    const columnas2 = Object.keys(data2[0]);

    const processedData1 = data1.map(d => {
        const pobreza = parseFloat(d[columnas1[2]].replace(",", "."));
        return {
            comuna: d[columnas1[1]].trim().toLowerCase(),
            region: d[columnas1[0]].trim(),
            pobreza: isNaN(pobreza) ? 0 : pobreza
        };
    });

    const processedData2 = data2.map(d => {
        const totalSucursales = columnas2.slice(2).reduce((acc, key) => {
            const valor = parseFloat(d[key].replace(",", "."));
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        return {
            comuna: d[columnas2[1]].trim().toLowerCase(),
            region: d[columnas2[0]].trim(),
            sucursales: totalSucursales
        };
    });

    const combinedData = processedData1.map(d => {
        const match = processedData2.find(e => e.comuna === d.comuna && e.region === d.region);
        return {
            comuna: d.comuna,
            region: d.region,
            pobreza: d.pobreza * 100,
            sucursales: match ? match.sucursales : 0
        };
    });

    console.log("Datos combinados:", combinedData);

    const regions = Array.from(new Set(combinedData.map(d => d.region)));

    const selector = d3.select("#region-selector");
    selector.selectAll("option")
        .data(regions)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    function update(region) {
        const data = combinedData.filter(d => d.region === region);
        console.log("Datos para la región", region, ":", data);

        const x = d3.scaleBand()
            .domain(data.map(d => d.comuna))
            .range([0, WIDTH2])
            .padding(0.1);

        const yMax = Math.max(d3.max(data, d => d.pobreza), d3.max(data, d => d.sucursales));
        const y = d3.scaleLinear()
            .domain([-yMax, yMax])
            .range([HEIGHT2, 0]);

        const color = d3.scaleOrdinal()
            .domain(['pobreza', 'sucursales'])
            .range(['#6b486b', '#ff8c00']);

        svg2.selectAll("*").remove();

        const bars = svg2.selectAll(".bar-group")
            .data(data)
            .enter().append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(${x(d.comuna)},0)`);

        bars.append("rect")
            .attr("class", "bar pobreza")
            .attr("x", 0)
            .attr("width", x.bandwidth() / 2)
            .attr("fill", color('pobreza'))
            .attr("y", HEIGHT2 / 2)
            .transition()
            .duration(500)
            .attr("height", d => y(0) - y(d.pobreza));

        bars.append("rect")
            .attr("class", "bar sucursales")
            .attr("x", 0)
            .attr("y", d => y(d.sucursales))
            .attr("width", x.bandwidth() / 2)
            .attr("fill", color('sucursales'))
            .transition()
            .duration(500)
            .attr("height", d => HEIGHT2 / 2 - y(d.sucursales));

        bars.append("title")
            .text(d => `${d.comuna}\nPobreza: ${d.pobreza.toFixed(2)}%\nSucursales: ${d.sucursales}`);

        svg2.append("g").call(d3.axisLeft(y).tickFormat(d => Math.abs(d)));

        svg2.append("g")
            .attr("transform", `translate(0,${HEIGHT2 / 2})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        const legend = svg2.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${WIDTH2 - 200}, ${HEIGHT2 - 100})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color('pobreza'));

        legend.append("text")
            .attr("x", 24)
            .attr("y", 15)
            .text("Pobreza (%)")
            .style("fill", 'White');

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 24)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color('sucursales'));

        legend.append("text")
            .attr("x", 24)
            .attr("y", 40)
            .text("Cantidad de Sucursales")
            .style("fill", 'White');
    }

    selector.on("change", function() {
        const region = d3.select(this).property("value");
        update(region);
    });

    update(regions[0]);
}).catch(function(error) {
    console.error("Error al cargar los datos:", error);
});
