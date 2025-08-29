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

        const tdSize = document.querySelector('td');
        this.sizeShip = tdSize.getBoundingClientRect();

//..........create..ships..and..give..properties.........
        for (let i = 0; i < arrShipsLength.length; i++) {
            const divShip = document.createElement("div");

            divShip.classList.add('ship-box-draggable')
            divShip.setAttribute("data-length", arrShipsLength[i])
            divShip.setAttribute("draggable", "true")
            divShip.setAttribute("data-id", this.generateShipId())
            divShip.setAttribute("position", this.setRandomVertical(divShip))
            divShip.style.left = "20px";
            divShip.style.top = "20px";
            this.setPositionShip(divShip);

            ships.push(divShip);
            zoneWithShips.appendChild(divShip)
        }
        return ships;
    }

    generateShipId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    setRandomVertical(ship) {
        return Math.random() < 0.5 ? "h" : "v";
    }

    setPositionShip(ship) {
        const vertical = ship.getAttribute("position");
        const shipHeight = this.sizeShip.height
        const shipWidth = this.sizeShip.width
        const lengthShip = Number(ship.getAttribute("data-length"))

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


    moveShip() {
        const ships = document.querySelectorAll('.ship-box-draggable');
        const dropZones = document.querySelectorAll('.battle-content');

        const cellSize = 50;
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

                dragged = null;
                ship.style.visibility = "visible";
            })


            ship.addEventListener("click", (e) => {
                const oldX = ship.closest(".battle-content").getAttribute("data-x")
                const oldY = ship.closest(".battle-content").getAttribute("data-y")
                this.getOldElems(ship, oldX, oldY, e.target.getAttribute("position"));

                this.checkPositionShip(ship)
                this.setPositionShip(ship)

                this.getBusyElems(e.target)

            })
        })


        dropZones.forEach((dropZone, colIndex) => {

            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault()

                const draggable = document.querySelector(".draggable")
                dropZone.appendChild(draggable)

                this.canMove(dragged, dropZone,grabOffsetX, grabOffsetY, cellSize )
                console.log(dropZone)
            })

            dropZone.addEventListener("click", (e) => {
                console.log(dropZone.getBoundingClientRect())

            })

            dropZone.addEventListener("drop", (e) => {
                e.preventDefault()
                const oldX = e.dataTransfer.getData("data-x")
                const oldY = e.dataTransfer.getData("data-y")

                this.getOldElems(dragged, oldX, oldY, dragged.getAttribute("position"));

                this.grabEdgeElems(dragged, dropZone, colIndex, grabOffsetX, grabOffsetY, cellSize)

            })
        })
    }


    getBusyElems(ship) {
        const x = Number(ship.parentElement.getAttribute("data-x"));
        const y = Number(ship.parentElement.getAttribute("data-y"));
        let lengthShip = Number(ship.getAttribute("data-length"))
        const vertical = ship.getAttribute("position");
        const cell = "battlefield-cell"

        switch (vertical) {
            case "h": {

                lengthShip += x

                for (let i = x; i < lengthShip; i++) {
                    const busyElem = document.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
                    busyElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-empty')
                    busyElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-busy')
                }
            }
                break
            case "v": {

                lengthShip += y

                for (let i = y; i < lengthShip; i++) {
                    const busyElem = document.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
                    busyElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-empty')
                    busyElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-busy')
                }
            }
        }
        return ship
    }

    getOldElems(ship, oldX, oldY, vertical) {
        if (!oldX && !oldY) return
        const x = ship.getAttribute("data-x");
        const y = ship.getAttribute("data-y");

        const currentPosition = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        const cell = "battlefield-cell"

        switch (vertical) {
            case "h": {
                const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
                for (let i = +oldX; i < oldLength; i++) {
                    const oldElem = document.querySelector(`[data-x="${[i]}"][data-y="${+oldY}"]`)

                    if (oldElem !== currentPosition) {
                        oldElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-busy')
                        oldElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-empty')
                    }
                }
            }
                break

            case "v": {
                const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
                for (let i = +oldY; i < oldLength; i++) {
                    const oldElem = document.querySelector(`[data-x="${+oldX}"][data-y="${[i]}"]`)

                    if (oldElem !== currentPosition) {
                        oldElem.closest(`[class^="${cell}"]`).classList.remove('battlefield-cell-busy')
                        oldElem.closest(`[class^="${cell}"]`).classList.add('battlefield-cell-empty')
                    }
                }
            }
        }
    }

    grabEdgeElems(dragged, dropZone, colIndex, grabOffsetX, grabOffsetY, cellSize) {
        if (!dragged) return;

        const mouseCol = colIndex;
        const row = dropZone;
        const rowX = Number(row.getAttribute("data-x"));
        const rowY = Number(row.getAttribute("data-y"));

        switch (dragged.getAttribute("position")) {
            case "h": {
                const grabOffsetColsX = Math.floor(grabOffsetX / cellSize);
                const diffHorizontal = rowX - grabOffsetColsX;
                const leftestElem = document.querySelector(
                    `[data-x="${diffHorizontal}"][data-y="${rowY}"]`
                );
                leftestElem.appendChild(dragged);
                break;
            }
            case "v": {
                const grabOffsetColsY = Math.floor(grabOffsetY / cellSize);
                const diffVertical = rowY - grabOffsetColsY;
                const hightestElem = document.querySelector(
                    `[data-x="${rowX}"][data-y="${diffVertical}"]`
                );
                hightestElem.appendChild(dragged);
                break;
            }
        }

        this.getBusyElems(dragged);

        const rect = dropZone.getBoundingClientRect();

        dragged.style.position = "absolute";
        dragged.style.left = (rect.left - rect.left) + "px";
        dragged.style.top = "0px";
        dragged.style.visibility = "visible";

        return null;
    }


    canMove(ship, dropZone, grabOffsetX, grabOffsetY, cellSize) {
        const lengthShip = ship.getAttribute("data-length");
        const position = ship.getAttribute("position");
        const row = dropZone;
        const rowX = Number(row.getAttribute("data-x"));
        const rowY = Number(row.getAttribute("data-y"));
        switch (position) {
            case "h":
                const grabOffsetColsX = Math.floor(grabOffsetX / cellSize) + 1;
                const diffHorizontal = rowX - grabOffsetColsX;
                console.log(grabOffsetColsX)
                break
            case "v":

        }
    }
}


const createField = new TableField()
const appendShips = new Ship()
const firstShip = createField.createTableField(field1)


appendShips.createShips(firstShip)
appendShips.moveShip()


// class Battle {
//
//
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