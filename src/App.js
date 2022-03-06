
import React from "react"
import './App.css'
import Board from "./components/Board"


class App extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef()
    this.btn = React.createRef()
    this.span = React.createRef()
    this.main_container = React.createRef()
  }

  openDaModal = () => {
    let refModal = this.modal
    this.modal.current.style.display = "block"

    console.log(this.span.current)

    this.span.current.onclick = function() {
      refModal.current.style.display = "none"
    }

    window.onclick = function(event) {
      
      if (event.target === refModal.current) {
        refModal.current.style.display = "none"
      }
    }
    
  }



  
  render() {
    return (
      <div className="main_container" ref={this.main_container}>
        <div className="name">Devin Ong - Software Developer</div>
        <div className="skills">HTML, CSS, JAVASCRIPT, PYTHON</div>
        <div className="quote">"Give me a lever long enough and I will move the world" - Archimedes</div>
        <div className="quote">Hi, I am Devin. I am a learner, a Software Developer and I hope my knowledge and your creativity can be the lever into great things.</div>
        <div className="quote">Meanwhile, click below to play a game with me. Click <a href="https://winning-moves.com/images/kingmerulesv2.pdf">here</a> for the rules.</div>
        <iv></iv>
        {/* <h2>Modal Example</h2> */}

        {/* <!-- Trigger/Open The Modal --> */}
        <button ref={this.btn} id="myBtn" onClick={this.openDaModal}>PLAY CHECKER</button>

        {/* <!-- The Modal --> */}
        <div ref={this.modal} id="myModal" className="modal">

          {/* <!-- Modal content --> */}
          <div className="modal-content">
            <span ref={this.span} className="close">&times;</span>
            {/* Checkers Board */}
            <Board/>



          </div>

        </div>
      </div>
    );
  }
}

export default App