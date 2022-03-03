import React from "react"
import GetMove from "./GetMoves"
import {cloneDeep} from "lodash"
import HandleButton from "./handleButton/HandleButton"
class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            skeleton: [
                        ['0', 'r','0' , 'r', '0', 'r' ,'0' , 'r'],
                        ['r', '0', 'r', '0', 'r', '0', 'r', '0'],
                        ['0', 'r', '0', 'r', '0', 'r', '0', 'r'],
                        ['1', '0', '1', '0', '1', '0', '1', '0'],
                        ['0', '1', '0', '1', '0', '1', '0', '1'],
                        ['b', '0', 'b', '0', 'b', '0', 'b', '0',],
                        ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
                        ['b', '0', 'b', '0', 'b', '0', 'b', '0',]
                     ],
            didBlueWin: false,
            didRedWin: false,
            lastButtonClicked: [],
            blueJumpLast: []
        }
        this.setStorage()
        this.getWeightFromStorage()
    }

    createSkeleton() {
        let rows = [0,1,2,3,4,5,6,7]
        let collumns = [...rows]

        return (
            <div>
                {rows.map( row =>  {return (<div>
                    {collumns.map( collumn => {
                        if (this.state.skeleton[row][collumn] === 'r') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker red_checker movable" id={[row, collumn]}>Red</button>)
                        }
                        else if (this.state.skeleton[row][collumn] === 'b') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker blue_checker movable" id={[row, collumn]}>Blue</button>)
                        }
                        else if (this.state.skeleton[row][collumn] === '0') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker no_checker not_movable" id={[row, collumn]}>Zero</button>)
                        }
                        else if (this.state.skeleton[row][collumn] === '1') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker movable" id={[row, collumn]}>One</button>)
                        }
                        else if (this.state.skeleton[row][collumn] === 'B') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker blue_king_checker movable" id={[row, collumn]}>BKing</button>)
                        }
                        else if (this.state.skeleton[row][collumn] === 'R') {
                            return (<button onClick={(event) => {this.handleCheckerButton(event)}} key={[row, collumn]} className="checker red_king_checker movable" id={[row, collumn]}>RKing</button>)
                        }
                    })}
                </div>)})}
            </div>
        )
    }


    setStorage = () => {
        if (window.sessionStorage.getItem("weight_one") === null) {
            window.sessionStorage.setItem("weight_zero", 0.25)
            window.sessionStorage.setItem("weight_one", 0.25)
            window.sessionStorage.setItem("weight_two", 0.25)
            window.sessionStorage.setItem("weight_three", 0.25)
            window.sessionStorage.setItem("weight_four", 0.25)
            window.sessionStorage.setItem("weight_five", 0.25)
            window.sessionStorage.setItem("weight_six", 0.25)
        }
    }

    getWeightFromStorage= () => {
        this.w_zero = parseFloat(window.sessionStorage.getItem("weight_zero"))
        this.w_one = parseFloat(window.sessionStorage.getItem("weight_one"))
        this.w_two = parseFloat(window.sessionStorage.getItem("weight_two"))
        this.w_three = parseFloat(window.sessionStorage.getItem("weight_three"))
        this.w_four = parseFloat(window.sessionStorage.getItem("weight_four"))
        this.w_five = parseFloat(window.sessionStorage.getItem("weight_five"))
        this.w_six = parseFloat(window.sessionStorage.getItem("weight_six"))
        }
    
    updateWeight = (weights) => {
        window.sessionStorage.setItem("weight_zero", weights[0])
        window.sessionStorage.setItem("weight_one", weights[1])
        window.sessionStorage.setItem("weight_two", weights[2])
        window.sessionStorage.setItem("weight_three", weights[3])
        window.sessionStorage.setItem("weight_four", weights[4])
        window.sessionStorage.setItem("weight_five", weights[5])
        window.sessionStorage.setItem("weight_six", weights[6])
        this.getWeightFromStorage()
    }

   
    canBlueMoveAgain = (move, board) => {
        let getMove = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, board)    
        let allMoves = getMove.getAllMoves(board)
        let blueMoves = allMoves[1]
        // check on all the all blue moves, if it is a jump and if the last jump is in the blue moves list, we return true
        for (let index = 0; index < blueMoves.length; index++){
            if (move[1].toString() == blueMoves[index][0].toString() && blueMoves[0][2] === 'jump') {
                return true
            } 
        }
        return false
    }
   

    handleCheckerButton = (event) => {
       
        let getMove = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.state.skeleton)    
        let all_moves = getMove.getAllMoves() // exp: [move1, move2,move3, move4] -> move1 = [[array], [array], "normal", [array], [array], "jump"]
        let red_moves = all_moves[0]
        let blue_moves = all_moves[1]
        
        let buttonId = event.target.id // exp: string like "2.5"
        this.setLastButtonClicked(blue_moves, event.target.id)
        // if currentButton is in the list of blue_moves, do nothing
        if (this.state.blueJumpLast.length > 0) {
            blue_moves = this.filterBlueMoves(blue_moves, this.state.blueJumpLast)
            let handleButton = new HandleButton(this.state.lastButtonClicked[0], event.target.id, blue_moves, this.state.skeleton, this.state.blueJumpLast)
            handleButton.mainFunction()
            if (handleButton.returnSuccessMove()) {
                this.setState({blueJumpLast: handleButton.returnLastBlueJump()})
                this.updateWeight(handleButton.getTheWeights())
            }
            
        }
        else{            
            let handleButton = new HandleButton(this.state.lastButtonClicked[0], event.target.id, blue_moves, this.state.skeleton, this.state.blueJumpLast)
            handleButton.mainFunction()
            if (handleButton.returnSuccessMove()) {
                this.setState({blueJumpLast: handleButton.returnLastBlueJump()})
                this.updateWeight(handleButton.getTheWeights())
            }
        }
        console.log('wtf is happening ')

        let getMove2 = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.state.skeleton)    
        let all_moves2 = getMove2.getAllMoves() // exp: [move1, move2,move3, move4] -> move1 = [[array], [array], "normal", [array], [array], "jump"]
        let red_moves2 = all_moves2[0]
        let blue_moves2 = all_moves2[1]

        if (red_moves2.length == 0) {
            console.log('whaosdhjasoldhalkhsdkahsdkajhskd')
            this.youWon()
        }
        else if (blue_moves2.length == 0) {
            this.youLost()
        }
    }

    filterBlueMoves = (blue_moves, last_jump) => {
        // filter out possible jump from the last jump, not from another checker even if that checker can jump
        let result = []
        for (let index = 0; index < blue_moves.length; index++) {
            if (last_jump[1][0] == blue_moves[index][0][0] && last_jump[1][1] == blue_moves[index][0][1]) {
                result.push(blue_moves[index])
            }
        }
        return result
    }

    setLastButtonClicked = (blue_moves, buttonId) => {
        let result = []
        for (let index = 0; index < blue_moves.length; index++) {
            for (let index_move = 0; index_move < blue_moves[index].length; index_move += 3) {
                if (buttonId == blue_moves[index][index_move]) {
                    result.push(blue_moves[index])
                    break
                }
            }
        }
        this.setState({lastButtonClicked: result})
    }

    didBlueWin = () => {
        for (let row = 0; row <= 7; row++) {
            for (let collumn = 0; collumn <= 7; collumn++) {
                let checkerId = `${row},${collumn}`
                let checker = document.getElementById(checkerId)

                if (this.state.skeleton[row][collumn] == 'r' || this.state.skeleton[row][collumn] == 'R') {
                    console.log("yes tehre is stil rrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                    return false
                }
            }
        }
        return true
    }

    

    updateCssFromSkeleton = () => {
        // loop through each checker
        let rows = [0,1,2,3,4,5,6,7]
        let collumns = [...rows]


        for (let row = 0; row <= 7; row++) {
            for (let collumn = 0; collumn <= 7; collumn++) {
                let checkerId = `${row},${collumn}`
                let checker = document.getElementById(checkerId)

                
                if (this.state.skeleton[row][collumn] === 'r') {
                    checker.removeAttribute("class")
                    checker.classList.add("red_checker")
                    checker.classList.add("movable")
                }
                else if (this.state.skeleton[row][collumn] === 'b') {
                    checker.removeAttribute("class")
                    checker.classList.add("blue_checker")
                    checker.classList.add("movable")
                }

                else if (this.state.skeleton[row][collumn] === 'R') {
                    checker.removeAttribute("class")
                    checker.classList.add("red_king_checker")
                    checker.classList.add("movable")
                }
                else if (this.state.skeleton[row][collumn] === 'B') {
                    checker.removeAttribute("class")
                    checker.classList.add("blue_king_checker")
                    checker.classList.add("movable")
                }
            }
        }
    }

    componentDidMount() {
        // this.updateCssFromSkeleton()
    }

    componentDidUpdate = () => {
        this.updateCssFromSkeleton()
    }

    // test //
    updateSkeletonTest= () => {
        this.setState({skeleton: [
            ['0', 'b','0' , 'r', '0', 'r' ,'0' , 'r'],
            ['r', '0', 'r', '0', 'r', '0', 'r', '0'],
            ['0', 'r', '0', 'r', '0', 'r', '0', 'r'],
            ['1', '0', '1', '0', '1', '0', '1', '0'],
            ['0', '1', '0', '1', '0', '1', '0', '1'],
            ['b', '0', 'b', '0', 'b', '0', 'b', '0',],
            ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
            ['b', '0', 'b', '0', 'b', '0', 'b', '0',]            
        ]})
    }

    getAllMoves = () => {
        let getMove = new GetMove(this.w_zero, this.w_one, this.w_two, this.w_three, this.w_four, this.w_five, this.w_six, this.state.skeleton)    
        let all_moves = getMove.getAllMoves()
        return all_moves
    }

    youWon = () => {
        window.alert("YOU WON!!!")
        this.resetSkeleton()
    }

    youLost = () => {
        window.alert("YOU LOST!!!")
        this.resetSkeleton()
    }
    resetSkeleton = () => {
        this.setState({skeleton: [
            ['0', 'r','0' , 'r', '0', 'r' ,'0' , 'r'],
            ['r', '0', 'r', '0', 'r', '0', 'r', '0'],
            ['0', 'r', '0', 'r', '0', 'r', '0', 'r'],
            ['1', '0', '1', '0', '1', '0', '1', '0'],
            ['0', '1', '0', '1', '0', '1', '0', '1'],
            ['b', '0', 'b', '0', 'b', '0', 'b', '0',],
            ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
            ['b', '0', 'b', '0', 'b', '0', 'b', '0',]            
        ]})
    }

    render() {
        return (
            <div className="modal_container">
                <div className="board">{this.createSkeleton()}</div>
                <button onClick={this.resetSkeleton} className="reset_board">RESET BOARD</button>
            </div>
            
        )
    }
}

export default Board