// Utility functions
//--------------------
function matrix(y, x, e) {
    if (typeof e === "object") e = null
    const m = []
    for (let j=0; j<y; j++) {
        let row = []
        m.push(row)
        for (let i=0; i<x; i++) {
            m[j].push(e)
        }
    }
    return m
}

// Constants
//------------
const SELECTED_ALIVE = "DarkSlateBlue" // alive is darker
const SELECTED_DEAD  = "SteelBlue"
const NORMAL_ALIVE   = "black"
const NORMAL_DEAD    = "white"
const play_txt  = "▶️ Play"
const pause_txt = "⏸ Pause"

// Global variables
//-------------------
let cells
let width
let height
let loop_caller
let planar = true

// Getting the fixed DOM elements
//---------------------------------
const field        = document.getElementById("field")
const width_input  = document.getElementById("width")
const height_input = document.getElementById("height")
const play_pause_button = document.getElementById("play-pause")
let interval       = 0

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
function step() {
    console.log("step")
    const new_cells = []

    // First, we calculate the next states of the cells
    for (let y=0; y<height; y++) {
        new_cells.push([])
        for (let x=0; x<width; x++) {
            let pack = planar ? planar_pack(x, y) : toroidal_pack(x, y)
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

// The following 2 functions create a 3x3 grid
// of the states of the cells surrounding the
// currtent cell. It includes the state of the
// middle cell.
//
// One (planar) considers that the border cells
// are surrounded by permanently dead cells.
//
// The other(toroidal) considerds that cells at
// a border can reach through the border to the
// cells at the other side.

function planar_pack(x, y) {
    pack = matrix(3, 3, false)

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

    return pack
}

function toroidal_pack(x, y) {
    pack = matrix(3, 3, false)

    return pack
}

// Receives a matrix of (true/false) states
// of cells, returns the next state of the
// middle cell.
function update(states) {
    current = states[1][1]
    states[1][1] = false
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
    loop_caller = null
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

// Buttons
//--------------------
function play_or_pause() {
    if (!loop_caller) { // If it's not playing
        play()
    } else { // If it's playing
        pause()
    }
}

function play() {
    if (!loop_caller) loop_caller = setInterval(step, interval)
    play_pause_button.value = pause_txt
}

function pause(button) {
    if (loop_caller) clearInterval(loop_caller)
    loop_caller = null
    play_pause_button.value = play_txt
}

function set_timestep() {
    currently_playing = !!loop_caller
    if (currently_playing) pause()
    interval = Number(document.getElementById("interval").value)
    if (currently_playing) play()
}

function set_planar() {
    planar = true
}

function set_toroidal() {
    planar = false
}

function step_button() {
    step()
}

function clear_field() {
    field.childNodes.forEach((cell) => { off(cell) })    
}

function randomize() {
    field.childNodes.forEach((cell) => {
        let value = !(Math.random() - 0.5 > 0)
        // Techincally there is a slightly greater chance that the cell will
        // be off than on, but oh well...
        if (value) on(cell)
        else off(cell)
    })
}

// What to actually run when page is loaded
//-------------------------------------------
set_timestep()
reload()