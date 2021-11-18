// Constants
const SELECTED_ALIVE = "DarkSlateBlue" // alive is darker
const SELECTED_DEAD  = "SteelBlue"
const NORMAL_ALIVE   = "black"
const NORMAL_DEAD    = "white"

// Global variables
//-------------------
let cells
let width
let height

// Getting the fixed DOM elements
//---------------------------------
const field        = document.getElementById("field")
const width_input  = document.getElementById("width")
const height_input = document.getElementById("height")

// Cell creator
//------------------
function cell() {
    const c = document.createElement("div")
    c.classList.add("cell")
    c.active   = false // if cell is alive or dead
    c.selected = false // if mouse is currently over the cell
    // DarkSlateBlue
    c.addEventListener("mouseover", select)
    c.addEventListener("mouseout", unselect)
    c.addEventListener("click", click)
    return c
}

// Cell activation methods
//--------------------------
function select(event) {
    const cell = event.target
    color = cell.active ? SELECTED_ALIVE : SELECTED_DEAD
    cell.setAttribute("style", `background-color: ${color}`)
}

function unselect(event) {
    const cell = event.target
    color = cell.active ? NORMAL_ALIVE : NORMAL_DEAD
    cell.setAttribute("style", `background-color: ${color}`)
}

function click(event) {
    const cell = event.target
    cell.active = !cell.active
    color = cell.active ? SELECTED_ALIVE : SELECTED_DEAD
    cell.setAttribute("style", `background-color: ${color}`)
}

function on(cell) {
    cell.active = true
    cell.setAttribute("style", `background-color: ${NORMAL_ALIVE}`)
}

function off(cell) {
    cell.active = false
    cell.setAttribute("style", `background-color: ${NORMAL_DEAD}`)
}

// Main game logic
//-------------------
function grid2arr(x, y) { return height*y + x }

function arr2grid(k) {
    y = Math.floor(k / width)
    x = k % width
    return [x, y]
}

function step() {
    const new_cells = []

    // First, we calculate the next states of the cells
    for (let y=0; y<height; y++) {
        new_cells.push([])
        for (let x=0; x<width; x++) {
            // Let's create a 3x3 grid of the states
            // of the cells surrounding the currtent
            // cell. It includes the state of the
            // middle cell.
            pack = Array(3).fill(Array(3).fill(false))

            if (y > 0) { // We're not on the top row
                if (x > 0)       pack[0][0] = cells[y-1][x-1].active
                                 pack[0][1] = cells[y-1][ x ].active
                if (x < width-1) pack[0][2] = cells[y-1][x+1].active
            }
            
            if (x > 0)       pack[1][0] = cells[y][x-1].active
                             pack[1][1] = cells[y][ x ].active
            if (x < width-1) pack[1][2] = cells[y][x+1].active

            if (y < height-1) { // We're not on the bottom row
                if (x > 0)       pack[2][0] = cells[y+1][x-1].active
                                 pack[2][1] = cells[y+1][ x ].active
                if (x < width-1) pack[2][2] = cells[y+1][x+1].active
            }

            if (x == 1 && y == 1) {
                console.log(pack)
                console.log(`total: ${total}`)
            }
            new_cells[y].push(update(pack))
        }
    }

    // Then we update
    for (let y=0; y<height; y++) {
        for (let x=0; x<width; x++) {
            old_state = cells[y][x].active
            new_state = new_cells[y][x]
            if (old_state !== new_state) {
                if (new_state)
                    on(cells[y][x])
                else
                    off(cells[y][x])
            }
        }
    }
}

// Receives a matrix of (true/false) states
// of cells, returns the next state of the
// middle cell.
function update(states) {
    current = states[1][1]
    states[2][2] = false
    total = states.flat().reduce((sum, state) => sum + state, 0)
    // The rules of the game!
    if      ( current  && total  < 2 ) return false // Death by loneliness
    else if ( current  && total  > 3 ) return false // Death by overcrowding
    else if ( !current && total == 3 ) return true  // Birth
    return current                                  // Nothing happens
}

// Field setup
//--------------
function reload() {
    field.textContent = ''
    
    width  = Number(width_input.value)
    height = Number(height_input.value)
    const field_style = `
    display: grid;
    grid-template-columns: ${"auto ".repeat(width)};
    grid-template-rows: ${"auto ".repeat(height)};
    `
    field.setAttribute("style", field_style)
    
    cells = []
    for (let y=0; y<height; y++) {
        cells.push([])
        for (let x=0; x<width; x++) {
            c = cell()
            field.appendChild(c)
            cells[y].push(c)
        }
    }
}

// Button play/pause
//--------------------
function play_or_pause(event) {
    step()
}

// What to actually run when page is loaded
//-------------------------------------------
reload();