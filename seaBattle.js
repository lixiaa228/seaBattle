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
                this.span.textContent = " "
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
        const vertical = Math.random() < 0.5 ? "h" : "v";
        return vertical
    }

    setPositionShip(ship) {
        const vertical = ship.getAttribute("position");
        const shipHeight = this.sizeShip.height
        const shipWidth = this.sizeShip.width
        const lengthShip = Number(ship.getAttribute("data-length"))

        switch (vertical) {

            case "h":
                ship.style.width = ((shipWidth * lengthShip) - 4) + 'px'
                ship.style.height = (shipHeight - 4) + 'px'
                break;

            case "v":
                ship.style.height = ((shipHeight * lengthShip) - 4) + 'px'
                ship.style.width = (shipWidth - 4) + 'px'

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

        ships.forEach(ship => {
            ship.addEventListener("dragstart", (e) => {
                e.dataTransfer.effectAllowed = "move";
                ship.classList.add('draggable')

                if (e.target.closest(".battle-content")) {
                    e.dataTransfer.setData("data-x", e.target.closest(".battle-content").getAttribute("data-x"));
                    e.dataTransfer.setData("data-y", e.target.closest(".battle-content").getAttribute("data-y"));
                }

            })

            ship.addEventListener("dragend", (e) => {
                ship.classList.remove('draggable')
            })

            ship.addEventListener("click", (e) => {
                this.checkPositionShip(ship)
                this.setPositionShip(ship)

                const oldX = ship.closest(".battle-content").getAttribute("data-x")
                const oldY = ship.closest(".battle-content").getAttribute("data-y")
                this.switchBusyEmptyFields(ship, oldX, oldY)

            })
        })


        dropZones.forEach((dropZone) => {
            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault()
                const draggable = document.querySelector(".draggable")
                e.dataTransfer.dropEffect = "move";
                dropZone.appendChild(draggable)
            })

            dropZone.addEventListener("drop", (e) => {
                e.preventDefault()
                // console.log(e.target) //ship
                // console.log(e.currentTarget) //content where drop

                const oldX = e.dataTransfer.getData("data-x")
                const oldY = e.dataTransfer.getData("data-y")
                this.switchBusyEmptyFields(e.target, oldX, oldY)


            })
        })
    }


    switchBusyEmptyFields(ship, oldX, oldY) {
        const x = Number(ship.parentElement.getAttribute("data-x"));
        const y = Number(ship.parentElement.getAttribute("data-y"));
        const currentPosition = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        let lengthShip = Number(ship.getAttribute("data-length"))
        const vertical = ship.getAttribute("position");

        const cellBusy = "battlefield-cell-busy"
        const cellEmpty = "battlefield-cell-empty"
        const cell = "battlefield-cell"

        switch (vertical) {

            case "h": {
                lengthShip += x
                for (let i = x; i < lengthShip; i++) {
                    const busyElem = document.querySelector(`[data-x="${[i]}"][data-y="${y}"]`)
                    //correct


                    if (busyElem.closest(`[class^="${cell}"]`)) {
                        busyElem.closest(`.${cell}`).classList.replace(`${cellEmpty}`, `${cellBusy}`)
                    }
                }

                if (oldX && oldY !== "") {
                    const oldLength = Number(ship.getAttribute("data-length")) + Number(oldY)
                    for (let i = +oldY; i < oldLength; i++) {
                        const oldElem = document.querySelector(`[data-x="${+oldX}"][data-y="${[i]}"]`)

                        if (oldElem.closest(`.${cellBusy}`)) {
                            oldElem.closest(`.${cellBusy}`).classList.replace(`${cellBusy}`, `${cellEmpty}`)
                        }
                    }
                }
                break
            }

            case "v": {
                lengthShip += y
                for (let i = y; i < lengthShip; i++) {
                    const busyElem = document.querySelector(`[data-x="${x}"][data-y="${[i]}"]`)
                    //correct


                    if (busyElem.closest(`[class^="${cellEmpty}"]`)) {
                        busyElem.closest(`.${cellEmpty}`).classList.replace(`${cellEmpty}`, `${cellBusy}`)
                    }
                }

                if (oldX && oldY !== "") {
                    const oldLength = Number(ship.getAttribute("data-length")) + Number(oldX)
                    for (let i = +oldX; i < oldLength; i++) {
                        const oldElem = document.querySelector(`[data-x="${[i]}"][data-y="${+oldY}"]`)

                        if (oldElem.closest(`.${cellBusy}`)) {

                            oldElem.closest(`.${cellBusy}`).classList.replace(`${cellBusy}`, `${cellEmpty}`)
                        }
                    }
                }
            }
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