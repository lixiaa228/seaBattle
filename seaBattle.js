console.log("zalupa")


//...........get.elements...............
const field1 = document.querySelector('.field1')
const field2 = document.querySelector('.field2')


class TableField {
    createTableField(filedShip) {
        //............create...table...........................................
        this.table = document.createElement("table");


        //..thead(bot.and.left)................................................
        const thead = document.createElement("thead");
        const trForThead = document.createElement("tr");
        const arrWithLetters = [" ", "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К",];


        for (let i = 0; i < arrWithLetters.length; i++) {
            const th = document.createElement("th");
            th.setAttribute("scope", "col");
            th.textContent = arrWithLetters[i];
            trForThead.appendChild(th);
        }
        thead.appendChild(trForThead);


        //..tbody..
        const tbody = document.createElement("tbody")


        for (let i = 0; i < 10; i++) {
            const tr = document.createElement('tr')
            const th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.textContent = [i + 1]


            for (let j = 0; j < 10; j++) {

                const td = document.createElement('td')
                td.classList.add('battlefield-cell');
                td.classList.add('battlefield-cell-empty');

                const div = document.createElement('div')
                div.classList.add('battle-content')
                div.setAttribute("data-x", [j])
                div.setAttribute("data-y", [i])

                this.span = document.createElement("span");
                this.span.classList.add('z');

                // this.span.setAttribute("draggable", "true");

//..........insert..elements.......
                td.appendChild(div)
                div.appendChild(this.span);
                tr.prepend(th);
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }
        this.table.appendChild(thead)
        this.table.appendChild(tbody)
        filedShip.appendChild(this.table)
        return this.table
    }
}


class Ship {

    createShips(playField) {
        const zoneWithShips = document.querySelector('.zoneWithShips')
        const arrShipsLength = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
        const ships = [];

        const tdSize = playField.querySelector('td');
        this.sizeShip = tdSize.getBoundingClientRect();

//..........create..ships..and..give..properties.........
        for (let i = 0; i < arrShipsLength.length; i++) {
            const divShip = document.createElement("div");

            divShip.classList.add('ship-box-draggable')
            divShip.setAttribute("data-length", arrShipsLength[i])
            divShip.setAttribute("draggable", "true")
            divShip.setAttribute("data-id", this.generateShipId())
            // divShip.setAttribute("position", this.setRandomVertical(divShip))
            divShip.setAttribute("position", "h")

            // divShip.style.left = "20px";
            // divShip.style.top = "20px";
            ships.push(divShip);
            zoneWithShips.appendChild(divShip)
            this.setPositionShip(divShip);


        }
        const shipPosition = {
            4: {
                left: "20px",
                top: "30px"
            },
            3: {
                left: "20px",
                top: "110px"
            },
            2: {
                left: "20px",
                top: "190px"
            },
            1: {
                left: "20px",
                top: "270px"
            }
        }

        const elems = document.querySelectorAll("[data-length]");
        elems.forEach(elem => {
            const key = elem.getAttribute("data-length");
            if (shipPosition[key]) {
                const props = shipPosition[key];

                for (let prop in props) {
                    if (prop === "left") {
                        elem.style.left = props[prop];
                    }
                    if (prop === "top") {
                        elem.style.top = props[prop];
                    }
                }
            }
        })

        return ships;
    }

    generateShipId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    setRandomVertical(ship) {
        return Math.random() < 0.5 ? "h" : "v";
    }

    setPositionShip(ship) {
        const shipHeight = this.sizeShip.height
        const shipWidth = this.sizeShip.width
        const {position: vertical, lengthShip} = this.getElementData(ship, ["position", "lengthShip"]);

        switch (vertical) {

            case "h":
                ship.style.width = ((shipWidth * lengthShip) - 2) + 'px'
                ship.style.height = (shipHeight - 2) + 'px'
                break;

            case "v":
                ship.style.height = ((shipHeight * lengthShip) - 2) + 'px'
                ship.style.width = (shipWidth - 2) + 'px'

        }
        return vertical
    }

    checkPositionShip(ship) {

        if (ship.getAttribute("position") === "h") {
            ship.setAttribute("position", "v")
        } else {
            ship.setAttribute("position", "h")
        }
    }

    moveShip(field) {
        const zoneWithShips = document.querySelector('.zoneWithShips')
        const ships = zoneWithShips.querySelectorAll('.ship-box-draggable');
        const dropZones = field.querySelectorAll('.battle-content');


        this.cellSize = 50;
        let dragged = null;
        let grabOffsetY = 0;
        let grabOffsetX = 0;

        //...............drag..and..drop................................
        ships.forEach(ship => {
            ship.addEventListener("dragstart", (e) => {
                ship.classList.add('draggable')

                if (e.target.closest(".battle-content")) {
                    e.dataTransfer.setData("data-x", e.target.closest(".battle-content").getAttribute("data-x"));
                    e.dataTransfer.setData("data-y", e.target.closest(".battle-content").getAttribute("data-y"));
                }

                //test....................................
                dragged = ship;
                const rect = ship.getBoundingClientRect();

                grabOffsetY = e.clientY - rect.top;
                grabOffsetX = e.clientX - rect.left;

                e.dataTransfer.setDragImage(ship, grabOffsetX, grabOffsetY);
                setTimeout(() => ship.style.visibility = "hidden", 0);

            })

            ship.addEventListener("dragend", (e) => {
                ship.classList.remove('draggable')
                ship.style.visibility = "visible";
            })


            ship.addEventListener("click", (e) => {
                if (ship.parentElement.classList.contains('zoneWithShips')) return

                const oldX = ship.closest(".battle-content").getAttribute("data-x")
                const oldY = ship.closest(".battle-content").getAttribute("data-y")

                this.getOldElems(ship, oldX, oldY, ship.getAttribute("position"), field)
                this.checkPositionShip(e.target)

                const isAvailableCell = this.isAvailableCell(e.target, e.target.parentElement, field)

                const coordinates = ship.getBoundingClientRect()
                const grabOffsetYForClick = e.clientY - coordinates.top;
                const grabOffsetXForClick = e.clientX - coordinates.left;

                const canPlaceInCell = this.canPlaceInCell(e.target, e.target.parentElement, grabOffsetXForClick, grabOffsetYForClick)

                console.log(isAvailableCell, canPlaceInCell, "ПРАВЕРКА")

                //access..click..........................................
                if (!canPlaceInCell && !isAvailableCell) {
                    this.setPositionShip(e.target)
                    this.getBusyElems(e.target, field)
                } else {
                    this.checkPositionShip(ship)
                    this.getBusyElems(ship, field)

                    e.target.classList.add("shake");
                    e.target.addEventListener("animationend", function () {
                        this.classList.remove("shake");
                    }, {once: true});
                }

            })
        })

        dropZones.forEach((dropZone, colIndex) => {

            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault()
            })

            dropZone.addEventListener("drop", (e) => {
                e.preventDefault()
                if (!dragged) return;

                const oldX = e.dataTransfer.getData("data-x")
                const oldY = e.dataTransfer.getData("data-y")
                dragged.classList.remove("draggable")

                const appendShip = this.grabEdgeElems(dragged, e.currentTarget, grabOffsetX, grabOffsetY, field)
                this.getOldElems(dragged, oldX, oldY, dragged.getAttribute("position"), field);

                const isAvailableCell = this.isAvailableCell(dragged, appendShip, field)
                const canPlaceInCell = this.canPlaceInCell(dragged, e.currentTarget, grabOffsetX, grabOffsetY)
                console.log(isAvailableCell, canPlaceInCell, "ПРАВЕРКА")

                if (!canPlaceInCell && !isAvailableCell) {
                    appendShip.appendChild(dragged)
                    this.getBusyElems(dragged, field)

                } else {
                    if (dragged.parentElement.classList.contains("zoneWithShips")) return;
                    this.getBusyElems(dragged, field)

                    dragged.classList.add("shake");
                    dragged.addEventListener("animationend", function () {
                        this.classList.remove("shake");
                    }, {once: true});

                }


                dragged = null

            })
        })
    }

//correct?.....................
    isAvailableCell(ship, dropZone, field) {
        if (!ship) return
        if (!dropZone) return
        if (dropZone.parentElement.classList.contains('battlefield-cell-busy')) return true

        const {position, lengthShip} = this.getElementData(ship, ["position", "lengthShip"]);
        const {x, y} = this.getElementData(dropZone, ["x", "y"]);

        const currentCell = dropZone.closest("td");
        const currentRow = currentCell.closest("tr");

        const currentCellIndex = currentCell.cellIndex; //индекс текущего корабля
        const currentRowIndex = currentRow.rowIndex;

        const prevRow = currentRow.previousElementSibling; //предыдущий ряд
        const nextRow = currentRow.nextElementSibling; // следующий ряд
        const tbody = field.querySelector("table tbody");
        let arr = []
        const left = currentCellIndex - 1

        switch (position) {
            case "h": {

                const right = currentCellIndex + lengthShip

                if (left !== 0) arr.push(currentRow.cells[left])
                if (right !== 11) arr.push(currentRow.cells[right])

                for (let i = left; i <= right; i++) {
                    if (i === 0 || i === 11) continue;

                    if (prevRow) arr.push(prevRow.cells[i])
                    if (nextRow) arr.push(nextRow.cells[i])
                }
                break;
            }

            case "v": {
                const bellow = currentRowIndex + lengthShip - 1
                const right = currentCellIndex + 1

                if (prevRow) arr.push(prevRow.cells[currentCellIndex])
                if (tbody.rows[bellow]) arr.push(tbody.rows[bellow].cells[currentCellIndex])

                for (let i = (currentRowIndex - 2); i <= bellow; i++) {
                    if (i < 0 || i > 9) continue;

                    if (left) arr.push(tbody.rows[i].cells[left])
                    if (right) arr.push(tbody.rows[i].cells[right])
                }
                break;
            }

        }
        console.log(arr)
        const hasBusy = arr
            .filter(el => el && el.tagName === "TD") // оставляем только td
            .some(el => el.classList.contains("battlefield-cell-busy"));

        return hasBusy;
    }


    getBusyElems(ship, field) {
        const {x, y} = this.getElementData(ship.parentElement, ["x", "y"]);
        let {lengthShip, position: vertical} = this.getElementData(ship, ["lengthShip", "position"]);
        const cell = "battlefield-cell"
        let arr = []

        switch (vertical) {
            case "h": {

                lengthShip += x
                for (let i = x; i < lengthShip; i++) {
                    const busyElem = field.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
                    arr.push(busyElem)
                    busyElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-empty')
                    busyElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-busy')
                }
            }
                break
            case "v": {

                lengthShip += y
                for (let i = y; i < lengthShip; i++) {
                    const busyElem = field.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
                    arr.push(busyElem)
                    busyElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-empty')
                    busyElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-busy')
                }
            }
        }
        return arr
    }

    getOldElems(ship, oldX, oldY, vertical, field) {
        if (!oldX && !oldY) return

        const {x, y} = this.getElementData(ship, ["x", "y"]);
        const currentPosition = field.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        const cell = "battlefield-cell"

        let returnOldElems = []
        switch (vertical) {
            case "h": {
                const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
                for (let i = +oldX; i < oldLength; i++) {
                    const oldElem = field.querySelector(`[data-x="${[i]}"][data-y="${+oldY}"]`)
                    // console.log("oldElem", oldElem)
                    if (oldElem !== currentPosition) {
                        oldElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-busy')
                        oldElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-empty')
                    }
                    returnOldElems.push(oldElem)
                }
                return returnOldElems;
            }

            case "v": {
                const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
                for (let i = +oldY; i < oldLength; i++) {
                    const oldElem = field.querySelector(`[data-x="${+oldX}"][data-y="${[i]}"]`)
                    // console.log("oldElem", oldElem)
                    if (oldElem !== currentPosition) {
                        oldElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-busy')
                        oldElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-empty')
                    }
                    returnOldElems.push(oldElem)
                }
                return returnOldElems;
            }
        }
    }

    //remind that need also append dragged..............works right..mb((
    grabEdgeElems(dragged, dropZone, grabOffsetX, grabOffsetY, field) {
        if (!dragged) return;

        const {x: rowX, y: rowY} = this.getElementData(dropZone, ["x", "y"])
        const vertical = dragged.getAttribute("position")
        let grabOffsetTargetAxis
        let rowTargetAxis
        let targetElem

        switch (vertical) {
            case "h": {
                grabOffsetTargetAxis = grabOffsetX
                rowTargetAxis = rowX
                break;
            }

            case "v": {
                grabOffsetTargetAxis = grabOffsetY
                rowTargetAxis = rowY
                break;
            }
        }

        const grabOffsetColsTarget = Math.floor(grabOffsetTargetAxis / this.cellSize);
        const differenceTargetVertical = rowTargetAxis - grabOffsetColsTarget

        if (vertical === "h") {
            targetElem = field.querySelector(`[data-x="${differenceTargetVertical}"][data-y="${rowY}"]`);
        } else {
            targetElem = field.querySelector(`[data-x="${rowX}"][data-y="${differenceTargetVertical}"]`);
        }

        // this.getBusyElems(dragged);

        const rect = dropZone.getBoundingClientRect();
        dragged.style.position = "absolute";
        dragged.style.left = (rect.left - rect.left) + "px";
        dragged.style.top = "0px";
        dragged.style.visibility = "visible";

        return targetElem;
    }

//works right no
    canPlaceInCell(ship, dropZone, grabOffsetX, grabOffsetY) {
        const {lengthShip, position} = this.getElementData(ship, ["lengthShip", "position"]);
        const {x: rowX, y: rowY} = this.getElementData(dropZone, ["x", "y"]);
        let grabOffsetTarget
        let targetAxis

        switch (position) {

            case "h": {
                targetAxis = rowX
                grabOffsetTarget = grabOffsetX
                break;
            }

            case "v": {
                targetAxis = rowY
                grabOffsetTarget = grabOffsetY
                break;
            }

        }
        const grabOffsetColsTarget = Math.floor(grabOffsetTarget / this.cellSize) + 1;
        const acessCell = lengthShip - grabOffsetColsTarget

        return (acessCell + targetAxis) > 9 || ((acessCell + targetAxis) - lengthShip) < -1
    }


    getElementData(el, keys = []) {
        if (!el) return
        const allData = {
            lengthShip: Number(el.getAttribute("data-length")),
            id: el.getAttribute("data-id"),
            x: Number(el.getAttribute("data-x")),
            y: Number(el.getAttribute("data-y")),
            position: el.getAttribute("position"),
        };

        if (keys.length === 0) return allData;
        return Object.fromEntries(
            Object.entries(allData).filter(([k]) => keys.includes(k))
        );
    }
}

class ProcessGame {
    constructor(field1Ships, field2Ships) {
        this.field1Ships = field1Ships
        this.field2Ships = field2Ships
    }

    create2EmptyFields() {
        const fieldPlayer = new TableField()
        fieldPlayer.createTableField(document.querySelector('.activeFieldPlayer1'))
        fieldPlayer.createTableField(document.querySelector('.activeFieldPlayer2'))

        document.querySelector('.activeField-Player1 .text-ownerField').textContent = "Field player 1"
        document.querySelector('.activeField-Player2 .text-ownerField').textContent = "Field player 2"
    }

    queuePlayers() {

    }

}



class StartGame {
    constructor() {
        this.buttonReady = document.querySelector("#buttonReady")
        this.buttonStartGame = document.querySelector("#buttonStartGame")
        this.errorText = document.querySelector(".error-text-empty-field")

        this.firstPlayerReady = false;
        this.secondPlayerReady = false;


        this.field1Ships = {}
        this.field2Ships = {}
    }

    firstPlayer() {
        const newField = new TableField()
        const firstGameField = newField.createTableField(field1)
        const ships = new Ship()
        ships.createShips(firstGameField)
        ships.moveShip(field1)
    }

    readyButtonEvent() {
        this.buttonReady.addEventListener("click", (e) => {
            const busyShipsPlayer1 = field1.querySelectorAll(".battlefield-cell-busy")
            if (busyShipsPlayer1.length === 20) {

                const ships = field1.querySelectorAll(".ship-box-draggable")
                console.log(ships)
                ships.forEach(ship => {
                    this.field1Ships[ship.getAttribute("data-id")] = ship.getAttribute("data-length")

                })
                this.field1Ships['busyShipsPlayer1'] = busyShipsPlayer1

                console.log(this.field1Ships)
                this.firstPlayerReady = true;
                this.nextIfFlagTrue()

            } else {
                this.errorFillAllFields()
            }
        })
    }

    nextIfFlagTrue() {
        if (this.firstPlayerReady) {
            this.secondPlayer();
        }
    }

    secondPlayer() {
        this.buttonStartGame.hidden = false
        this.buttonReady.hidden = true
        field1.hidden = true
        field1.style.pointerEvents = "none";
        this.errorText.hidden = true

        const newField = new TableField()
        const secondGameField = newField.createTableField(field2)
        const ships = new Ship()
        ships.createShips(secondGameField)
        ships.moveShip(field2)

    }

    errorFillAllFields() {
        this.errorText.textContent = "Firstly fill all ships!"
        this.errorText.classList.add("shake");
        this.errorText.addEventListener("animationend", function () {
            this.classList.remove("shake");
        }, {once: true});
    }

    startGameButtonEvent() {
        this.buttonStartGame.addEventListener("click", (e) => {
            const busyShipsPlayer2 = field2.querySelectorAll(".battlefield-cell-busy")
            if (busyShipsPlayer2.length === 20) {
                const ships = field2.querySelectorAll(".ship-box-draggable")
                ships.forEach(ship => {
                    this.field2Ships[ship.getAttribute("data-id")] = ship.getAttribute("data-length")

                })
                this.field2Ships['busyShipsPlayer2'] = busyShipsPlayer2
                console.log(this.field2Ships)
                this.secondPlayerReady = true;
                field2.hidden = true
                const zoneWithShips = document.querySelector('.zoneWithShips')
                zoneWithShips.hidden = true
                zoneWithShips.remove()
                this.buttonStartGame.hidden = true

                const startGame = new ProcessGame(this.field1Ships, this.field2Ships)
                startGame.create2EmptyFields()


            } else {
                this.errorFillAllFields()
            }
        })
    }
}



const start = new StartGame();
start.firstPlayer()
start.readyButtonEvent()
start.startGameButtonEvent()


// const createField = new TableField()
//
// const firstPlayer = createField.createTableField(field1)
// const appendShips = new Ship()
// appendShips.createShips(firstPlayer)
// appendShips.moveShip()
//
// const firstPlayerReady = new StartGame(firstPlayer)
// firstPlayerReady.readyButtonEvent()
// firstPlayerReady.startGame()
//


// const sdsd = this.grabEdgeElems(dragged, dropZone, grabOffsetX, grabOffsetY)
// const allowPaste = this.allowPaste(dragged, sdsd)
// console.log(allowPaste, "allowPaste")
//
// const checkAllow = this.getAcessAppend(dragged, dropZone, grabOffsetX, grabOffsetY)
// console.log(checkAllow, "checkAllow")
// const whereReturn = this.getOldElems(dragged, oldX, oldY, dragged.getAttribute("position"))


// allowPaste.forEach(el => {
//     if (el.classList.contains('battlefield-cell-busy')) {
//         const target = whereReturn?.[0] ?? document.querySelector('.zoneWithShips')
//         target.appendChild(dragged)
//
//         dragged.classList.add("shake");
//         if (dragged.classList.contains("shake")) {
//             dragged.addEventListener("animationend", function () {
//                 this.classList.remove("shake");
//             }, {once: true});
//         }
//     }
// })
// allowPaste.forEach(el => {
//     if (el.classList.contains('battlefield-cell-busy')) {
//         const target = whereReturn?.[0] ?? document.querySelector('.zoneWithShips')
//         target.appendChild(dragged)
//     }
// })

// if (checkAllow) {
//     const target = whereReturn?.[0] ?? document.querySelector('.zoneWithShips')
//     target.appendChild(dragged)
//     this.getBusyElems(dragged)
//
//     dragged.classList.add("shake");
//     if (dragged.classList.contains("shake")) {
//         dragged.addEventListener("animationend", function () {
//             this.classList.remove("shake");
//         }, {once: true});
//     }
// }
//
//     else if (allowPaste) {
//         const target = whereReturn?.[0] ?? document.querySelector('.zoneWithShips')
//         target.appendChild(dragged)
//         this.getBusyElems(dragged)
//
//         dragged.classList.add("shake");
//         if (dragged.classList.contains("shake")) {
//             dragged.addEventListener("animationend", function () {
//                 this.classList.remove("shake");
//             }, {once: true});
//         }
//     }

// if (checkAllow || allowPaste) {
//     const target = whereReturn?.[0] ?? document.querySelector('.zoneWithShips');
//     target.appendChild(dragged);
//     this.getBusyElems(dragged)
//
//     dragged.classList.add("shake");
//     dragged.addEventListener("animationend", function () {
//         this.classList.remove("shake");
//     }, {once: true});
// } else {

// case "h": {
//     const grabOffsetColsX = Math.floor(grabOffsetX / this.cellSize) + 1;
//     const acessCell = lengthShip - grabOffsetColsX
//     if ((acessCell + rowX) > 9 || ((acessCell + rowX) - lengthShip) < -1) {
//
//         return true
//     } else {
//         return false
//     }
// }
//
// case "v": {
//     const grabOffsetColsY = Math.floor(grabOffsetY / this.cellSize) + 1;
//     const acessCell = lengthShip - grabOffsetColsY
//     if ((acessCell + rowY) > 9 || ((acessCell + rowY) - lengthShip) < -1) {
//         return true
//     } else {
//         return false
//     }
// }

// switchBusyEmptyFields(ship, oldX, oldY) {
//     const x = Number(ship.parentElement.getAttribute("data-x"));
//     const y = Number(ship.parentElement.getAttribute("data-y"));
//     const currentPosition = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
//     let lengthShip = Number(ship.getAttribute("data-length"))
//     const vertical = ship.getAttribute("position");
//     const cellBusy = "battlefield-cell-busy"
//     const cellEmpty = "battlefield-cell-empty"
//     const cell = "battlefield-cell"
//     switch (vertical) {
//         case "h": {
//             lengthShip += x
//
//             for (let i = x; i < lengthShip; i++) {
//                 const busyElem = document.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
//
//                 // busyElem.closest(`[class^="${cell}"]`).classList.remove(`${cellEmpty}`)
//                 // busyElem.closest(`[class^="${cell}"]`).classList.add(`${cellBusy}`)
//
//             }
//
//             if (oldX && oldY !== "") {
//                 const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
//                 for (let i = +oldX; i < oldLength; i++) {
//                     const oldElem = document.querySelector(`[data-x="${[i]}"][data-y="${oldY}"]`)
//                     // oldElem.closest(`[class^="${cell}"]`).classList.remove(`${cellBusy}`)
//                     // oldElem.closest(`[class^="${cell}"]`).classList.add(`${cellEmpty}`)
//
//
//                 }
//             }
//             break
//         }
//
//         case "v": {
//             lengthShip += y
//
//             for (let i = y; i < lengthShip; i++) {
//                 const busyElem = document.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
//                 // busyElem.closest(`[class^="${cell}"]`).classList.remove(`${cellEmpty}`)
//                 // busyElem.closest(`[class^="${cell}"]`).classList.add(`${cellBusy}`)
//             }
//
//             if (oldX && oldY !== "") {
//                 const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
//                 for (let i = +oldY; i < oldLength; i++) {
//                     const oldElem = document.querySelector(`[data-x="${+oldX}"][data-y="${[i]}"]`)
//                     // oldElem.closest(`[class^="${cell}"]`).classList.remove(`${cellBusy}`)
//                     // oldElem.closest(`[class^="${cell}"]`).classList.add(`${cellEmpty}`)
//                 }
//             }
//         }
//     }
// }

// getBusyShips(busyField, shipBox)
// {
//     const x = Number(busyField.getAttribute("data-x"))
//     const y = Number(busyField.getAttribute("data-y"))
//     const lengthShip = Number(shipBox.getAttribute("data-length"))
//
//     console.log("busyField", busyField)
//     switch (shipBox.getAttribute("position")) {
//
//         case "h":
//
//             const sumHorizontal = x + lengthShip
//             for (let i = x; i < sumHorizontal; i++) {
//                 document.querySelector(`[data-x="${i}"][data-y="${y}"]`).parentNode.classList.remove('battlefield-cell-empty')
//                 document.querySelector(`[data-x="${i}"][data-y="${y}"]`).parentNode.classList.add('battlefield-cell-busy')
//             }
//             break;
//
//         case "v":
//
//             const sumVertical = y + lengthShip
//             for (let i = y; i < sumVertical; i++) {
//                 document.querySelector(`[data-x="${i}"][data-y="${y}"]`).parentNode.classList.remove('battlefield-cell-empty')
//                 document.querySelector(`[data-x="${i}"][data-y="${y}"]`).parentNode.classList.add('battlefield-cell-busy')
//             }
//     }
// }

// if (checkAllow) {
//     this.checkPositionShip(ship)
//     whereReturn[0].appendChild(ship)
//     this.setPositionShip(ship)
//     this.getBusyElems(e.target)
//
//     ship.classList.add("shake");
//     ship.addEventListener("animationend", () => {
//         ship.classList.remove("shake");
//     }, {once: true});
//
// }

// calculatePosition(ship)
// {
//     const positionX = ship.parentElement.getAttribute("data-x")
//     const positionY = ship.parentElement.getAttribute("data-y")
//     const lengthShip = ship.getAttribute("data-length")
//
//     return (Number(positionX) + Number(lengthShip) < 11)
//
// }


// const secondShip = createField.createTableField(field2)
// const fpdfd = {
//     sdsd: {
//             x: 0,
//             y : 0
//
//     },
//     sasa: {
//         x: 0,
//         y : 0
//
//     },
//     fdfd: {
//         x: 0,
//         y : 0
//
//     },
// }
// console.log(Object.values(fpdfd))


// console.log("data-x", ship.parentElement.getAttribute("data-x"));
// console.log("data-y", ship.parentElement.getAttribute("data-y"));
// console.log("data-length", ship.getAttribute("data-length"));
// const positionX = ship.parentElement.getAttribute("data-x")
// const positionY = ship.parentElement.getAttribute("data-y")
// const lengthShip = ship.getAttribute("data-length")
//
// if (Number(positionX) + Number(lengthShip) > 11) {
//     e.preventDefault()
// }
// e.preventDefault()
// console.log("i am in ", e.target.parentNode)
//                 // console.log("my parent", dropZone.parentNode) //empty
//                 // console.log(e.target) //ship
// this.getBusyShips(dropZone, e.target)

//        switch (vertical) {
//             case "h": {
//
//                 lengthShip += x
//                 for (let i = x; i < lengthShip; i++) {
//
//                     const busyElem = document.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
//
//                     if (busyElem.closest('.battlefield-cell-empty')) {
//                         busyElem.closest('.battlefield-cell-empty').classList.replace('battlefield-cell-empty', 'battlefield-cell-busy')
//                     }
//                 }
//
//                 if (oldX && oldY !== "") {
//                     const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
//                     for (let i = +oldX; i < oldLength; i++) {
//
//                         const oldElem = document.querySelector(`[data-x="${[i]}"][data-y="${+oldY}"]`)
//                         console.log(oldElem)
//                         if (oldElem.closest('.battlefield-cell-busy')) {
//                             oldElem.closest('.battlefield-cell-busy').classList.replace('battlefield-cell-busy', 'battlefield-cell-empty')
//                         }
//                     }
//                 }
//                 break
//             }
//
//             case "v": {
//                 lengthShip += y
//                 for (let i = y; i < lengthShip; i++) {
//
//                     const busyElem = document.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
//                     if (busyElem.closest('.battlefield-cell-empty')) {
//                         busyElem.closest('.battlefield-cell-empty').classList.replace('battlefield-cell-empty', 'battlefield-cell-busy')
//                     }
//                 }
//
//                 if (oldX && oldY !== "") {
//                     const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
//                     for (let i = +oldY; i < oldLength; i++) {
//
//                         const oldElem = document.querySelector(`[data-x="${[+oldY]}"][data-y="${i}"]`)
//                         if (oldElem.closest('.battlefield-cell-busy')) {
//                             oldElem.closest('.battlefield-cell-busy').classList.replace('battlefield-cell-busy', 'battlefield-cell-empty')
//                         }
//                     }
//                 }
//
//
//             }
//         }

//  switch (vertical) {
//
//             case "h": {
//                 lengthShip += x
//                 for (let i = x; i < lengthShip; i++) {
//                     const busyElem = document.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
//
//                     if (busyElem.closest('.battlefield-cell-empty')) {
//                         busyElem.closest('.battlefield-cell-empty').classList.replace('battlefield-cell-empty', 'battlefield-cell-busy')
//                     }
//                 }
//
//                 if (oldX && oldY !== "") {
//                     const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
//                     for (let i = +oldY; i < oldLength; i++) {
//                         const oldElem = document.querySelector(`[data-x="${+oldX}"][data-y="${[i]}"]`)
//
//                         if (oldElem.closest('.battlefield-cell-busy') && !oldElem.closest('.battlefield-cell-busy').contains(currentPosition)) {
//                             oldElem.closest('.battlefield-cell-busy').classList.replace('battlefield-cell-busy', 'battlefield-cell-empty')
//                         }
//                     }
//                 }
//                 break
//             }
//
//             case "v": {
//                 lengthShip += y
//                 for (let i = y; i < lengthShip; i++) {
//                     const busyElem = document.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
//
//                     if (busyElem.closest('.battlefield-cell-empty')) {
//                         busyElem.closest('.battlefield-cell-empty').classList.replace('battlefield-cell-empty', 'battlefield-cell-busy')
//                     }
//                 }
//
//                 if (oldX && oldY !== "") {
//                     const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
//                     for (let i = +oldX; i < oldLength; i++) {
//                         const oldElem = document.querySelector(`[data-x="${[i]}"][data-y="${+oldY}"]`)
//
//                         if (oldElem.closest('.battlefield-cell-busy')  && !oldElem.closest('.battlefield-cell-busy').contains(currentPosition)) {
//                             console.log(oldElem.closest('.battlefield-cell-busy'))
//                             oldElem.closest('.battlefield-cell-busy').classList.replace('battlefield-cell-busy', 'battlefield-cell-empty')
//                         }
//                     }
//                 }
//             }
//         }
// const lengthShip = Number(ship.getAttribute("data-length"));
// const position = ship.getAttribute("position");
// const rowX = Number(dropZone.getAttribute("data-x"));
// const rowY = Number(dropZone.getAttribute("data-y"));

// switch (dragged.getAttribute("position")) {
//     case "h": {
//         const grabOffsetColsX = Math.floor(grabOffsetX / this.cellSize);
//         const diffHorizontal = rowX - grabOffsetColsX;
//         const leftestElem = document.querySelector(
//             `[data-x="${diffHorizontal}"][data-y="${rowY}"]`
//         );
//         // leftestElem.appendChild(dragged);
//         target = leftestElem
//         break;
//     }
//     case "v": {
//         const grabOffsetColsY = Math.floor(grabOffsetY / this.cellSize);
//         const diffVertical = rowY - grabOffsetColsY;
//         const hightestElem = document.querySelector(
//             `[data-x="${rowX}"][data-y="${diffVertical}"]`
//         );
//         // hightestElem.appendChild(dragged);
//         target = hightestElem
//         break;
//     }
// }