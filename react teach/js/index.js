const  hellp_print=() => {console.log('hello! oncliock')
    
}

const  onMouss=() => {console.log('hello! onMouss')
    
}
3+2==2+5?console.log('2+3'):console.log('yo')
let par='priv how a u'
let element=<input placeholder={par} onClick={hellp_print} onMouseEnter={onMouss}></input>
const app=document.getElementById('app')
ReactDOM.render(element,app)
