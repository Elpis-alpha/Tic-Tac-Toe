/* Tic Tac Toe by Elpis: the computer opponent.

   Three ways of choosing a square, from careless to careful. getEasyNum,
   getMedNum and getHardNum are the original game's, unchanged. choose(),
   at the bottom, is what app.js calls: it hands over the board and gets
   back a square to play. */

const ComputerCtrl = (function () {

  const randomAmong = function (a, b) {

    return (a + Math.floor(Math.random() * (b - a + 1)))

  }

  const chooseFrom = function (arr) {

    return arr[randomAmong(0, arr.length - 1)]

  }

  const getEasyNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  const getMedNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    const defs = {
      center: [4],
      edge: [1, 3, 5, 7],
      corner: [0, 2, 6, 8],
      all: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }

    // To get Two Ways
    const twWork = [

      [4, 1, 6], [4, 1, 8], [4, 5, 0], [4, 5, 6], [4, 7, 0], [4, 7, 2],
      [4, 3, 8], [4, 3, 2],
      // Center, Edge, Corner //

      [4, 0, 8, 3, 6], [4, 0, 8, 1, 2], [4, 0, 8, 5, 6], [4, 0, 8, 7, 2],
      // Center, Corner, Corner, Edge, Corner//

      [0, 1, 6, 3, 8], [0, 1, 2, 3, 4], [0, 2, 6, 3, 8], [0, 2, 8, 4, 6],
      [0, 5, 6, 3, 4], [0, 5, 2, 1, 6], [0, 5, 2, 1, 4], [0, 8, 6, 3, 2],
      [0, 8, 2, 1, 6], [0, 7, 2, 1, 4], [0, 7, 6, 3, 2], [0, 7, 6, 3, 4],
      [0, 6, 2, 1, 8], [0, 3, 6, 7, 4], [0, 3, 2, 1, 4], [0, 3, 6, 7, 4],
      [0, 3, 6, 1, 4], [0, 3, 6, 5, 4], [0, 3, 2, 1, 8],
      // Corner, Not Center //

      [2, 0, 6, 4, 8], [2, 0, 8, 5, 6], [2, 1, 0, 5, 4], [2, 1, 0, 3, 4],
      [2, 1, 0, 7, 4], [2, 1, 8, 5, 4], [2, 1, 8, 5, 6], [2, 5, 8, 1, 4],
      [2, 5, 8, 7, 4], [2, 5, 8, 3, 4], [2, 5, 8, 1, 6], [2, 5, 8, 0, 6],
      [2, 5, 8, 6, 0], [2, 5, 8, 7, 0], [2, 5, 8, 1, 6], [2, 5, 0, 1, 6],
      [2, 5, 0, 1, 4], [2, 8, 0, 1, 6], [2, 8, 6, 4, 0], [2, 8, 0, 1, 6],
      [2, 7, 8, 5, 4], [2, 7, 8, 5, 0], [2, 7, 0, 1, 4], [2, 6, 8, 5, 0],
      [2, 6, 0, 1, 8], [2, 6, 0, 1, 8], [2, 3, 8, 5, 4], [2, 3, 0, 1, 8],
      [2, 3, 0, 1, 8], [2, 0, 8, 5, 6], [2, 0, 6, 4, 8],
      // Corner, Not Center //

      [8, 0, 6, 7, 2], [8, 0, 2, 5, 6], [8, 1, 2, 5, 6], [8, 1, 6, 7, 4],
      [8, 2, 6, 7, 0], [8, 5, 2, 1, 4], [8, 5, 2, 7, 4], [8, 5, 2, 3, 4],
      [8, 5, 2, 7, 0], [8, 5, 2, 1, 6], [8, 5, 2, 6, 0], [8, 5, 2, 0, 6],
      [8, 5, 6, 7, 0], [8, 7, 2, 5, 0], [8, 7, 6, 3, 4], [8, 7, 6, 0, 2],
      [8, 7, 6, 1, 4], [8, 7, 6, 3, 2], [8, 7, 6, 3, 4], [8, 7, 6, 2, 0],
      [8, 7, 6, 5, 4], [8, 7, 6, 5, 0], [8, 7, 2, 5, 4], [8, 7, 2, 5, 0],
      [8, 6, 2, 5, 0], [8, 3, 6, 7, 4], [8, 3, 2, 5, 4], [8, 3, 6, 7, 2],
      [8, 3, 6, 7, 4],
      // Corner, Not Center //

      [6, 0, 8, 7, 2], [6, 1, 8, 7, 4], [6, 1, 0, 3, 4], [6, 1, 0, 3, 8],
      [6, 2, 0, 3, 8], [6, 2, 8, 7, 0], [6, 2, 0, 3, 8], [6, 5, 8, 7, 4],
      [6, 5, 0, 3, 4], [6, 5, 8, 7, 0], [6, 8, 0, 3, 2], [6, 7, 8, 5, 4],
      [6, 7, 8, 5, 0], [6, 7, 8, 2, 0], [6, 7, 8, 1, 4], [6, 7, 8, 0, 2],
      [6, 7, 8, 3, 4], [6, 7, 8, 3, 2], [6, 7, 0, 3, 4], [6, 7, 0, 3, 2],
      [6, 3, 0, 7, 4], [6, 3, 0, 7, 2], [6, 3, 0, 8, 2], [6, 3, 0, 5, 4],
      [6, 3, 0, 2, 8], [6, 3, 0, 1, 4], [6, 3, 0, 1, 4], [6, 3, 0, 1, 8],
      [6, 3, 8, 7, 4], [6, 3, 8, 7, 2], [6, 0, 2, 4, 8]
      // Corner, Not Center //

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Work Two Ways
    if (returnNumb === undefined) {

      if (fp.length > 9) {

        returnNumb = chooseFrom(defs.all.concat(defs.corner, defs.center, defs.corner, defs.center, defs.center, defs.center, defs.center))

      } else if (fp.length <= 9) {

        // Third play in two ways
        if (returnNumb === undefined) {

          // works to play third part in 2 way pattern 

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 5) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 
                // should be taken by the computer and 
                // item 1 and item 3 should be taken by the opponent
                if (index === 0 || index === 2) {

                  medium = mp.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[4]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in two ways
        if (returnNumb === undefined) {

          // works to play second part in 2 way pattern 

          let xcon = twWork.slice()

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 3) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 should be taken
                // by the computer and item 1 should be taken by the opponent
                if (index === 0) {

                  medium = mp.includes(item)

                } else if (index === 1) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[2]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize Two ways
        if (returnNumb === undefined) {

          // works to start 2 way pattern to win

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check for conditions to use two ways
            testList.forEach(item => {

              // chek if all items are free
              let medium = fp.includes(item)

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[0]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  const getHardNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    const defs = {
      center: [4],
      edge: [1, 3, 5, 7],
      corner: [0, 2, 6, 8],
      all: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }

    // To get Two Ways
    const twWork = [

      [4, 1, 6], [4, 1, 8], [4, 5, 0], [4, 5, 6], [4, 7, 0], [4, 7, 2],
      [4, 3, 8], [4, 3, 2],
      // Center, Edge, Corner //

      [4, 0, 8, 3, 6], [4, 0, 8, 1, 2], [4, 0, 8, 5, 6], [4, 0, 8, 7, 2],
      // Center, Corner, Corner, Edge, Corner//

      [0, 1, 6, 3, 8], [0, 1, 2, 3, 4], [0, 2, 6, 3, 8], [0, 2, 8, 4, 6],
      [0, 5, 6, 3, 4], [0, 5, 2, 1, 6], [0, 5, 2, 1, 4], [0, 8, 6, 3, 2],
      [0, 8, 2, 1, 6], [0, 7, 2, 1, 4], [0, 7, 6, 3, 2], [0, 7, 6, 3, 4],
      [0, 6, 2, 1, 8], [0, 3, 6, 7, 4], [0, 3, 2, 1, 4], [0, 3, 6, 7, 4],
      [0, 3, 6, 1, 4], [0, 3, 6, 5, 4], [0, 3, 2, 1, 8],
      // Corner, Not Center //

      [2, 0, 6, 4, 8], [2, 0, 8, 5, 6], [2, 1, 0, 5, 4], [2, 1, 0, 3, 4],
      [2, 1, 0, 7, 4], [2, 1, 8, 5, 4], [2, 1, 8, 5, 6], [2, 5, 8, 1, 4],
      [2, 5, 8, 7, 4], [2, 5, 8, 3, 4], [2, 5, 8, 1, 6], [2, 5, 8, 0, 6],
      [2, 5, 8, 6, 0], [2, 5, 8, 7, 0], [2, 5, 8, 1, 6], [2, 5, 0, 1, 6],
      [2, 5, 0, 1, 4], [2, 8, 0, 1, 6], [2, 8, 6, 4, 0], [2, 8, 0, 1, 6],
      [2, 7, 8, 5, 4], [2, 7, 8, 5, 0], [2, 7, 0, 1, 4], [2, 6, 8, 5, 0],
      [2, 6, 0, 1, 8], [2, 6, 0, 1, 8], [2, 3, 8, 5, 4], [2, 3, 0, 1, 8],
      [2, 3, 0, 1, 8], [2, 0, 8, 5, 6], [2, 0, 6, 4, 8],
      // Corner, Not Center //

      [8, 0, 6, 7, 2], [8, 0, 2, 5, 6], [8, 1, 2, 5, 6], [8, 1, 6, 7, 4],
      [8, 2, 6, 7, 0], [8, 5, 2, 1, 4], [8, 5, 2, 7, 4], [8, 5, 2, 3, 4],
      [8, 5, 2, 7, 0], [8, 5, 2, 1, 6], [8, 5, 2, 6, 0], [8, 5, 2, 0, 6],
      [8, 5, 6, 7, 0], [8, 7, 2, 5, 0], [8, 7, 6, 3, 4], [8, 7, 6, 0, 2],
      [8, 7, 6, 1, 4], [8, 7, 6, 3, 2], [8, 7, 6, 3, 4], [8, 7, 6, 2, 0],
      [8, 7, 6, 5, 4], [8, 7, 6, 5, 0], [8, 7, 2, 5, 4], [8, 7, 2, 5, 0],
      [8, 6, 2, 5, 0], [8, 3, 6, 7, 4], [8, 3, 2, 5, 4], [8, 3, 6, 7, 2],
      [8, 3, 6, 7, 4],
      // Corner, Not Center //

      [6, 0, 8, 7, 2], [6, 1, 8, 7, 4], [6, 1, 0, 3, 4], [6, 1, 0, 3, 8],
      [6, 2, 0, 3, 8], [6, 2, 8, 7, 0], [6, 2, 0, 3, 8], [6, 5, 8, 7, 4],
      [6, 5, 0, 3, 4], [6, 5, 8, 7, 0], [6, 8, 0, 3, 2], [6, 7, 8, 5, 4],
      [6, 7, 8, 5, 0], [6, 7, 8, 2, 0], [6, 7, 8, 1, 4], [6, 7, 8, 0, 2],
      [6, 7, 8, 3, 4], [6, 7, 8, 3, 2], [6, 7, 0, 3, 4], [6, 7, 0, 3, 2],
      [6, 3, 0, 7, 4], [6, 3, 0, 7, 2], [6, 3, 0, 8, 2], [6, 3, 0, 5, 4],
      [6, 3, 0, 2, 8], [6, 3, 0, 1, 4], [6, 3, 0, 1, 4], [6, 3, 0, 1, 8],
      [6, 3, 8, 7, 4], [6, 3, 8, 7, 2], [6, 0, 2, 4, 8]
      // Corner, Not Center //

    ]

    // To stop Two Ways
    const twStop = [

      [4, 0, 8, 6], [4, 0, 8, 2], [4, 2, 6, 0], [4, 2, 6, 8], [4, 8, 0, 6],
      [4, 8, 0, 2], [4, 6, 2, 8], [4, 6, 2, 0], [4, 6, 2, 8], [0, 4, 6, 8],

      [0, 4, 8, 7], [0, 4, 8, 3], [0, 4, 8, 1], [0, 4, 8, 5], [2, 4, 6, 1],
      [2, 4, 6, 5], [2, 4, 6, 7], [2, 4, 6, 3], [8, 4, 0, 1], [8, 4, 0, 5],
      [8, 4, 0, 7], [8, 4, 0, 3], [6, 4, 2, 1], [6, 4, 2, 7], [6, 4, 2, 5],
      [6, 4, 2, 3]

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Block Two Ways
    if (returnNumb === undefined) {

      if (fp.length <= 9) {

        // Third play in block
        if (returnNumb === undefined) {

          // works to play third part to block 

          let xcon = twStop.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 6) {

              let tester = true

              // Check if blocking is necessary
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0, item 2 and item 4
                // should be taken by the opponent and item 1 and item 3 
                // should be taken by the computer
                if (index === 0 || index === 2 || index === 4) {

                  medium = op.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = mp.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[5]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in block
        if (returnNumb === undefined) {

          // works to play second part to block 

          let xcon = twStop.slice(); let a = 0

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon); a++

            if (testList.length >= 4) {

              let tester = true


              // Check if blocking is necessary
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 should 
                // be taken by the opponent and item 1 should be taken by
                // the computer
                if (index === 0 && index === 2) {

                  medium = op.includes(item)

                } else if (index === 1) {

                  medium = mp.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[3]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize block
        if (returnNumb === undefined) {

          // works to block

          let xcon = twStop.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check if blocking is neccessary
            testList.forEach((item, index) => {

              // check if all items are free but item 0 should be taken
              // by the opponent
              if (index === 0) {

                medium = op.includes(item)

              } else {

                medium = fp.includes(item)

              }

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[1]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work Two Ways
    if (returnNumb === undefined) {

      if (fp.length <= 9) {

        // Third play in two ways
        if (returnNumb === undefined) {

          // works to play third part in 2 way pattern 

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 5) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 
                // should be taken by the computer and 
                // item 1 and item 3 should be taken by the opponent
                if (index === 0 || index === 2) {

                  medium = mp.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[4]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in two ways
        if (returnNumb === undefined) {

          // works to play second part in 2 way pattern 

          let xcon = twWork.slice()

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 3) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 should be taken
                // by the computer and item 1 should be taken by the opponent
                if (index === 0) {

                  medium = mp.includes(item)

                } else if (index === 1) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[2]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize Two ways
        if (returnNumb === undefined) {

          // works to start 2 way pattern to win

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check for conditions to use two ways
            testList.forEach(item => {

              // chek if all items are free
              let medium = fp.includes(item)

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[0]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  // ---- Around the original choosing code

  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  const winnerOf = function (points) {

    const line = LINES.find(l => points[l[0]] !== '' &&
      points[l[0]] === points[l[1]] && points[l[1]] === points[l[2]])

    return line ? points[line[0]] : ''

  }

  const known = {}

  // How a position ends for `me` if both sides play perfectly from here,
  // with `mover` to play: 1 a win, 0 a draw, -1 a loss.
  const worth = function (points, mover, me) {

    const key = points.map(p => p || '-').join('') + mover + me

    if (known[key] !== undefined) { return known[key] }

    const winner = winnerOf(points)

    let value

    if (winner !== '') {

      value = winner === me ? 1 : -1

    } else if (!points.includes('')) {

      value = 0

    } else {

      const next = mover === 'X' ? 'O' : 'X'

      const values = []

      points.forEach((point, index) => {

        if (point !== '') { return }

        points[index] = mover

        values.push(worth(points, next, me))

        points[index] = ''

      })

      value = mover === me ? Math.max(...values) : Math.min(...values)

    }

    known[key] = value

    return value

  }

  // The free squares that keep the best result `letter` can still reach
  const soundMoves = function (points, letter) {

    const board = points.slice()

    const next = letter === 'X' ? 'O' : 'X'

    const moves = []

    board.forEach((point, index) => {

      if (point !== '') { return }

      board[index] = letter

      moves.push([index, worth(board, next, letter)])

      board[index] = ''

    })

    const best = Math.max(...moves.map(move => move[1]))

    return moves.filter(move => move[1] === best).map(move => move[0])

  }

  // How often the easy level plays any free square instead of thinking
  const EASY_SLIPS = 0.3

  /* points: the nine squares, each '', 'X' or 'O'.
     letter: the computer's letter. Returns the index of a free square.

     Easy and hard wrap the original code so the levels feel like their
     names. Easy sometimes does not look, so a new player can win. Hard
     keeps its own move when that move is sound, and otherwise takes one
     that is, so it cannot be beaten. Medium is the original, untouched. */
  const choose = function (difficulty, points, letter) {

    const all = points.map((item, index) => [item, index])

    const free = all.filter(x => x[0] === '')

    const mine = all.filter(x => x[0] === letter)

    const theirs = all.filter(x => x[0] !== '' && x[0] !== letter)

    let pick

    switch (difficulty) {

      case 'hard': {

        pick = getHardNum(theirs, mine, free)

        const sound = soundMoves(points, letter)

        if (!sound.includes(pick)) { pick = chooseFrom(sound) }

        break;

      }

      case 'medium':

        pick = getMedNum(theirs, mine, free)

        break;

      default:

        pick = Math.random() < EASY_SLIPS ? chooseFrom(free)[1] : getEasyNum(theirs, mine, free)

        break;

    }

    // Never hand back a square that is taken
    if (!free.some(x => x[1] === pick)) { pick = chooseFrom(free)[1] }

    return pick

  }

  return {

    choose: (difficulty, points, letter) => choose(difficulty, points, letter)

  }

})();
