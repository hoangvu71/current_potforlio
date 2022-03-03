import {cloneDeep} from "lodash"
class GetMove {
    constructor(w_zero, w_one, w_two, w_three, w_four, w_five, w_six, board) {
        this.board = board
        this.w_zero = w_zero
        this.w_one = w_one
        this.w_two = w_two
        this.w_three = w_three
        this.w_four = w_four
        this.w_five = w_five
        this.w_six = w_six
    }
    
    
    getAllMoves(board=this.board) {
        let result = []
        let redMoves = []
        let redJumps = []
        let blueMoves = []
        let blueJumps = []
        for (let row = 0; row <=7; row++){
            for (let col = 0; col <= 7; col++){
                let neighbor = this.getNeighbors(board, row, col)
                if (neighbor[0]) {
                    if (board[row][col] == 'r' || board[row][col] == 'R') {
                        redMoves.push(this.getNeighbors(board, row, col))
                    }
                    else if (board[row][col] == 'b' || board[row][col] == 'B') {
                        blueMoves.push(this.getNeighbors(board, row, col))
                    }
                }
            }
        }
        result.push(redMoves)
        result.push(blueMoves)
        for (let indexBlue = 0; indexBlue < blueMoves.length; indexBlue++) {
            if (blueMoves[indexBlue][2] == "jump") {
                blueJumps.push(blueMoves[indexBlue])
            }
        }

        for (let indexRed = 0; indexRed < redMoves.length; indexRed++) {
            if (redMoves[indexRed][2] == "jump") {
                redJumps.push(redMoves[indexRed])
            }
        }
        
        if (redJumps.length > 0) {
            result.shift()
            result.unshift(redJumps)
        }

        if (blueJumps.length > 0) {
            result.pop()
            result.push(blueJumps)
        }
        result.push(blueMoves)
        return result
    }

    checkRowCollumn(row, collumn) {
        
        if ((row >= 0 && row <= 7) && (collumn >= 0 && collumn <= 7)) {
            return true
        }
        else {return false}
    }

    getNeighbors(board, currentRow, currentCollumn) {
        // This should return the neighbor if it's 1 and if it's a possible jump neighbor
        // Result should be like this. [[currentRow, currentCollumn][neighborRow, neighborCollumn], 'normal'] if it's a normal move
        // [[currentRow, currentCollumn][neighborRow, neighborCollumn], 'jump'] if it's a jump move
        let checker = board[currentRow][currentCollumn]
        //////////// Checker's four neighbors are /////////////
        // let last_row_last_collumn === board[currentRow - 1][currentCollumn - 1]
        // let last_row_next_collumn === board[currentRow - 1][currentCollumn + 1]
        // let next_row_last_collumn === board[currentRow + 1][currentCollumn - 1]
        // let next_row_next_collumn === board[currentRow + 1][currentCollumn + 1]
        ///////////////////////////////////////////////////////

        let neighborsUnchecked = []
        let neighborsUncheckedJump = []
        // if checker is red, check south neighbors
        if (checker === 'r' && this.checkRowCollumn(currentRow+1, currentCollumn-1) && board[currentRow+1][currentCollumn-1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow+1, currentCollumn-1], 'normal')
        }
        if (checker === 'r' && this.checkRowCollumn(currentRow+1, currentCollumn+1) && board[currentRow+1][currentCollumn+1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow+1, currentCollumn+1], 'normal')
        }
        
        // if checker is blue, check north neighbors
        if (checker === 'b' && this.checkRowCollumn(currentRow-1, currentCollumn-1) && board[currentRow-1][currentCollumn-1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow-1, currentCollumn-1], 'normal')
        }
        if (checker === 'b' && this.checkRowCollumn(currentRow-1, currentCollumn+1) && board[currentRow-1][currentCollumn+1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow-1, currentCollumn+1], 'normal')
        }
        
        // if checker is blue and the neighbor is red, then check if blue can jump
        if (checker === 'b' && this.checkRowCollumn(currentRow-1, currentCollumn-1) 
            && (board[currentRow-1][currentCollumn-1] === 'r' ||  board[currentRow-1][currentCollumn-1] === 'R')
            && this.checkRowCollumn(currentRow-2, currentCollumn-2)
            && board[currentRow-2][currentCollumn-2] === "1") {
            // check if red can jump
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow -2, currentCollumn - 2], 'jump')
        }

        if (checker === 'b' && this.checkRowCollumn(currentRow-1, currentCollumn+1) 
            && (board[currentRow-1][currentCollumn+1] === 'r' || board[currentRow-1][currentCollumn+1] === 'R')
            && this.checkRowCollumn(currentRow-2, currentCollumn+2)
            && board[currentRow-2][currentCollumn+2] === "1") {
            // check if red can jump
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow -2, currentCollumn + 2], 'jump')
        } 
        
        // if checker is red and the neighbor is blue, then check if red can jump
        if (checker === 'r' 
            && this.checkRowCollumn(currentRow+1, currentCollumn-1) 
            && (board[currentRow+1][currentCollumn-1] === 'b' || board[currentRow+1][currentCollumn-1] === 'B')
            && this.checkRowCollumn(currentRow+2, currentCollumn-2)
            && board[currentRow+2][currentCollumn-2] === "1") {
            // check if red can jump
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow + 2, currentCollumn - 2], 'jump')
        }

        if (checker === 'r' 
            && this.checkRowCollumn(currentRow+1, currentCollumn+1) 
            && (board[currentRow+1][currentCollumn+1] === 'b' || board[currentRow+1][currentCollumn+1] === 'B') 
            && this.checkRowCollumn(currentRow+2, currentCollumn+2)
            && board[currentRow+2][currentCollumn+2] === "1") {
            // check if red can jump
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow +2, currentCollumn + 2], 'jump')
        }



        ////////////////////////If Checker is KING //////////////////////
        // if neighbor is a one,
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow-1, currentCollumn-1) && board[currentRow-1][currentCollumn-1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow-1, currentCollumn-1], 'normal')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow-1, currentCollumn+1) && board[currentRow-1][currentCollumn+1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow-1, currentCollumn+1], 'normal')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow+1, currentCollumn-1) && board[currentRow+1][currentCollumn-1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow+1, currentCollumn-1], 'normal')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow+1, currentCollumn+1) && board[currentRow+1][currentCollumn+1] === "1") {
            neighborsUnchecked.push([currentRow, currentCollumn], [currentRow+1, currentCollumn+1], 'normal')
        }

        // if neighbor is an opposite checker,
        function getOppositeChecker(checker) {
            if (checker === 'b' || checker === 'B') {
                return ['r', 'R']
            }
            else if (checker === 'r' || checker === 'R') {
                return ['b', 'B']
            }
            else {
                return ["Nothing"]
            }
        }
        let oppositeChecker = getOppositeChecker(checker)
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow-1, currentCollumn-1) && oppositeChecker.includes(board[currentRow-1][currentCollumn-1]) && this.checkRowCollumn(currentRow-2, currentCollumn-2) && board[currentRow-2][currentCollumn-2] === "1") {
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow-2, currentCollumn-2], 'jump')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow-1, currentCollumn+1) && oppositeChecker.includes(board[currentRow-1][currentCollumn+1]) && this.checkRowCollumn(currentRow-2, currentCollumn+2) && board[currentRow-2][currentCollumn+2] === "1") {
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow-2, currentCollumn+2], 'jump')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow+1, currentCollumn-1) && oppositeChecker.includes(board[currentRow+1][currentCollumn-1]) && this.checkRowCollumn(currentRow+2, currentCollumn-2) && board[currentRow+2][currentCollumn-2] === "1") {
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow+2, currentCollumn-2], 'jump')
        }
        if ((checker === 'B' || checker === 'R') && this.checkRowCollumn(currentRow+1, currentCollumn+1) && oppositeChecker.includes(board[currentRow+1][currentCollumn+1]) && this.checkRowCollumn(currentRow+2, currentCollumn+2) && board[currentRow+2][currentCollumn+2] === "1") {
            neighborsUncheckedJump.push([currentRow, currentCollumn], [currentRow+2, currentCollumn+2], 'jump')
        }




        if (neighborsUncheckedJump[0]) {
            return neighborsUncheckedJump
        }
        else if (neighborsUnchecked[0]) {
            return neighborsUnchecked
        }
        return [false]
    }
    
    moveTheChecker(move, highestscore) {
        let startId = move[0]
        let endId = move[1]
        let typeOfMove = move[2]

        this.board[endId[0]][endId[1]] = cloneDeep(this.board[startId[0]][startId[1]])
        this.board[startId[0]][startId[1]] = "1"

        if (typeOfMove === 'jump') {
            let killedIdRow = startId[0] - (startId[0] - endId[0]) / 2
            let killedIdCol = startId[1] - (startId[1] - endId[1]) / 2
            console.log("This is the killed button state, ", this.board)
            this.board[killedIdRow][killedIdCol] = "1"
            console.log("This is the killed button state, ", this.board)

        }

        if (endId[0] === 7) {
            this.board[endId[0]][endId[1]] = "R"
        }

        this.calculateTheWave(move, this.board, highestscore)
        this.canRedJumpAgain(move)
        let allMoves = this.getAllMoves(this.board)
        let blueMoves = allMoves[1]
        if (blueMoves.length === 0) {
            console.log("red won!")
        }
        return this.board
    }

    canRedJumpAgain(move){
        if (move[2] === 'jump') {
            let allMoves = this.getAllMoves(this.board)
            let redMoves = allMoves[0]
            console.log("all red moves in canredjumpagain: ", redMoves, "previous move", move)
            console.log("board in canredjumpagain: ", this.board)
            for (let index = 0; index < redMoves.length; index++){
                if (move[1].toString() == redMoves[index][0].toString() && redMoves[0][2] === 'jump') {
                    this.redMove()
                } 
            }
        }
        
    }
    
    updateCssFromSkeleton(board) {

        // loop through each checker
        let rows = [0,1,2,3,4,5,6,7]
        let collumns = [...rows]


        for (let row = 0; row <= 7; row++) {
            for (let collumn = 0; collumn <= 7; collumn++) {
                let checkerId = `${row},${collumn}`
                let checker = document.getElementById(checkerId)

                
                if (board[row][collumn] === 'r') {
                    checker.removeAttribute("class")
                    checker.classList.add("red_checker")
                    checker.classList.add("movable")
                }
                else if (board[row][collumn] === 'b') {
                    checker.removeAttribute("class")
                    checker.classList.add("blue_checker")
                    checker.classList.add("movable")
                }

                else if (board[row][collumn] === 'R') {
                    checker.removeAttribute("class")
                    checker.classList.add("red_king_checker")
                    checker.classList.add("movable")
                }
                else if (board[row][collumn] === 'B') {
                    checker.removeAttribute("class")
                    checker.classList.add("blue_king_checker")
                    checker.classList.add("movable")
                }
            }
        }
    }

    calculateTheWave(move, board, v_train) {
        // gets v_b, which is the score of current move
        let v_b = this.getScore(this.board)
        console.log("This is number of red and blue threatedned: ", this.x_six_red_threatened, this.x_five_blue_threatend)

        console.log("This is vtrain: ", v_train, " This is v_b", v_b)

        ///////////////////// SAVE THE WEIGHTS TO TEMP WEIGHT //////////
        let temp_w_zero = this.w_zero
        let temp_w_one = this.w_one
        let temp_w_two = this.w_two
        let temp_w_three = this.w_three
        let temp_w_four = this.w_four
        let temp_w_five = this.w_five
        let temp_w_six = this.w_six
        /////////////////////////////////////////////////////////////////


        // calculating weights
        this.w_zero = this.w_zero + 0.01 * (v_train - v_b)
        this.w_one = this.w_one + 0.01 * (v_train - v_b) * this.x_one_blue_pieces
        this.w_two = this.w_two + 0.01 * (v_train - v_b) * this.x_two_red_pieces
        this.w_three = this.w_three + 0.01 * (v_train - v_b) * this.x_three_blue_king_pieces
        this.w_four = this.w_four + 0.01 * (v_train - v_b) * this.x_four_red_king_pieces
        this.w_five = this.w_five + 0.01 * (v_train - v_b) * this.x_five_blue_threatend
        this.w_six = this.w_six + 0.01 * (v_train - v_b) * this.x_six_red_threatened


        if (v_train > 100) {
            this.w_zero = this.w_zero / 2
            this.w_one = this.w_one / 2
            this.w_two = this.w_two / 2
            this.w_three = this.w_three / 2
            this.w_four = this.w_four / 2
            this.w_five = this.w_five / 2
            this.w_six = this.w_six / 2

        }
        // console.log("Weights, 0: ", this.w_zero, 
        //             "one: ", this.w_one,
        //             "two: ", this.w_two,
        //             "three: ", this.w_three,
        //             "four: ", this.w_four,
        //             "five: ", this.w_five,
        //             "six: ", this.w_six)
        
        
        // console.log("Pieces, x_one_blue_pieces:", this.x_one_blue_pieces,
        //                 "x_two_red_pieces:", this.x_two_red_pieces,
        //                 "x_three_blue_king_pieces:", this.x_three_blue_king_pieces,
        //                 "x_four_red_king_pieces:", this.x_four_red_king_pieces,
        //                 "x_five_blue_threatend:", this.x_five_blue_threatend,
        //                 "x_six_red_threatened:", this.x_six_red_threatened,   
        //                 )
        ///////////////////// DIFERENCES BETWEEN OLD AND NEW WEIGHTS //////////////////
        let diff_w_zero = this.w_zero - temp_w_zero
        let diff_w_one = this.w_one - temp_w_one
        let diff_w_two = this.w_two - temp_w_two
        let diff_w_three = this.w_three - temp_w_three
        let diff_w_four = this.w_four - temp_w_four
        let diff_w_five = this.w_five - temp_w_five
        let diff_w_six = this.w_six - temp_w_six
        ///////////////////////////////////////////////////////////////////////////////

        console.log("Weights differences: ")
        console.log("Difference Weight zero: ", diff_w_zero)
        console.log("Difference Weight one: ", diff_w_one)
        console.log("Difference Weight two: ", diff_w_two)
        console.log("Difference Weight three: ", diff_w_three)
        console.log("Difference Weight four: ", diff_w_four)
        console.log("Difference Weight five: ", diff_w_five)
        console.log("Difference Weight six: ", diff_w_six)

    }

    separateMoveArray(move) {
        // This function will separate move from [[row,collumn], [row, collumn], "normal", [row,collumn, [row,collumn], "normal"]]
        // to two separate list, [[[row,collumn], [row,collumn], "normal"], [[[row,collumn], [row,collumn], "normal"]]]
        let result = []
        for (let moveIndex = 0; moveIndex < move.length; moveIndex++) {
            for (let nestIndex = 0; nestIndex < move[moveIndex].length; nestIndex = nestIndex + 3){
                let currentRowCol = move[moveIndex][nestIndex]
                let neighborRowCol = move[moveIndex][nestIndex+1]
                let type = move[moveIndex][nestIndex + 2]
                result.push([currentRowCol, neighborRowCol, type])
            }
        }
        return result

    }

    getBlueRedThreatened(board) {
        // this function will return [numberOfRedThreatened, numberOfBlueThreatened]
        // if there are red jumps,
        // check each of the jump and save the killed checker coord in a list if it's not already in the list
        let allMoves = this.getAllMoves(board)
        let redMoves = allMoves[0]
        let blueMoves = allMoves[1]
        redMoves = this.separateMoveArray(redMoves)
        blueMoves = this.separateMoveArray(blueMoves)
        let killedBlueCheckers = []
        let killedRedCheckers = []
        for (let moveIndex = 0; moveIndex < redMoves.length; moveIndex++){
            let currentCoords = redMoves[moveIndex][0]
            let neighborCoords = redMoves[moveIndex][1]
            let killedCheckerCoords = [currentCoords[0] - ((currentCoords[0] - neighborCoords[0]) / 2), currentCoords[1] - ((currentCoords[1] - neighborCoords[1]) / 2)]
            let type = redMoves[moveIndex][2]
            if (type === "jump") {
                if (!killedBlueCheckers.includes(`${killedCheckerCoords}`)) {
                    killedBlueCheckers.push(`${killedCheckerCoords}`)
                }
            }
        }

        for (let moveIndex = 0; moveIndex < blueMoves.length; moveIndex++){
            let currentCoords = blueMoves[moveIndex][0]
            let neighborCoords = blueMoves[moveIndex][1]
            let killedCheckerCoords = [currentCoords[0] - ((currentCoords[0] - neighborCoords[0]) / 2), currentCoords[1] - ((currentCoords[1] - neighborCoords[1]) / 2)]
            let type = blueMoves[moveIndex][2]
            if (type === "jump") {
                if (!killedRedCheckers.includes(`${killedCheckerCoords}`)) {
                    killedRedCheckers.push(`${killedCheckerCoords}`)
                }
            }
        }
        return [killedRedCheckers.length, killedBlueCheckers.length]

    }

    getHighestScoreFromBoardStates(boards){
        let highest_score = -10000000000
        let highestboard = 0
        for (let board_index = 0; board_index < boards.length; board_index++){
            let score = this.getScore(boards[board_index])
            if (score > highest_score) {
                highest_score = score
                highestboard = board_index
            }
        }
        console.log("Highest score board", boards[highestboard], highest_score)
        return highest_score
    }

    getTheWeights() {
        console.log("weightssssssssssssssssssssssssssssssssssssss", [this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six])
        return [this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six]
    }

    getScore(board) {
        // x1 number of blue pieces on board
        // x2 number of red pieces on board
        // x3 number of blue king pieces on board
        // x4 number of red king pieces on board
        // x5 number of blue pieces threatened by red
        // x6 number of red pieces threatened by blue
        // V^(b) = w0 + w1x1 + w2x2 + w3x3 + w4x4 + w5x5 + w6x6 
        this.x_one_blue_pieces = 0
        this.x_two_red_pieces = 0
        this.x_three_blue_king_pieces = 0
        this.x_four_red_king_pieces = 0
        this.x_five_blue_threatend = 0
        this.x_six_red_threatened = 0
        for (let row = 0; row <= 7 ; row++) {
            for (let col = 0; col <= 7; col++) {
                let checker = board[row][col]
                if (checker == 'b') {
                    this.x_one_blue_pieces++
                }
                else if (checker == 'r') {
                    this.x_two_red_pieces++
                }
                else if (checker == 'B') {
                    this.x_three_blue_king_pieces++
                }
                else if (checker == 'R') {
                   this.x_four_red_king_pieces++
                }
                
            }
        }
        let blueRedThreatened = this.getBlueRedThreatened(board)
        let redThreatened = parseInt(blueRedThreatened[0])
        let blueThreatened = parseInt(blueRedThreatened[1])
        if (redThreatened) {
            this.x_six_red_threatened = redThreatened
        }
        if (blueThreatened) {
            this.x_five_blue_threatend = blueThreatened
        }
        
        //////////////GET SCORE WILL RETURN 0 IF NO REDS ON BOARD /////////////
        if (this.x_two_red_pieces === 0 && this.x_four_red_king_pieces === 0) {
            return 0
        }
        //////////////GET SCORE WILL RETURN 0 IF NO RED MOVES AVAILBLE ///////////
        let all_moves = this.getAllMoves(board)
        let red_moves = all_moves[0]
        let blue_moves = all_moves[1]
        if (red_moves.length === 0) {
            return 0
        }

        ////////////GET SCORE WILL RETURN 100 IF NO BLUES ON BOARD //////////////
        if (this.x_one_blue_pieces === 0 && this.x_three_blue_king_pieces === 0) {
            return 100
        }
        
        ////////////GET SCORE WILL RETURN 100 IF NO BLUE MOVES AVAILABLE ////////
        if (blue_moves.length === 0) {
            return 100
        }



        return this.w_zero + (this.w_one * this.x_one_blue_pieces) 
                + (this.w_two * this.x_two_red_pieces) 
                + (this.w_three * this.x_three_blue_king_pieces) 
                + (this.w_four * this.x_four_red_king_pieces)
                + (this.w_five * this.x_five_blue_threatend)
                + (this.w_six * this.x_six_red_threatened)
    }

    makeNewBoardStateFromMove(board, move) {
        let newBoard = cloneDeep(board)
        let currentRow = move[0][0]
        let currentCol = move[0][1]
        let neighborRow = move[1][0]
        let neighborCol = move[1][1]
        let checker = newBoard[currentRow][currentCol]
        let checkerNeighbor = newBoard[neighborRow][neighborCol]
        if (move[2] === "normal") {
            newBoard[neighborRow][neighborCol] = checker
            newBoard[currentRow][currentCol] = checkerNeighbor
        }
        else if (move[2] === "jump") {
            newBoard[neighborRow][neighborCol] = checker
            newBoard[currentRow][currentCol] = checkerNeighbor
            let killedCheckerRow = currentRow - (currentRow - neighborRow)/2
            let killedCheckerCol = currentCol - (currentCol - neighborCol)/2
            newBoard[killedCheckerRow][killedCheckerCol] = 1
            if (checker === "b" && currentRow === 0) {
                newBoard[currentRow][currentCol] = "B"
            }
            else if (checker === "r" && currentRow === 7) {
                newBoard[currentRow][currentCol] = "R"
            }
        }  

        

        return newBoard
    }
    redMove() {
        let all_moves = this.getAllMoves()
        console.log("This is all the moves mate: ", all_moves)
        let red_moves = all_moves[0]
        let red_moves_separated = this.separateMoveArray(red_moves)
        ////////IF NO RED MOVES AVAILABLE, BLUE WINS ////////////
        if (red_moves_separated.length == 0) {
            console.log("Blue WON!")
            this.updateWeightWhenRedLost()
            return 0
        } 
        



        let final_result = []
        // loops through the above red_moves
        for (let red_index = 0; red_index< red_moves_separated.length; red_index++){

            let new_red_board = this.makeNewBoardStateFromMove(this.board, red_moves_separated[red_index])

            let all_moves_2 = this.getAllMoves(new_red_board)
            let blue_moves = all_moves_2[1]
            blue_moves = this.separateMoveArray(blue_moves)
            let all_possible_blue_moves_in_this_red = []
            let all_possible_red_boards_again = []
            


            ///////////IF NO BLUE MOVES AVAILABLE AFTER A CERTAIN REDMOVE//////////
            ////////////THAT MEANS THAT RED MOVE V TRAIN SHOULD BE 100 /////////////

            if (blue_moves.length == 0) {
                console.log("After one red move, it will win!")
                
                final_result.push({
                    v_b: this.getScore(new_red_board),
                    v_train: 100,
                    red_move: red_moves_separated[red_index],
                    red_move_board_after: new_red_board,
                    blue_moves_with_red_again: false
                })
                continue
            }
            ////////////////////END//////////////////////////////////////

            // now loops through all the blue_moves
            for (let blue_index = 0; blue_index < blue_moves.length; blue_index++){
                let new_blue_board = this.makeNewBoardStateFromMove(new_red_board, blue_moves[blue_index])
                let all_moves_3 = this.getAllMoves(new_blue_board)
                let red_moves_again = all_moves_3[0]
                all_possible_blue_moves_in_this_red.push({
                    blue_move: blue_moves[blue_index],
                    red_moves_again: red_moves_again
                })


                /////////////IF NO RED MOVES ONCE BLUE MOVE IS DONE//////////
                ////////////THAT MEANS BLUE HAS WON SO V TRAIN SHOULD BE -100
                if (red_moves_again.length == 0) {
                    console.log("That blue move, it has won! No red moves again available")
                    all_possible_red_boards_again.push(new_blue_board)
                    continue
                }
                /////////////////END//////////////



                for (let red_moves_again_index = 0; red_moves_again_index < red_moves_again.length; red_moves_again_index++){
                    let new_red_board_again = this.makeNewBoardStateFromMove(new_blue_board, red_moves_again[red_moves_again_index])
                    all_possible_red_boards_again.push(new_red_board_again)
                }
            }
            final_result.push({
                v_b: this.getScore(new_red_board),
                v_train: this.getHighestScoreFromBoardStates(all_possible_red_boards_again),
                red_move: red_moves_separated[red_index],
                red_move_board_after: new_red_board,
                blue_moves_with_red_again: all_possible_blue_moves_in_this_red
            })
        }


        // loops through final result and search for the one with the highest v_train score
        let highest_score_move = [false, -1000000]
        for (let final_result_index = 0; final_result_index < final_result.length; final_result_index++){
            if (highest_score_move[1] < final_result[final_result_index]['v_train']) {
                highest_score_move[0] = final_result[final_result_index]['red_move']
                highest_score_move[1] = final_result[final_result_index]['v_train']
            }
        }
        console.log("final: ", final_result)
        console.log("highest move with score: ", highest_score_move)
        return this.moveTheChecker(highest_score_move[0], highest_score_move[1])
        }

    updateWeightWhenRedLost() {
        this.w_zero = this.w_zero + 0.1 * (-100)
        this.w_one = this.w_one + 0.1 * (-100) 
        this.w_two = this.w_two + 0.1 * (-100) 
        this.w_three = this.w_three + 0.1 * (-100) 
        this.w_four = this.w_four + 0.1 * (-100)
        this.w_five = this.w_five + 0.1 * (-100) 
        this.w_six = this.w_six + 0.1 * (-100) 
    }
}


export default GetMove