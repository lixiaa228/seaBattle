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
    arrWithdata = {}

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

    updateBusyShips(idShip, busyShips) {
        this.arrWithdata[idShip] = busyShips;

    }

    getData() {
        return this.arrWithdata
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

                // e.dataTransfer.setDragImage(new Image(), 0, 0);
                // setTimeout(() => {
                //     ship.style.opacity = "1";
                // }, 0);

            })

            ship.addEventListener("dragend", (e) => {
                ship.classList.remove('draggable')
                ship.style.visibility = "visible";
                // ship.style.opacity = "1";
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

                    this.updateBusyShips(e.target.getAttribute('data-id'), this.getBusyElems(e.target, field))
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
                const rect = dropZone.getBoundingClientRect();
                dragged.style.position = "absolute";
                dragged.style.left = (rect.left - rect.left) + "px";
                dragged.style.top = "0px";
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
                // console.log(isAvailableCell, canPlaceInCell, "ПРАВЕРКА")

                if (!canPlaceInCell && !isAvailableCell) {
                    appendShip.appendChild(dragged)
                    // this.getBusyElems(dragged, field)
                    this.updateBusyShips(dragged.getAttribute('data-id'), this.getBusyElems(dragged, field))


                } else {
                    if (dragged.parentElement.classList.contains("zoneWithShips")) return;
                    // this.getBusyElems(dragged, field)
                    this.updateBusyShips(dragged.getAttribute('data-id'), this.getBusyElems(dragged, field))

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
        // const {x, y} = this.getElementData(dropZone, ["x", "y"]);

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
        // console.log(arr)
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


class StartGame {
    constructor(field1Ships, field2Ships) {
        this.field1Ships = field1Ships
        this.field2Ships = field2Ships

        this.firstPlayerReady = true
        this.secondPlayerReady = false

        this.activeFieldPlayer1 = document.querySelector('.activeFieldPlayer1')
        this.activeFieldPlayer2 = document.querySelector('.activeFieldPlayer2')

        this.turns = []
    }

    create2EmptyFields() {
        const fieldPlayer = new TableField()

        fieldPlayer.createTableField(this.activeFieldPlayer1)
        fieldPlayer.createTableField(this.activeFieldPlayer2)

        document.querySelector('.activeField-Player1 .text-ownerField').textContent = "Field player 1"
        document.querySelector('.activeField-Player2 .text-ownerField').textContent = "Field player 2"

    }

    fillAroundTheEdges(hitCell) {

        const currentCell = hitCell.closest("td")
        const currentRow = currentCell.closest("tr");

        const prevRow = currentRow.previousElementSibling; //предыдущий ряд
        const nextRow = currentRow.nextElementSibling;
        const left = currentCell.cellIndex - 1
        const right = currentCell.cellIndex + 1

        let arr = []

        prevRow?.cells?.[left] && arr.push(prevRow.cells[left])

        nextRow?.cells?.[left] && arr.push(nextRow.cells[left]);

        prevRow?.cells?.[right] && arr.push(prevRow?.cells[right]);

        nextRow?.cells?.[right] && arr.push(nextRow?.cells[right]);


        return arr.filter(el => el && el.tagName === "TD")

    }

    turns(eTargetCell) {
        const x = eTargetCell.getAttribute("data-x");
        const y = eTargetCell.getAttribute("data-y");

    }

    isCellBusy(cell, arrShips) {
        const dataX = cell.getAttribute("data-x")
        const dataY = cell.getAttribute("data-y")
        let ship
        // console.log(arrShips)
        // console.log(arrShips, "arrShips") obj with all ships and busy cells

        //.........check..is..cell..busy
        //...........obj..with..id.ship..and..busy..cell........
        this.busyCell = Object.fromEntries(
            Object.entries(arrShips)
                .map(([key, arr]) => [
                    key,
                    arr.filter(elem => elem.dataset.x === dataX && elem.dataset.y === dataY)
                ])
                .filter(([key, arr]) => arr.length > 0)
        );
        console.log(this.busyCell, "busyCell")

        if (Object.keys(this.busyCell).length) {
            const key = Object.keys(this.busyCell)[0];

            if (key in arrShips) {
                console.log("Нашли:", arrShips[key]);
                const elems = arrShips[key];
                elems.forEach(elem => {
                    const child = elem.querySelector('.ship-box-draggable');
                    if (child) {
                        console.log("Прямой ребёнок:", child);
//..............ship.........
                        ship = child
                    }
                })
            }
        }
        return ship
    }

    queuePlayers(playerTable1, playerTable2) {

        this.activeFieldPlayer2.classList.add('battlefield-wait')

        playerTable1.forEach(player => {
            player.addEventListener('click', (e) => {
                if (this.firstPlayerReady) {

                    const ship = this.isCellBusy(e.target, this.field1Ships)

                    if (Object.keys(this.busyCell).length) {

                        ship.getAttribute("data-length") === "1" ? player.classList.add('battlefield-cell-done') : player.classList.add('battlefield-cell-hit')

                        const missAuto = this.fillAroundTheEdges(e.target)
                        missAuto.forEach(elem => {
                            elem.classList.add('battlefield-miss-auto')
                        })

                        this.secondPlayerReady = false
                    } else {
                        this.activeFieldPlayer1.classList.toggle('battlefield-wait')
                        this.activeFieldPlayer2.classList.toggle('battlefield-wait')

                        player.classList.add('battlefield-miss')

                        this.firstPlayerReady = false
                        this.secondPlayerReady = true
                    }

                }
            })
        })

        playerTable2.forEach(player => {
            player.addEventListener('click', (e) => {
                if (this.secondPlayerReady) {

                    const ship = this.isCellBusy(e.target, this.field2Ships)
                    if (Object.keys(this.busyCell).length) {


                        ship.getAttribute("data-length") === "1" ? player.classList.add('battlefield-cell-done') : player.classList.add('battlefield-cell-hit')

                        const missAuto = this.fillAroundTheEdges(e.target)
                        missAuto.forEach(elem => {
                            elem.classList.add('battlefield-miss-auto')
                        })

                        this.firstPlayerReady = false

                    } else {
                        this.activeFieldPlayer2.classList.toggle('battlefield-wait')
                        this.activeFieldPlayer1.classList.toggle('battlefield-wait')

                        player.classList.add('battlefield-miss')


                        this.secondPlayerReady = false
                        this.firstPlayerReady = true
                    }

                }
            })
        })
    }

    // player.classList.add('battlefield-cell-hit')
    // player.classList.add('battlefield-miss')
    // player.classList.add('battlefield-miss-auto')
    // player.classList.add('battlefield-cell-done')
    // }
}


class PrepareGame {
    constructor() {
        this.buttonReady = document.querySelector("#buttonReady")
        this.buttonStartGame = document.querySelector("#buttonStartGame")
        this.errorText = document.querySelector(".error-text-empty-field")
        this.zoneWithShips = document.querySelector('.zoneWithShips')

        this.firstPlayerReady = false;
        this.secondPlayerReady = false;

        this.field1Ships = {}
        this.field2Ships = {}
    }

    firstPlayer() {
        const newField = new TableField()
        const firstGameField = newField.createTableField(field1)
        this.shipsFirstPlayer = new Ship()
        this.shipsFirstPlayer.createShips(firstGameField)
        this.shipsFirstPlayer.moveShip(field1)
    }

    readyButtonEvent() {
        this.buttonReady.addEventListener("click", (e) => {
            const SHIPS_PER_PLAYER = 10;
            const registeredShips = this.shipsFirstPlayer.getData()

            if (Object.keys(registeredShips).length === SHIPS_PER_PLAYER) {
                this.field1Ships = {...registeredShips}
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

    ifBothFieldsReady() {
        if (this.firstPlayerReady && this.secondPlayerReady) {
            this.zoneWithShips.hidden = true
            this.zoneWithShips.remove()
            this.buttonStartGame.hidden = true
            this.errorText.hidden = true

            const startGame = new StartGame(this.field1Ships, this.field2Ships)
            startGame.create2EmptyFields()
            startGame.queuePlayers(document.querySelectorAll('.activeFieldPlayer1 td'), document.querySelectorAll('.activeFieldPlayer2 td'))
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
        this.shipsSecondPlayer = new Ship()
        this.shipsSecondPlayer.createShips(secondGameField)
        this.shipsSecondPlayer.moveShip(field2)
    }

    errorFillAllFields() {
        this.errorText.hidden = false
        this.errorText.textContent = "Firstly fill all ships!"
        this.errorText.classList.add("shake");
        this.errorText.addEventListener("animationend", function () {
            this.classList.remove("shake");
        }, {once: true});
    }

    startGameButtonEvent() {
        this.buttonStartGame.addEventListener("click", (e) => {
            const SHIPS_PER_PLAYER = 10;
            const registeredShips = this.shipsFirstPlayer.getData()

            if (Object.keys(registeredShips).length === SHIPS_PER_PLAYER) {
                this.field2Ships = {...registeredShips}

                this.secondPlayerReady = true;
                field2.hidden = true
                document.querySelector('.text-onZone').textContent = ""
                this.ifBothFieldsReady()

            } else {
                this.errorFillAllFields()
            }
        })
    }
}


const start = new PrepareGame();
start.firstPlayer()
start.readyButtonEvent()
start.startGameButtonEvent()
