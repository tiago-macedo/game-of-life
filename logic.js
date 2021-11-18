// Constants
CELL_SIZE = 10

// Getting the fixed elements
const field        = document.getElementById("field")
const width_input  = document.getElementById("width")
const height_input = document.getElementById("height")

// Setup field of cells upon page load
reload();

function cell() {
    const c = document.createElement("div")
    c.classList.add("cell")
    c.addEventListener("mouseover", turn_on)
    return c
}

function turn_on(event) {
    event.target.setAttribute('style', "background-color: black")
}

function turn_off(event) {
    event.setAttribute('style', "background-color: white")
}

function reload() {
    field.textContent = ''

    const width  = width_input.value
    const height = height_input.value
    const field_style = `
        display: grid;
        grid-template-columns: ${"auto ".repeat(width)};
        grid-template-rows: ${"auto ".repeat(height)};
    `
    field.setAttribute('style', field_style)

    const cell_amount = width * height
    for (let i=0; i<cell_amount; i++) {
        c = cell()
        field.appendChild(c)
    }
}