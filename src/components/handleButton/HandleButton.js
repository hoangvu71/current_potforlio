import GetMove from "../GetMoves"
import {cloneDeep} from "lodash"

class HandleButton {
    constructor(previousButtonId, currentButtonId, blue_moves, board, blueCanJumpAgain) {
        this.board = board
        this.previousButtonId = previousButtonId
        this.currentButtonId = currentButtonId
        this.blue_moves = blue_moves
        this.blueCanJumpAgain = blueCanJumpAgain
        this.weight = []
        this.getWeightFromStorage()
        this.successMove = false
    }

    mainFunction () {
        this.removeAllNeighborCss()
        this.change_move_neighbor_css(this.blue_moves)
        
        console.log("previousbuttonid: ", this.previousButtonId)
        if (this.previousButtonId[0] && this.checkClickCombination(this.previousButtonId, this.currentButtonId, this.blue_moves) && this.checker_if_currentId_in_last_move_list(this.currentButtonId, this.blue_moves)) {
            let checkthisshyt = this.checkClickCombination(this.previousButtonId, this.currentButtonId, this.blue_moves)
            this.moveTheChecker(this.previousButtonId[0], this.currentButtonId)
        }

    }

    moveTheChecker(checkerIdFrom, checkerIdTo) {
        checkerIdTo = [parseInt(checkerIdTo[0]), parseInt(checkerIdTo[2])]
        if (checkerIdFrom == checkerIdTo) {
            return 0
        }
        this.board[checkerIdTo[0]][checkerIdTo[1]] = cloneDeep(this.board[checkerIdFrom[0]][checkerIdFrom[1]])
        this.board[checkerIdFrom[0]][checkerIdFrom[1]] = '1'

        if (checkerIdTo[0] === 0) {
            this.board[checkerIdTo[0]][checkerIdTo[1]] = "B"
        }
        if (((checkerIdFrom[0] - checkerIdTo[0])*(checkerIdFrom[0] - checkerIdTo[0])) > 1) {
            let domKilledButtonRow = checkerIdFrom[0] - (checkerIdFrom[0] - checkerIdTo[0])/2
            let domKilledButtonCol = checkerIdFrom[1] - (checkerIdFrom[1] - checkerIdTo[1])/2
            this.board[domKilledButtonRow][domKilledButtonCol] = '1'
            if (!this.canBlueMoveAgain([checkerIdFrom, checkerIdTo, "jump"], this.board)) {
                let getMoves = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.board)    
                let redMovedSkeleton = getMoves.redMove()
                this.weights = getMoves.getTheWeights()
                this.successMove = true
                this.blueCanJumpAgain = []
            }
            else {
                this.blueCanJumpAgain= [checkerIdFrom, checkerIdTo, "jump"]
            }
        }
        else {
            let getMoves = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.board)    
            let redMovedSkeleton = getMoves.redMove()
            this.successMove = true
            this.weights = getMoves.getTheWeights()
        }
        
    }

    getTheWeights() {
        console.log("what is the fcking weights mate?", this.weights)
        return this.weights
    }
    getWeightFromStorage() {
        this.w_zero = parseFloat(window.sessionStorage.getItem("weight_zero"))
        this.w_one = parseFloat(window.sessionStorage.getItem("weight_one"))
        this.w_two = parseFloat(window.sessionStorage.getItem("weight_two"))
        this.w_three = parseFloat(window.sessionStorage.getItem("weight_three"))
        this.w_four = parseFloat(window.sessionStorage.getItem("weight_four"))
        this.w_five = parseFloat(window.sessionStorage.getItem("weight_five"))
        this.w_six = parseFloat(window.sessionStorage.getItem("weight_six"))
        }


    checkClickCombination(previousButtonId, currentButtonId, blue_moves) {
        if (blue_moves.length == 0) {
            console.log("nanai")
            return false
        }
        console.log("####previousId", previousButtonId)
        console.log("####currentId", currentButtonId)
        console.log("####blue_moves", blue_moves)
        for (let index = 0; index < blue_moves.length; index++) {
            console.log("previousbuttonid0", previousButtonId[0][0], blue_moves[index][0][0], "currentid", [parseInt(currentButtonId[0]), parseInt(currentButtonId[2])], blue_moves[index][1])

            if (previousButtonId[0][0] == blue_moves[index][0][0] &&  previousButtonId[0][1] == blue_moves[index][0][1]) {
                console.log('please print!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                return true
            }
               
        }
        return false
    }


    canBlueMoveAgain(move, board) {
        let getMove = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.board)    
        let allMoves = getMove.getAllMoves(board)
        let blue_moves = allMoves[1]
        // check on all the all blue moves, if it is a jump and if the last jump is in the blue moves list, we return true
        for (let index = 0; index < blue_moves.length; index++){
            if (move[1].toString() == blue_moves[index][0].toString() && blue_moves[0][2] === 'jump') {   
                return true
            } 
        }
        return false
    }

    removeAllNeighborCss() {
        for (let row = 0; row <= 7; row++) {
            for (let collumn = 0; collumn <= 7; collumn++) {
                let checkerId = `${row},${collumn}`
                let checker = document.getElementById(checkerId)
                checker.classList.remove("neighbor_chosens")
            }
        }
    }

    checker_if_currentId_in_last_move_list(currentButtonId, blue_moves) {
        for (let index = 1; index < this.previousButtonId.length; index += 3) {
            if (this.previousButtonId[index] == currentButtonId) {
                return true
            }
        }
        
        return false
    }

    change_move_neighbor_css(blue_moves) {
        // check if current button is in the blue move list, if it is in then push them all into a list. then change the css of the list
        let result = []
        for (let index = 0; index < this.blue_moves.length; index++) {
            for (let index_move = 0; index_move < this.blue_moves[index].length; index_move += 3) {
                if (this.currentButtonId == this.blue_moves[index][index_move]) {
                    result = this.blue_moves[index]
                    break
                }
            }
        }
        for (let index_result = 0; index_result < result.length; index_result += 3) {
            if (result[index_result] == this.currentButtonId) {

                let domNeighbor = document.getElementById(result[index_result+1])
                domNeighbor.classList.add("neighbor_chosens")
            }
        }
    }
    
    returnLastBlueJump() {
        return this.blueCanJumpAgain
    }

    returnSuccessMove() {
        return this.successMove
    }
    
}

export default HandleButton